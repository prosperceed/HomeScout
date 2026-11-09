import { Suspense } from "react";
import { ChatShell } from "@/components/chat/ChatShell";

export default function ClientMessagesPage() {
	return (
		<div className="mx-auto max-w-[1440px]">
			<Suspense>
				<ChatShell accentVariant="sage" />
			</Suspense>
		</div>
	);
}
