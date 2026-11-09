export type UserRole = "client" | "landlord" | "agent" | "admin";

export interface ChatParticipant {
	id: string;
	full_name: string;
	email: string | null;
	phone: string | null;
	role: UserRole;
	avatar_url: string | null;
	verification_status?: "unverified" | "pending" | "verified" | "rejected";
}

export interface ChatPropertyContext {
	id: string;
	title: string;
	price: number;
	price_period: string;
	formatted_address: string | null;
	state: string | null;
	thumbnail: string;
	listing_tag: string;
	bedrooms?: number;
	bathrooms?: number;
}

export type MessageDeliveryStatus = "sending" | "sent" | "read" | "failed";

export interface ChatMessage {
	id: string;
	sender_id: string;
	recipient_id: string;
	property_id: string | null;
	booking_id: string | null;
	body: string;
	is_read: boolean;
	created_at: string;
	deliveryStatus?: MessageDeliveryStatus;
}

export interface ChatConversation {
	key: string;
	partner: ChatParticipant;
	property: ChatPropertyContext | null;
	messages: ChatMessage[];
	lastMessage: ChatMessage | null;
	unreadCount: number;
	updatedAt: string;
}

export function buildThreadKey(
	userA: string,
	userB: string,
	propertyId?: string | null,
): string {
	const [p1, p2] = [userA, userB].sort();
	return `${p1}:${p2}:${propertyId || "direct"}`;
}

export function resolvePropertyThumbnail(
	images: unknown,
	fallbackId?: string,
): string {
	if (Array.isArray(images) && images.length > 0) {
		const first = images[0];
		if (typeof first === "string" && first.trim()) return first;
		if (
			first &&
			typeof first === "object" &&
			"url" in first &&
			typeof (first as { url?: string }).url === "string"
		) {
			return (first as { url: string }).url;
		}
	}
	if (typeof images === "string" && images.trim()) {
		try {
			const parsed = JSON.parse(images);
			if (Array.isArray(parsed) && parsed.length > 0) {
				return resolvePropertyThumbnail(parsed, fallbackId);
			}
		} catch {
			return images;
		}
	}
	const fallbacks = [
		"/assets/house1.jpeg",
		"/assets/house2.jpeg",
		"/assets/house3.jpeg",
		"/assets/house4.jpeg",
	];
	if (fallbackId) {
		const code = fallbackId.charCodeAt(fallbackId.length - 1) || 0;
		return fallbacks[code % fallbacks.length];
	}
	return "/assets/house1.jpeg";
}

export function formatChatPrice(price: number, period?: string | null): string {
	const base =
		price >= 1_000_000
			? `₦${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}M`
			: price >= 1_000
				? `₦${(price / 1_000).toFixed(0)}k`
				: `₦${price.toLocaleString()}`;
	const suffix =
		period === "per_year"
			? "/yr"
			: period === "per_month"
				? "/mo"
				: period === "per_night"
					? "/night"
					: "";
	return `${base}${suffix}`;
}

export function formatRelativeTime(isoDate: string): string {
	const date = new Date(isoDate);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / 60_000);

	if (diffMin < 1) return "Just now";
	if (diffMin < 60) return `${diffMin}m`;

	const isSameDay =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();

	if (isSameDay) {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}

	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);
	const isYesterday =
		date.getDate() === yesterday.getDate() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getFullYear() === yesterday.getFullYear();

	if (isYesterday) return "Yesterday";

	return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}

export function formatMessageTimestamp(isoDate: string): string {
	const date = new Date(isoDate);
	return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDayDivider(isoDate: string): string {
	const date = new Date(isoDate);
	const now = new Date();

	const isToday =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();
	if (isToday) return "Today";

	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);
	const isYesterday =
		date.getDate() === yesterday.getDate() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getFullYear() === yesterday.getFullYear();
	if (isYesterday) return "Yesterday";

	return date.toLocaleDateString("en-NG", {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
	});
}

