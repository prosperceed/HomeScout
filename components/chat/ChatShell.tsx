"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { useRealtimeChat } from "@/lib/chat/useRealtimeChat";
import { ChatConversationList } from "./ChatConversationList";
import { ChatThreadHeader } from "./ChatThreadHeader";
import { ChatMessageStream } from "./ChatMessageStream";
import { ChatComposer } from "./ChatComposer";
import { ChatContextPanel } from "./ChatContextPanel";

interface ChatShellProps {
	accentVariant?: "sage" | "blue" | "teal";
}

export function ChatShell({ accentVariant = "sage" }: ChatShellProps) {
	const searchParams = useSearchParams();
	const recipientParam = searchParams.get("recipient");
	const propertyParam = searchParams.get("property");

	const {
		currentUser,
		loading,
		conversations,
		activeConversation,
		activeThreadKey,
		setActiveThreadKey,
		directoryContacts,
		onlineUserIds,
		typingByThread,
		sendMessage,
		retryFailedMessage,
		emitTyping,
		startConversationWith,
	} = useRealtimeChat({
		initialPartnerId: recipientParam,
		initialPropertyId: propertyParam,
	});

	const [mobileView, setMobileView] = useState<"list" | "thread">(
		recipientParam ? "thread" : "list",
	);
	const [showContextPanel, setShowContextPanel] = useState(false);

	useEffect(() => {
		if (!activeConversation && mobileView === "thread") {
			setMobileView("list");
		}
	}, [activeConversation, mobileView]);

	if (loading) {
		return (
			<div className="-mx-4 -my-6 sm:mx-0 sm:my-0 flex h-[calc(100dvh-5.5rem)] sm:h-[calc(100dvh-7.5rem)] lg:h-[calc(100dvh-8rem)] w-auto sm:w-full items-center justify-center rounded-none sm:rounded-2xl border-y sm:border border-slate-200/80 bg-white">
				<div className="flex flex-col items-center gap-2 text-center">
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
					<p className="text-xs font-semibold text-slate-500">
						Connecting to real-time messaging...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="-mx-4 -my-6 sm:mx-0 sm:my-0 flex h-[calc(100dvh-5.5rem)] sm:h-[calc(100dvh-7.5rem)] lg:h-[calc(100dvh-8rem)] w-auto sm:w-full overflow-hidden rounded-none sm:rounded-2xl border-y sm:border border-slate-200/80 bg-white">
			<div
				className={`h-full w-full shrink-0 md:block md:w-[310px] lg:w-[340px] xl:w-[360px] ${
					mobileView === "list" ? "block" : "hidden"
				}`}
			>
				<ChatConversationList
					currentUser={currentUser}
					conversations={conversations}
					activeThreadKey={activeThreadKey}
					onSelectThread={(key) => {
						setActiveThreadKey(key);
						setMobileView("thread");
					}}
					onlineUserIds={onlineUserIds}
					typingByThread={typingByThread}
					directoryContacts={directoryContacts}
					onStartConversation={(partner) => {
						startConversationWith(partner);
						setMobileView("thread");
					}}
					accentVariant={accentVariant}
				/>
			</div>

			<div
				className={`flex h-full min-w-0 flex-1 flex-col ${
					mobileView === "thread" ? "flex" : "hidden md:flex"
				}`}
			>
				{activeConversation && currentUser ? (
					<div className="relative flex h-full min-w-0 flex-1 overflow-hidden">
						<div className="flex h-full min-w-0 flex-1 flex-col">
							<ChatThreadHeader
								conversation={activeConversation}
								isOnline={onlineUserIds.has(activeConversation.partner.id)}
								isTyping={Boolean(typingByThread[activeConversation.key])}
								showContextPanel={showContextPanel}
								onToggleContextPanel={() => setShowContextPanel((v) => !v)}
								onBackToList={() => setMobileView("list")}
							/>

							<ChatMessageStream
								currentUser={currentUser}
								conversation={activeConversation}
								isTyping={Boolean(typingByThread[activeConversation.key])}
								onSendQuickStarter={(text) => {
									sendMessage(text);
								}}
								onRetryMessage={retryFailedMessage}
								accentVariant={accentVariant}
							/>

							<ChatComposer
								onSend={sendMessage}
								onTyping={emitTyping}
								userRole={currentUser.role}
								partnerName={activeConversation.partner.full_name}
								accentVariant={accentVariant}
							/>
						</div>

						{showContextPanel && (
							<div className="hidden xl:block h-full shrink-0 w-80 border-l border-slate-200/80">
								<ChatContextPanel
									conversation={activeConversation}
									isOnline={onlineUserIds.has(activeConversation.partner.id)}
									onClose={() => setShowContextPanel(false)}
								/>
							</div>
						)}

						{showContextPanel && (
							<div className="fixed inset-0 z-50 xl:hidden">
								<div
									className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
									onClick={() => setShowContextPanel(false)}
								/>
								<div className="absolute inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-white shadow-2xl">
									<ChatContextPanel
										conversation={activeConversation}
										isOnline={onlineUserIds.has(activeConversation.partner.id)}
										onClose={() => setShowContextPanel(false)}
									/>
								</div>
							</div>
						)}
					</div>
				) : (
					<div className="flex h-full flex-col items-center justify-center bg-[#f8f7f4] p-6 sm:p-8 text-center">
						<div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white text-slate-400">
							<MessageSquare className="h-5 w-5" />
						</div>
						<h3 className="mt-3 text-xs sm:text-[13px] font-bold tracking-tight text-slate-900">
							Select a conversation
						</h3>
						<p className="mt-1 max-w-xs text-[11px] leading-relaxed text-slate-500">
							Choose a thread from the list or start a new conversation with an agent, landlord, or client.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
