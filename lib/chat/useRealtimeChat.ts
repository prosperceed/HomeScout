"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { referencePropertyInquiryAction } from "@/app/actions/booking-actions";
import {
	buildThreadKey,
	resolvePropertyThumbnail,
	type ChatConversation,
	type ChatMessage,
	type ChatParticipant,
	type ChatPropertyContext,
	type UserRole,
} from "./types";

interface UseRealtimeChatOptions {
	initialPartnerId?: string | null;
	initialPropertyId?: string | null;
}

const TYPING_THROTTLE_MS = 2200;
const TYPING_EXPIRY_MS = 3400;
const READ_RECEIPT_DEBOUNCE_MS = 550;
const MIN_SEND_INTERVAL_MS = 280;

export function useRealtimeChat(options: UseRealtimeChatOptions = {}) {
	const { initialPartnerId, initialPropertyId } = options;

	const [currentUser, setCurrentUser] = useState<ChatParticipant | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeThreadKey, setActiveThreadKey] = useState<string | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [directoryContacts, setDirectoryContacts] = useState<ChatParticipant[]>([]);
	const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
	const [typingByThread, setTypingByThread] = useState<Record<string, boolean>>({});
	const [draftThreads, setDraftThreads] = useState<Record<string, { partner: ChatParticipant; property: ChatPropertyContext | null }>>({});

	const profileCacheRef = useRef<Map<string, ChatParticipant>>(new Map());
	const propertyCacheRef = useRef<Map<string, ChatPropertyContext>>(new Map());
	const seenMessageIdsRef = useRef<Set<string>>(new Set());
	const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);
	const lastTypingSentAtRef = useRef<number>(0);
	const lastMessageSentAtRef = useRef<number>(0);
	const typingTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
	const readDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pendingReadIdsRef = useRef<Set<string>>(new Set());

	const normalizeParticipant = useCallback((raw: any): ChatParticipant | null => {
		if (!raw || !raw.id) return null;
		const participant: ChatParticipant = {
			id: raw.id,
			full_name: raw.full_name || raw.email?.split("@")[0] || "HomeScout Member",
			email: raw.email ?? null,
			phone: raw.phone ?? null,
			role: (raw.role as UserRole) || "client",
			avatar_url: raw.avatar_url ?? null,
			verification_status: raw.verification_status ?? "unverified",
		};
		profileCacheRef.current.set(participant.id, participant);
		return participant;
	}, []);

	const normalizeProperty = useCallback((raw: any): ChatPropertyContext | null => {
		if (!raw || !raw.id) return null;
		const prop: ChatPropertyContext = {
			id: raw.id,
			title: raw.title || "Property Listing",
			price: Number(raw.price ?? 0),
			price_period: raw.price_period || "per_year",
			formatted_address: raw.formatted_address ?? null,
			state: raw.state ?? null,
			thumbnail: resolvePropertyThumbnail(raw.images, raw.id),
			listing_tag: raw.listing_tag || "for_rent",
			bedrooms: raw.bedrooms ?? 0,
			bathrooms: raw.bathrooms ?? 0,
		};
		propertyCacheRef.current.set(prop.id, prop);
		return prop;
	}, []);

	const ensureProfileLoaded = useCallback(
		async (userId: string): Promise<ChatParticipant | null> => {
			const cached = profileCacheRef.current.get(userId);
			if (cached) return cached;

			const supabase = createClient();
			const { data } = await supabase
				.from("profiles")
				.select("id, full_name, email, phone, role, avatar_url, verification_status")
				.eq("id", userId)
				.maybeSingle();

			if (data) return normalizeParticipant(data);
			return null;
		},
		[normalizeParticipant],
	);

	const ensurePropertyLoaded = useCallback(
		async (propertyId: string | null | undefined): Promise<ChatPropertyContext | null> => {
			if (!propertyId) return null;
			const cached = propertyCacheRef.current.get(propertyId);
			if (cached) return cached;

			const supabase = createClient();
			const { data } = await supabase
				.from("property_listings")
				.select("id, title, price, price_period, formatted_address, state, images, listing_tag, bedrooms, bathrooms")
				.eq("id", propertyId)
				.maybeSingle();

			if (data) return normalizeProperty(data);
			return null;
		},
		[normalizeProperty],
	);

	useEffect(() => {
		let mounted = true;
		const supabase = createClient();

		async function hydrate() {
			setLoading(true);
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user || !mounted) {
					setLoading(false);
					return;
				}

				const [myProfileRes, messagesRes, directoryRes] = await Promise.all([
					supabase
						.from("profiles")
						.select("id, full_name, email, phone, role, avatar_url, verification_status")
						.eq("id", user.id)
						.maybeSingle(),
					supabase
						.from("messages")
						.select(`
							id,
							booking_id,
							property_id,
							sender_id,
							recipient_id,
							body,
							is_read,
							created_at,
							sender:profiles!messages_sender_id_fkey(id, full_name, email, phone, role, avatar_url, verification_status),
							recipient:profiles!messages_recipient_id_fkey(id, full_name, email, phone, role, avatar_url, verification_status),
							property:property_listings!messages_property_id_fkey(id, title, price, price_period, formatted_address, state, images, listing_tag, bedrooms, bathrooms)
						`)
						.or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
						.order("created_at", { ascending: true })
						.limit(400),
					supabase
						.from("profiles")
						.select("id, full_name, email, phone, role, avatar_url, verification_status")
						.neq("id", user.id)
						.order("created_at", { ascending: false })
						.limit(40),
				]);

				if (!mounted) return;

				const me: ChatParticipant = normalizeParticipant(
					myProfileRes.data ?? {
						id: user.id,
						full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "You",
						email: user.email,
						phone: user.user_metadata?.phone ?? null,
						role: user.user_metadata?.role || "client",
						avatar_url: null,
					},
				)!;
				setCurrentUser(me);

				const contacts: ChatParticipant[] = [];
				for (const row of directoryRes.data ?? []) {
					const p = normalizeParticipant(row);
					if (p) contacts.push(p);
				}
				setDirectoryContacts(contacts);

				const loadedMessages: ChatMessage[] = [];
				for (const row of (messagesRes.data as any[]) ?? []) {
					if (row.sender) normalizeParticipant(row.sender);
					if (row.recipient) normalizeParticipant(row.recipient);
					if (row.property) normalizeProperty(row.property);

					seenMessageIdsRef.current.add(row.id);
					loadedMessages.push({
						id: row.id,
						sender_id: row.sender_id,
						recipient_id: row.recipient_id,
						property_id: row.property_id ?? null,
						booking_id: row.booking_id ?? null,
						body: row.body,
						is_read: Boolean(row.is_read),
						created_at: row.created_at,
						deliveryStatus: row.is_read ? "read" : "sent",
					});
				}
				setMessages(loadedMessages);

				if (initialPartnerId && initialPartnerId !== me.id) {
					const [partner, prop] = await Promise.all([
						ensureProfileLoaded(initialPartnerId),
						ensurePropertyLoaded(initialPropertyId),
					]);
					if (partner && mounted) {
						const key = buildThreadKey(me.id, partner.id, prop?.id ?? null);
						setDraftThreads((prev) => ({
							...prev,
							[key]: { partner, property: prop },
						}));
						setActiveThreadKey(key);

						if (prop?.id) {
							// Update property to under_review and ensure booking inquiry is recorded
							(async () => {
								try {
									const { data: rpcBookingId } = await supabase.rpc("reference_property_inquiry", {
										p_property_id: prop.id,
										p_partner_id: partner.id,
									});
									if (!rpcBookingId) {
										await supabase
											.from("property_listings")
											.update({ status: "under_review" })
											.eq("id", prop.id)
											.eq("status", "available");
									}
								} catch {
									try {
										await supabase
											.from("property_listings")
											.update({ status: "under_review" })
											.eq("id", prop.id)
											.eq("status", "available");
									} catch {
										// Silently handled
									}
								}
							})();
						}
					}
				}
			} catch (err) {
				console.error("Failed to initialize chat:", err);
			} finally {
				if (mounted) setLoading(false);
			}
		}

		hydrate();

		return () => {
			mounted = false;
		};
	}, [
		initialPartnerId,
		initialPropertyId,
		normalizeParticipant,
		normalizeProperty,
		ensureProfileLoaded,
		ensurePropertyLoaded,
	]);

	useEffect(() => {
		if (!currentUser) return;
		const supabase = createClient();
		const myId = currentUser.id;

		const channel = supabase.channel("homescout:realtime-chat-hub", {
			config: {
				presence: { key: myId },
				broadcast: { self: false },
			},
		});

		const ingestIncomingMessage = async (raw: any) => {
			if (!raw || !raw.id) return;
			if (raw.sender_id !== myId && raw.recipient_id !== myId) return;

			const partnerId = raw.sender_id === myId ? raw.recipient_id : raw.sender_id;
			await Promise.all([
				ensureProfileLoaded(partnerId),
				ensurePropertyLoaded(raw.property_id),
			]);

			setMessages((prev) => {
				if (seenMessageIdsRef.current.has(raw.id)) {
					return prev.map((m) =>
						m.id === raw.id
							? {
									...m,
									is_read: Boolean(raw.is_read),
									deliveryStatus: raw.is_read ? "read" : "sent",
								}
							: m,
					);
				}
				seenMessageIdsRef.current.add(raw.id);
				const incoming: ChatMessage = {
					id: raw.id,
					sender_id: raw.sender_id,
					recipient_id: raw.recipient_id,
					property_id: raw.property_id ?? null,
					booking_id: raw.booking_id ?? null,
					body: raw.body,
					is_read: Boolean(raw.is_read),
					created_at: raw.created_at || new Date().toISOString(),
					deliveryStatus: raw.is_read ? "read" : "sent",
				};
				return [...prev, incoming];
			});
		};

		channel
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
				},
				(payload: any) => {
					ingestIncomingMessage(payload.new);
				},
			)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "messages",
				},
				(payload: any) => {
					const updated = payload.new;
					if (!updated?.id) return;
					setMessages((prev) =>
						prev.map((m) =>
							m.id === updated.id
								? {
										...m,
										is_read: Boolean(updated.is_read),
										deliveryStatus: updated.is_read ? "read" : m.deliveryStatus,
									}
								: m,
						),
					);
				},
			)
			.on("broadcast", { event: "chat_message" }, ({ payload }: any) => {
				if (payload) {
					ingestIncomingMessage(payload);
				}
			})
			.on("broadcast", { event: "messages_read" }, ({ payload }: any) => {
				const ids: string[] = payload?.messageIds ?? [];
				if (ids.length === 0) return;
				const idSet = new Set(ids);
				setMessages((prev) =>
					prev.map((m) =>
						idSet.has(m.id) ? { ...m, is_read: true, deliveryStatus: "read" } : m,
					),
				);
			})
			.on("broadcast", { event: "typing" }, ({ payload }: any) => {
				if (!payload || payload.recipientId !== myId) return;
				const tKey = buildThreadKey(myId, payload.senderId, payload.propertyId ?? null);

				setTypingByThread((prev) => ({ ...prev, [tKey]: true }));

				const existingTimer = typingTimeoutsRef.current.get(tKey);
				if (existingTimer) clearTimeout(existingTimer);

				const timer = setTimeout(() => {
					setTypingByThread((prev) => {
						if (!prev[tKey]) return prev;
						const next = { ...prev };
						delete next[tKey];
						return next;
					});
				}, TYPING_EXPIRY_MS);

				typingTimeoutsRef.current.set(tKey, timer);
			})
			.on("presence", { event: "sync" }, () => {
				const state = channel.presenceState();
				const online = new Set<string>(Object.keys(state));
				setOnlineUserIds(online);
			})
			.subscribe(async (status) => {
				if (status === "SUBSCRIBED") {
					await channel.track({
						user_id: myId,
						online_at: new Date().toISOString(),
					});
				}
			});

		channelRef.current = channel;

		return () => {
			typingTimeoutsRef.current.forEach((t) => clearTimeout(t));
			typingTimeoutsRef.current.clear();
			if (readDebounceTimerRef.current) clearTimeout(readDebounceTimerRef.current);
			supabase.removeChannel(channel);
			channelRef.current = null;
		};
	}, [currentUser, ensureProfileLoaded, ensurePropertyLoaded]);

	const conversations = useMemo<ChatConversation[]>(() => {
		if (!currentUser) return [];
		const myId = currentUser.id;
		const map = new Map<string, ChatConversation>();

		for (const [key, draft] of Object.entries(draftThreads)) {
			map.set(key, {
				key,
				partner: draft.partner,
				property: draft.property,
				messages: [],
				lastMessage: null,
				unreadCount: 0,
				updatedAt: new Date(0).toISOString(),
			});
		}

		for (const msg of messages) {
			const partnerId = msg.sender_id === myId ? msg.recipient_id : msg.sender_id;
			if (!partnerId || partnerId === myId) continue;

			const partner =
				profileCacheRef.current.get(partnerId) ?? {
					id: partnerId,
					full_name: "HomeScout User",
					email: null,
					phone: null,
					role: "client",
					avatar_url: null,
				};

			const prop = msg.property_id
				? propertyCacheRef.current.get(msg.property_id) ?? null
				: null;

			const key = buildThreadKey(myId, partnerId, msg.property_id);
			let conv = map.get(key);

			if (!conv) {
				conv = {
					key,
					partner,
					property: prop,
					messages: [],
					lastMessage: null,
					unreadCount: 0,
					updatedAt: msg.created_at,
				};
				map.set(key, conv);
			} else {
				conv.partner = partner;
				if (prop && !conv.property) conv.property = prop;
			}

			conv.messages.push(msg);
			conv.lastMessage = msg;
			conv.updatedAt = msg.created_at;

			if (msg.recipient_id === myId && !msg.is_read) {
				conv.unreadCount += 1;
			}
		}

		const list = Array.from(map.values());
		list.sort((a, b) => {
			if (!a.lastMessage && b.lastMessage) return -1;
			if (a.lastMessage && !b.lastMessage) return 1;
			return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
		});

		return list;
	}, [currentUser, messages, draftThreads]);

	useEffect(() => {
		if (!activeThreadKey && conversations.length > 0) {
			setActiveThreadKey(conversations[0].key);
		}
	}, [activeThreadKey, conversations]);

	const activeConversation = useMemo(
		() => conversations.find((c) => c.key === activeThreadKey) ?? null,
		[conversations, activeThreadKey],
	);

	useEffect(() => {
		if (!currentUser || !activeConversation) return;
		const unreadIncoming = activeConversation.messages.filter(
			(m) => m.recipient_id === currentUser.id && !m.is_read,
		);
		if (unreadIncoming.length === 0) return;

		const unreadIds = unreadIncoming.map((m) => m.id);
		const idSet = new Set(unreadIds);

		setMessages((prev) =>
			prev.map((m) => (idSet.has(m.id) ? { ...m, is_read: true, deliveryStatus: "read" } : m)),
		);

		unreadIds.forEach((id) => pendingReadIdsRef.current.add(id));

		if (readDebounceTimerRef.current) {
			clearTimeout(readDebounceTimerRef.current);
		}

		readDebounceTimerRef.current = setTimeout(async () => {
			const batchIds = Array.from(pendingReadIdsRef.current);
			pendingReadIdsRef.current.clear();
			if (batchIds.length === 0) return;

			const supabase = createClient();
			await supabase
				.from("messages")
				.update({ is_read: true })
				.in("id", batchIds)
				.eq("recipient_id", currentUser.id);

			channelRef.current?.send({
				type: "broadcast",
				event: "messages_read",
				payload: {
					messageIds: batchIds,
					readerId: currentUser.id,
				},
			});
		}, READ_RECEIPT_DEBOUNCE_MS);
	}, [currentUser, activeConversation]);

	const emitTyping = useCallback(() => {
		if (!currentUser || !activeConversation || !channelRef.current) return;
		const now = Date.now();
		if (now - lastTypingSentAtRef.current < TYPING_THROTTLE_MS) return;
		lastTypingSentAtRef.current = now;

		channelRef.current.send({
			type: "broadcast",
			event: "typing",
			payload: {
				senderId: currentUser.id,
				recipientId: activeConversation.partner.id,
				propertyId: activeConversation.property?.id ?? null,
			},
		});
	}, [currentUser, activeConversation]);

	const sendMessage = useCallback(
		async (rawBody: string): Promise<boolean> => {
			const body = rawBody.trim();
			if (!body || !currentUser || !activeConversation) return false;

			const now = Date.now();
			if (now - lastMessageSentAtRef.current < MIN_SEND_INTERVAL_MS) {
				return false;
			}
			lastMessageSentAtRef.current = now;

			const messageId =
				typeof crypto !== "undefined" && "randomUUID" in crypto
					? crypto.randomUUID()
					: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

			const createdAt = new Date().toISOString();
			const optimisticMessage: ChatMessage = {
				id: messageId,
				sender_id: currentUser.id,
				recipient_id: activeConversation.partner.id,
				property_id: activeConversation.property?.id ?? null,
				booking_id: null,
				body,
				is_read: false,
				created_at: createdAt,
				deliveryStatus: "sending",
			};

			seenMessageIdsRef.current.add(messageId);
			setMessages((prev) => [...prev, optimisticMessage]);

			const supabase = createClient();
			const { error } = await supabase.from("messages").insert({
				id: messageId,
				sender_id: currentUser.id,
				recipient_id: activeConversation.partner.id,
				property_id: activeConversation.property?.id ?? null,
				body,
			});

			if (error) {
				console.error("Failed to send message:", error.message);
				setMessages((prev) =>
					prev.map((m) =>
						m.id === messageId ? { ...m, deliveryStatus: "failed" } : m,
					),
				);
				return false;
			}

			if (activeConversation.property?.id) {
				supabase
					.from("property_listings")
					.update({ status: "under_review" })
					.eq("id", activeConversation.property.id)
					.eq("status", "available")
					.then(() => {});
			}

			setMessages((prev) =>
				prev.map((m) =>
					m.id === messageId ? { ...m, deliveryStatus: "sent" } : m,
				),
			);

			channelRef.current?.send({
				type: "broadcast",
				event: "chat_message",
				payload: {
					...optimisticMessage,
					deliveryStatus: "sent",
				},
			});

			return true;
		},
		[currentUser, activeConversation],
	);

	const retryFailedMessage = useCallback(
		async (failedMessageId: string) => {
			const target = messages.find((m) => m.id === failedMessageId);
			if (!target || !currentUser) return;

			setMessages((prev) =>
				prev.map((m) =>
					m.id === failedMessageId ? { ...m, deliveryStatus: "sending" } : m,
				),
			);

			const supabase = createClient();
			const { error } = await supabase.from("messages").insert({
				id: target.id,
				sender_id: target.sender_id,
				recipient_id: target.recipient_id,
				property_id: target.property_id,
				body: target.body,
			});

			if (error) {
				setMessages((prev) =>
					prev.map((m) =>
						m.id === failedMessageId ? { ...m, deliveryStatus: "failed" } : m,
					),
				);
				return;
			}

			setMessages((prev) =>
				prev.map((m) =>
					m.id === failedMessageId ? { ...m, deliveryStatus: "sent" } : m,
				),
			);
		},
		[messages, currentUser],
	);

	const startConversationWith = useCallback(
		async (partner: ChatParticipant, property?: ChatPropertyContext | null) => {
			if (!currentUser) return;
			profileCacheRef.current.set(partner.id, partner);
			if (property) propertyCacheRef.current.set(property.id, property);

			const key = buildThreadKey(currentUser.id, partner.id, property?.id ?? null);
			setDraftThreads((prev) => ({
				...prev,
				[key]: { partner, property: property ?? null },
			}));
			setActiveThreadKey(key);
		},
		[currentUser],
	);

	const totalUnreadCount = useMemo(
		() => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
		[conversations],
	);

	return {
		currentUser,
		loading,
		conversations,
		activeConversation,
		activeThreadKey,
		setActiveThreadKey,
		directoryContacts,
		onlineUserIds,
		typingByThread,
		totalUnreadCount,
		sendMessage,
		retryFailedMessage,
		emitTyping,
		startConversationWith,
	};
}

