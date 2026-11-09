"use client";

import { useEffect, useMemo, useRef } from "react";
import {
	AlertCircle,
	Check,
	CheckCheck,
	Clock,
	Lock,
	RotateCcw,
} from "lucide-react";
import {
	formatDayDivider,
	formatMessageTimestamp,
	type ChatConversation,
	type ChatMessage,
	type ChatParticipant,
} from "@/lib/chat/types";

interface ChatMessageStreamProps {
	currentUser: ChatParticipant;
	conversation: ChatConversation;
	isTyping: boolean;
	onSendQuickStarter: (text: string) => void;
	onRetryMessage: (messageId: string) => void;
	accentVariant?: "sage" | "blue" | "teal";
}

interface MessageDayGroup {
	dayLabel: string;
	items: ChatMessage[];
}

export function ChatMessageStream({
	currentUser,
	conversation,
	isTyping,
	onSendQuickStarter,
	onRetryMessage,
	accentVariant = "sage",
}: ChatMessageStreamProps) {
	const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

	const outgoingBubbleClass =
		accentVariant === "blue"
			? "bg-blue-600 text-white"
			: accentVariant === "teal"
				? "bg-teal-700 text-white"
				: "bg-brand-700 text-white";

	const quickStarters = useMemo(() => {
		const propTitle = conversation.property?.title;
		if (currentUser.role === "client") {
			return [
				propTitle
					? `Hello ${conversation.partner.full_name.split(" ")[0]}, is "${propTitle}" currently available for inspection?`
					: `Hello ${conversation.partner.full_name.split(" ")[0]}, I am interested in your available listings.`,
				"Could I schedule a physical viewing this week?",
				"What are the complete move-in terms, service charges, and agency fees?",
			];
		}
		return [
			`Hello ${conversation.partner.full_name.split(" ")[0]}, thank you for reaching out on HomeScout. How can I assist you today?`,
			"The property is currently available for inspection. Which day works best for your viewing?",
			"Let me share the full breakdown of the lease terms and inspection schedule.",
		];
	}, [currentUser.role, conversation.partner.full_name, conversation.property?.title]);

	const groupedByDay = useMemo<MessageDayGroup[]>(() => {
		const groups: MessageDayGroup[] = [];
		for (const msg of conversation.messages) {
			const label = formatDayDivider(msg.created_at);
			const lastGroup = groups[groups.length - 1];
			if (!lastGroup || lastGroup.dayLabel !== label) {
				groups.push({ dayLabel: label, items: [msg] });
			} else {
				lastGroup.items.push(msg);
			}
		}
		return groups;
	}, [conversation.messages]);

	useEffect(() => {
		bottomAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [conversation.key, conversation.messages.length, isTyping]);

	return (
		<div className="flex-1 overflow-y-auto bg-[#f8f7f4] px-4 py-6 sm:px-6">
			<div className="mx-auto max-w-3xl space-y-6">
				<div className="flex items-center justify-center">
					<div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-white px-3 py-1 text-[11px] font-medium text-slate-500">
						<Lock className="h-3 w-3 text-sage-600" />
						<span>
							Direct HomeScout channel with{" "}
							<strong className="font-bold text-slate-800">
								{conversation.partner.full_name}
							</strong>
						</span>
					</div>
				</div>

				{conversation.messages.length === 0 ? (
					<div className="mx-auto mt-8 max-w-lg rounded-2xl border border-stone-200/90 bg-white p-6 text-center">
						<p className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Start the conversation
						</p>
						<h4 className="mt-1 text-base font-black tracking-[-0.02em] text-slate-900">
							Message {conversation.partner.full_name}
						</h4>
						<p className="mt-1 text-xs leading-relaxed text-slate-500">
							Select a quick prompt below or type your own message to begin in real time.
						</p>

						<div className="mt-4 flex flex-col gap-2 text-left">
							{quickStarters.map((prompt) => (
								<button
									key={prompt}
									type="button"
									onClick={() => onSendQuickStarter(prompt)}
									className="cursor-pointer rounded-xl border border-slate-200/90 bg-slate-50/70 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
								>
									&ldquo;{prompt}&rdquo;
								</button>
							))}
						</div>
					</div>
				) : (
					groupedByDay.map((group) => (
						<div key={group.dayLabel} className="space-y-3">
							<div className="relative flex items-center justify-center py-1">
								<div className="absolute inset-x-0 top-1/2 h-px bg-stone-200/80" />
								<span className="relative rounded-full border border-stone-200/90 bg-[#f8f7f4] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
									{group.dayLabel}
								</span>
							</div>

							<div className="space-y-1.5">
								{group.items.map((msg, idx) => {
									const isMine = msg.sender_id === currentUser.id;
									const nextMsg = group.items[idx + 1];
									const isLastInCluster =
										!nextMsg ||
										nextMsg.sender_id !== msg.sender_id ||
										new Date(nextMsg.created_at).getTime() -
											new Date(msg.created_at).getTime() >
											180_000;

									return (
										<div
											key={msg.id}
											className={`flex flex-col ${
												isMine ? "items-end" : "items-start"
											} ${isLastInCluster ? "pb-2" : ""}`}
										>
											<div
												className={`max-w-[84%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed break-words ${
													isMine
														? `${outgoingBubbleClass} ${
																isLastInCluster ? "rounded-br-sm" : ""
															}`
														: `border border-stone-200/90 bg-white text-slate-800 ${
																isLastInCluster ? "rounded-bl-sm" : ""
															}`
												}`}
											>
												<p className="whitespace-pre-wrap">{msg.body}</p>
											</div>

											{msg.deliveryStatus === "failed" && (
												<button
													type="button"
													onClick={() => onRetryMessage(msg.id)}
													className="mt-1 inline-flex cursor-pointer items-center gap-1 text-[11px] font-bold text-red-600 hover:underline"
												>
													<AlertCircle className="h-3 w-3" />
													<span>Delivery failed. Retry</span>
													<RotateCcw className="h-3 w-3" />
												</button>
											)}

											{isLastInCluster && msg.deliveryStatus !== "failed" && (
												<div
													className={`mt-1 flex items-center gap-1 px-1 text-[10px] font-medium text-slate-400 ${
														isMine ? "justify-end" : "justify-start"
													}`}
												>
													<span>{formatMessageTimestamp(msg.created_at)}</span>
													{isMine && (
														<span>
															{msg.deliveryStatus === "sending" ? (
																<Clock className="h-3 w-3 text-slate-400" />
															) : msg.is_read || msg.deliveryStatus === "read" ? (
																<CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
															) : (
																<Check className="h-3.5 w-3.5 text-slate-400" />
															)}
														</span>
													)}
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
					))
				)}

				{isTyping && (
					<div className="flex items-center gap-2 pt-1">
						<div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-stone-200/90 bg-white px-3.5 py-2.5">
							<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
							<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
							<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
						</div>
						<span className="text-[11px] font-medium text-slate-400">
							{conversation.partner.full_name.split(" ")[0]} is typing
						</span>
					</div>
				)}

				<div ref={bottomAnchorRef} />
			</div>
		</div>
	);
}

