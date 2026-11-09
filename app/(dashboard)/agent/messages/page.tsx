import { Suspense } from "react";
import { ChatShell } from "@/components/chat/ChatShell";

export default function AgentMessagesPage() {
	return (
		<div className="mx-auto max-w-[1440px]">
			<Suspense>
				<ChatShell accentVariant="blue" />
			</Suspense>
		</div>
	);
}
