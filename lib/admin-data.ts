import { createAdminClient } from "@/lib/supabase/admin";

export type AdminDashboardData = {
	users: number;
	listings: number;
	volume: number;
	escrow: number;
	revenue: number;
	queued: number;
	completed: number;
	visits: number;
	regions: Array<{ name: string; visits: number }>;
	trend: Array<{ day: string; activity: number; volume: number }>;
	bookings: Array<Record<string, unknown>>;
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
	const admin = createAdminClient();
	const since = new Date(Date.now() - 30 * 86400000).toISOString();
	const [users, listings, bookings, events] = await Promise.all([
		admin.from("profiles").select("id", { count: "exact", head: true }),
		admin.from("property_listings").select("id", { count: "exact", head: true }),
		admin.from("bookings").select("id, status, payment_status, escrow_status, price_at_booking, payment_amount, platform_fee, client_id, property_id, created_at, paid_at").order("created_at", { ascending: false }).limit(100),
		admin.from("analytics_events").select("region, occurred_at").gte("occurred_at", since),
	]);

	const rows = bookings.data ?? [];
	const eventRows = events.data ?? [];
	const byRegion = new Map<string, number>();
	for (const event of eventRows) {
		const region = event.region || "Unknown";
		byRegion.set(region, (byRegion.get(region) ?? 0) + 1);
	}
	const trend = new Map<string, { activity: number; volume: number }>();
	for (let i = 29; i >= 0; i--) trend.set(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10), { activity: 0, volume: 0 });
	for (const event of eventRows) trend.get(event.occurred_at.slice(0, 10))!.activity += 1;
	for (const booking of rows) {
		const entry = trend.get(booking.created_at.slice(0, 10));
		if (entry) entry.volume += Number(booking.payment_amount ?? booking.price_at_booking ?? 0);
	}

	return {
		users: users.count ?? 0,
		listings: listings.count ?? 0,
		volume: rows.reduce((sum, row) => sum + Number(row.payment_amount ?? row.price_at_booking ?? 0), 0),
		escrow: rows.filter((row) => ["queued", "held"].includes(row.escrow_status) || (["pending", "viewing", "approved"].includes(row.status) && row.payment_status !== "paid")).reduce((sum, row) => sum + Number(row.payment_amount ?? row.price_at_booking ?? 0), 0),
		revenue: rows.filter((row) => row.payment_status === "paid").reduce((sum, row) => sum + Number(row.platform_fee ?? 0), 0),
		queued: rows.filter((row) => ["pending", "viewing", "approved"].includes(row.status) && row.payment_status !== "paid").length,
		completed: rows.filter((row) => row.status === "completed" && row.payment_status === "paid").length,
		visits: eventRows.length,
		regions: [...byRegion.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, visits]) => ({ name, visits })),
		trend: [...trend.entries()].map(([day, value]) => ({ day, ...value })),
		bookings: rows,
	};
}
