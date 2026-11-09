"use client";

import { useMemo, useState } from "react";
import {
	Building2,
	Check,
	CheckCheck,
	MessageSquarePlus,
	Search,
	ShieldCheck,
	UserPlus,
	X,
} from "lucide-react";
import {
	formatRelativeTime,
	type ChatConversation,
	type ChatParticipant,
	type UserRole,
} from "@/lib/chat/types";

interface ChatConversationListProps {
	currentUser: ChatParticipant | null;
	conversations: ChatConversation[];
	activeThreadKey: string | null;
	onSelectThread: (key: string) => void;
	onlineUserIds: Set<string>;
	typingByThread: Record<string, boolean>;
	directoryContacts: ChatParticipant[];
	onStartConversation: (partner: ChatParticipant) => void;
	accentVariant?: "sage" | "blue" | "teal";
}

const roleBadgeStyles: Record<UserRole, { label: string; classes: string }> = {
	agent: {
		label: "Agent",
		classes: "bg-blue-50 text-blue-700 border border-blue-200/80",
	},
	landlord: {
		label: "Landlord",
		classes: "bg-teal-50 text-teal-700 border border-teal-200/80",
	},
	client: {
		label: "Client",
		classes: "bg-sage-50 text-sage-700 border border-sage-200/80",
	},
	admin: {
		label: "Support",
		classes: "bg-slate-100 text-slate-700 border border-slate-200",
	},
};

function getInitials(name: string): string {
	return (
		name
			.trim()
			.split(/\s+/)
			.map((part) => part[0])
			.slice(0, 2)
			.join("")
			.toUpperCase() || "HS"
	);
}

export function ChatConversationList({
	currentUser,
	conversations,
	activeThreadKey,
	onSelectThread,
	onlineUserIds,
	typingByThread,
	directoryContacts,
	onStartConversation,
	accentVariant = "sage",
}: ChatConversationListProps) {
	const [search, setSearch] = useState("");
	const [filterTab, setFilterTab] = useState<"all" | "unread" | "agent" | "landlord" | "client">("all");
	const [directoryOpen, setDirectoryOpen] = useState(false);
	const [directoryQuery, setDirectoryQuery] = useState("");

	const accentButtonClass =
		accentVariant === "blue"
			? "bg-blue-600 hover:bg-blue-700 text-white"
			: accentVariant === "teal"
				? "bg-teal-600 hover:bg-teal-700 text-white"
				: "bg-brand-700 hover:bg-brand-600 text-white";

	const activeRowIndicatorClass =
		accentVariant === "blue"
			? "border-l-[3px] border-l-blue-600 bg-slate-50/90"
			: accentVariant === "teal"
				? "border-l-[3px] border-l-teal-600 bg-stone-50/90"
				: "border-l-[3px] border-l-sage-600 bg-stone-50/90";

	const unreadBadgeClass =
		accentVariant === "blue"
			? "bg-blue-600 text-white"
			: accentVariant === "teal"
				? "bg-teal-600 text-white"
				: "bg-sage-600 text-white";

	const availableTabs = useMemo(() => {
		const tabs: { id: typeof filterTab; label: string }[] = [
			{ id: "all", label: "All" },
			{ id: "unread", label: "Unread" },
		];
		if (currentUser?.role !== "agent") tabs.push({ id: "agent", label: "Agents" });
		if (currentUser?.role !== "landlord") tabs.push({ id: "landlord", label: "Landlords" });
		if (currentUser?.role !== "client") tabs.push({ id: "client", label: "Clients" });
		return tabs;
	}, [currentUser?.role]);

	const filteredConversations = useMemo(() => {
		const q = search.trim().toLowerCase();
		return conversations.filter((conv) => {
			if (filterTab === "unread" && conv.unreadCount === 0) return false;
			if (
				(filterTab === "agent" || filterTab === "landlord" || filterTab === "client") &&
				conv.partner.role !== filterTab
			) {
				return false;
			}
			if (!q) return true;
			const matchName = conv.partner.full_name.toLowerCase().includes(q);
			const matchRole = conv.partner.role.toLowerCase().includes(q);
			const matchProp = conv.property?.title.toLowerCase().includes(q) ?? false;
			const matchMsg = conv.lastMessage?.body.toLowerCase().includes(q) ?? false;
			return matchName || matchRole || matchProp || matchMsg;
		});
	}, [conversations, search, filterTab]);

	const filteredDirectory = useMemo(() => {
		const q = directoryQuery.trim().toLowerCase();
		return directoryContacts.filter((c) => {
			if (!q) return true;
			return (
				c.full_name.toLowerCase().includes(q) ||
				c.role.toLowerCase().includes(q) ||
				(c.email?.toLowerCase().includes(q) ?? false)
			);
		});
	}, [directoryContacts, directoryQuery]);

	return (
		<aside className="relative flex h-full w-full flex-col border-r border-slate-200/80 bg-white">
			<div className="border-b border-slate-100 px-3.5 sm:px-4 pb-3 pt-3.5">
				<div className="flex items-center justify-between gap-2">
					<div>
						<h2 className="text-sm sm:text-base font-black tracking-[-0.03em] text-slate-900">
							Messages
						</h2>
						<p className="text-[10px] sm:text-[11px] font-medium text-slate-400">
							{conversations.length} {conversations.length === 1 ? "conversation" : "conversations"}
						</p>
					</div>

					<button
						type="button"
						onClick={() => setDirectoryOpen(true)}
						className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-2.5 py-1.5 sm:px-3 text-[11px] sm:text-xs font-bold transition ${accentButtonClass}`}
						title="Start a new conversation"
					>
						<MessageSquarePlus className="h-3.5 w-3.5" />
						<span>New</span>
					</button>
				</div>

				<div className="relative mt-2.5">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search messages..."
						className="h-8.5 sm:h-9 w-full rounded-xl border border-slate-200/90 bg-slate-50/70 pl-8 pr-8 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none"
					/>
					{search && (
						<button
							type="button"
							onClick={() => setSearch("")}
							className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					)}
				</div>

				<div className="mt-2 flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
					{availableTabs.map((tab) => {
						const active = filterTab === tab.id;
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => setFilterTab(tab.id)}
								className={`cursor-pointer rounded-lg px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-bold shrink-0 transition ${
									active
										? "bg-slate-900 text-white"
										: "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
								}`}
							>
								{tab.label}
							</button>
						);
					})}
				</div>
			</div>

			<div className="flex-1 overflow-y-auto divide-y divide-slate-100/80">
				{filteredConversations.length === 0 ? (
					<div className="flex flex-col items-center justify-center px-6 py-12 text-center">
						<div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50 text-slate-400">
							<UserPlus className="h-5 w-5" />
						</div>
						<p className="mt-3 text-xs font-bold text-slate-800">
							{conversations.length === 0
								? "No conversations yet"
								: "No results match filter"}
						</p>
						<p className="mt-1 max-w-[200px] text-[11px] leading-relaxed text-slate-400">
							{conversations.length === 0
								? "Connect with agents, landlords, or tenants."
								: "Try clearing your search or switching tabs."}
						</p>
						{conversations.length === 0 && (
							<button
								type="button"
								onClick={() => setDirectoryOpen(true)}
								className={`mt-3.5 inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${accentButtonClass}`}
							>
								<MessageSquarePlus className="h-3.5 w-3.5" />
								Start Conversation
							</button>
						)}
					</div>
				) : (
					filteredConversations.map((conv) => {
						const isSelected = conv.key === activeThreadKey;
						const isOnline = onlineUserIds.has(conv.partner.id);
						const isTyping = Boolean(typingByThread[conv.key]);
						const roleBadge =
							roleBadgeStyles[conv.partner.role] ?? roleBadgeStyles.client;
						const lastMsg = conv.lastMessage;
						const isMine = lastMsg?.sender_id === currentUser?.id;

						return (
							<button
								key={conv.key}
								type="button"
								onClick={() => onSelectThread(conv.key)}
								className={`group flex w-full cursor-pointer items-start gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-3 text-left transition ${
									isSelected
										? activeRowIndicatorClass
										: "border-l-[3px] border-l-transparent hover:bg-slate-50/70"
								}`}
							>
								<div className="relative mt-0.5 h-9 w-9 sm:h-10 sm:w-10 shrink-0">
									{conv.partner.avatar_url ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={conv.partner.avatar_url}
											alt={conv.partner.full_name}
											className="h-full w-full rounded-xl object-cover border border-slate-200/80"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100 text-[11px] sm:text-xs font-black text-slate-700">
											{getInitials(conv.partner.full_name)}
										</div>
									)}
									<span
										className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-white ${
											isOnline ? "bg-emerald-500" : "bg-slate-300"
										}`}
										title={isOnline ? "Online now" : "Offline"}
									/>
								</div>

								<div className="min-w-0 flex-1">
									<div className="flex items-center justify-between gap-1.5">
										<div className="flex min-w-0 items-center gap-1.5">
											<span
												className={`truncate text-xs ${
													conv.unreadCount > 0
														? "font-black text-slate-900"
														: "font-bold text-slate-800"
												}`}
											>
												{conv.partner.full_name}
											</span>
											{conv.partner.verification_status === "verified" && (
												<ShieldCheck className="h-3.5 w-3.5 shrink-0 text-sage-600" />
											)}
											<span
												className={`hidden xs:inline-flex shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${roleBadge.classes}`}
											>
												{roleBadge.label}
											</span>
										</div>

										{lastMsg && (
											<span className="shrink-0 text-[10px] font-medium text-slate-400">
												{formatRelativeTime(lastMsg.created_at)}
											</span>
										)}
									</div>

									{conv.property && (
										<div className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-slate-500">
											<Building2 className="h-3 w-3 shrink-0 text-slate-400" />
											<span className="truncate">{conv.property.title}</span>
										</div>
									)}

									<div className="mt-1 flex items-center justify-between gap-2">
										<div className="min-w-0 flex-1">
											{isTyping ? (
												<span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-600">
													<span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
													Typing...
												</span>
											) : lastMsg ? (
												<p
													className={`flex items-center gap-1 truncate text-[11px] sm:text-xs ${
														conv.unreadCount > 0
															? "font-bold text-slate-900"
															: "font-normal text-slate-500"
													}`}
												>
													{isMine && (
														<span className="shrink-0 text-slate-400">
															{lastMsg.is_read ? (
																<CheckCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600" />
															) : (
																<Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
															)}
														</span>
													)}
													<span className="truncate">{lastMsg.body}</span>
												</p>
											) : (
												<p className="truncate text-[10px] sm:text-[11px] italic text-slate-400">
													New conversation ready
												</p>
											)}
										</div>

										{conv.unreadCount > 0 && (
											<span
												className={`inline-flex h-4.5 min-w-4.5 sm:h-5 sm:min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-[9px] sm:text-[10px] font-black ${unreadBadgeClass}`}
											>
												{conv.unreadCount}
											</span>
										)}
									</div>
								</div>
							</button>
						);
					})
				)}
			</div>

			{directoryOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 sm:p-4 backdrop-blur-[2px]">
					<div className="flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
						<div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4">
							<div>
								<h3 className="text-xs sm:text-sm font-black tracking-[-0.02em] text-slate-900">
									Start a Conversation
								</h3>
								<p className="text-[10px] sm:text-[11px] text-slate-400">
									Message verified members directly
								</p>
							</div>
							<button
								type="button"
								onClick={() => setDirectoryOpen(false)}
								className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						<div className="border-b border-slate-100 p-2.5 sm:p-3">
							<div className="relative">
								<Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
								<input
									type="text"
									value={directoryQuery}
									onChange={(e) => setDirectoryQuery(e.target.value)}
									placeholder="Search by name or role..."
									className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none"
									autoFocus
								/>
							</div>
						</div>

						<div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
							{filteredDirectory.length === 0 ? (
								<div className="py-8 text-center text-xs text-slate-400">
									No contacts found matching your search.
								</div>
							) : (
								filteredDirectory.map((person) => {
									const badge =
										roleBadgeStyles[person.role] ?? roleBadgeStyles.client;
									const isOnline = onlineUserIds.has(person.id);

									return (
										<button
											key={person.id}
											type="button"
											onClick={() => {
												onStartConversation(person);
												setDirectoryOpen(false);
											}}
											className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5 text-left transition hover:bg-slate-50"
										>
											<div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
												<div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0">
													<div className="flex h-full w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-[11px] sm:text-xs font-black text-slate-700">
														{getInitials(person.full_name)}
													</div>
													{isOnline && (
														<span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full border-2 border-white bg-emerald-500" />
													)}
												</div>
												<div className="min-w-0">
													<p className="truncate text-xs font-bold text-slate-900">
														{person.full_name}
													</p>
													<p className="truncate text-[10px] sm:text-[11px] text-slate-400">
														{person.email || "Verified member"}
													</p>
												</div>
											</div>
											<span
												className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase ${badge.classes}`}
											>
												{badge.label}
											</span>
										</button>
									);
								})
							)}
						</div>
					</div>
				</div>
			)}
		</aside>
	);
}
