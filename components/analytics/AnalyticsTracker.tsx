"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
	const pathname = usePathname();
	useEffect(() => {
		void fetch("/api/analytics", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ event: "page_view", properties: { path: pathname, source: document.referrer || "direct" } }),
			keepalive: true,
		});
	}, [pathname]);
	return null;
}
