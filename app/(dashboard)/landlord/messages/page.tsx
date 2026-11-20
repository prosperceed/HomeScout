import { Suspense } from "react";
import { ChatShell } from "@/components/chat/ChatShell";

export default function LandlordMessagesPage() {
	return (
		<div className="mx-auto max-w-[1440px]">
			<Suspense>
				<ChatShell accentVariant="teal" />
			</Suspense>
		</div>
	);
}

