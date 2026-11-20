import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const event = typeof body.event === "string" ? body.event.slice(0, 80) : "page_view";
		const properties = body.properties && typeof body.properties === "object" ? body.properties : {};
		const region = request.headers.get("x-vercel-ip-country-region") || request.headers.get("x-vercel-ip-country") || "Unknown";
		const city = request.headers.get("x-vercel-ip-city");
		const admin = createAdminClient();
		await admin.from("analytics_events").insert({
			event_name: event,
			region,
			city,
			path: typeof properties.path === "string" ? properties.path.slice(0, 300) : null,
			source: typeof properties.source === "string" ? properties.source.slice(0, 120) : null,
			properties,
		});

		const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		if (posthogKey) {
			await fetch(process.env.POSTHOG_HOST || "https://us.i.posthog.com/capture/", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ api_key: posthogKey, event, properties: { ...properties, region, city, distinct_id: properties.distinct_id || "anonymous" } }),
				cache: "no-store",
			});
		}
		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json({ ok: false }, { status: 202 });
	}
}
