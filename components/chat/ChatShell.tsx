"use client";

import { useState } from "react";
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
	const [showContextPanel, setShowContextPanel] = useState(true);

	if (loading) {
		return (
			<div className="flex h-[calc(100vh-8.5rem)] min-h-[540px] w-full items-center justify-center rounded-2xl border border-slate-200/80 bg-white">
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
		<div className="flex h-[calc(100vh-8.5rem)] min-h-[560px] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
			<div
				className={`h-full w-full shrink-0 md:block md:w-[330px] lg:w-[350px] ${
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
					<div className="flex h-full min-w-0 flex-1 overflow-hidden">
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
							<div className="hidden xl:block h-full shrink-0">
								<ChatContextPanel
									conversation={activeConversation}
									isOnline={onlineUserIds.has(activeConversation.partner.id)}
									onClose={() => setShowContextPanel(false)}
								/>
							</div>
						)}
					</div>
				) : (
					<div className="flex h-full flex-col items-center justify-center bg-[#f8f7f4] p-8 text-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-stone-200 bg-white text-slate-400">
							<MessageSquare className="h-5 w-5" />
						</div>
						<h3 className="mt-3.5 text-base font-black tracking-[-0.02em] text-slate-900">
							Select a conversation
						</h3>
						<p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
							Choose an existing thread on the left or start a new conversation with an agent, landlord, or client.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

