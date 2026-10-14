import {
	ArrowUpRight,
	Building2,
	CheckCircle2,
	Clock,
	Heart,
	MessageSquare,
	MoreHorizontal,
	XCircle,
} from "lucide-react";
import { SpendingChart } from "@/components/ui/SpendingChart";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "pending" | "approved" | "rejected" | "viewing";

interface RecentOrder {
	id: string;
	agentOrLandlord: string;
	agentType: "Agent" | "Landlord" | "Company";
	propertyType: string;
	location: string;
	status: OrderStatus;
	price: number;
	pricePeriod: string;
	date: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const recentOrders: RecentOrder[] = [
	{
		id: "ORD-001",
		agentOrLandlord: "Premier Estates Ltd",
		agentType: "Company",
		propertyType: "Family Apartment",
		location: "Lekki Phase 1, Lagos",
		status: "approved",
		price: 1_800_000,
		pricePeriod: "yr",
		date: "Oct 12, 2026",
	},
	{
		id: "ORD-002",
		agentOrLandlord: "Mr. Chukwuemeka Eze",
		agentType: "Landlord",
		propertyType: "Duplex",
		location: "Asokoro, Abuja",
		status: "pending",
		price: 2_500_000,
		pricePeriod: "yr",
		date: "Oct 10, 2026",
	},
	{
		id: "ORD-003",
		agentOrLandlord: "Skyline Properties",
		agentType: "Company",
		propertyType: "Shared Flat",
		location: "Ikeja GRA, Lagos",
		status: "viewing",
		price: 550_000,
		pricePeriod: "yr",
		date: "Oct 8, 2026",
	},
	{
		id: "ORD-004",
		agentOrLandlord: "Mrs. Aisha Musa",
		agentType: "Landlord",
		propertyType: "Single Room",
		location: "Wuse 2, Abuja",
		status: "rejected",
		price: 280_000,
		pricePeriod: "yr",
		date: "Oct 5, 2026",
	},
	{
		id: "ORD-005",
		agentOrLandlord: "Homebase Realty",
		agentType: "Agent",
		propertyType: "Student Lodge",
		location: "Sabo, Ibadan",
		status: "pending",
		price: 180_000,
		pricePeriod: "yr",
		date: "Oct 3, 2026",
	},
	{
		id: "ORD-006",
		agentOrLandlord: "TrustHomes Agency",
		agentType: "Agent",
		propertyType: "Villa",
		location: "Banana Island, Lagos",
		status: "approved",
		price: 8_400_000,
		pricePeriod: "yr",
		date: "Sep 28, 2026",
	},
];

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig: Record<
	OrderStatus,
	{ label: string; bg: string; text: string; dot: string; icon: React.ElementType }
> = {
	approved: {
		label: "Approved",
		bg: "bg-sage-50",
		text: "text-sage-700",
		dot: "bg-sage-500",
		icon: CheckCircle2,
	},
	pending: {
		label: "Pending",
		bg: "bg-amber-50",
		text: "text-amber-700",
		dot: "bg-amber-400",
		icon: Clock,
	},
	viewing: {
		label: "Viewing",
		bg: "bg-teal-50",
		text: "text-teal-700",
		dot: "bg-teal-500",
		icon: ArrowUpRight,
	},
	rejected: {
		label: "Rejected",
		bg: "bg-rose-50",
		text: "text-rose-700",
		dot: "bg-rose-400",
		icon: XCircle,
	},
};

const agentTypeBadge: Record<
	RecentOrder["agentType"],
	{ bg: string; text: string }
> = {
	Company:  { bg: "bg-brand-100",  text: "text-brand-600"  },
	Landlord: { bg: "bg-coral-100",  text: "text-coral-700"  },
	Agent:    { bg: "bg-teal-100",   text: "text-teal-700"   },
};

// ─── Stat card definitions ─────────────────────────────────────────────────────
// Each card has its own full gradient background using site palette colors.
// Shadows are intentionally light — just a soft ring + faint drop shadow.

const stats = [
	{
		label: "Saved Homes",
		value: 18,
		icon: Heart,
		// coral → rose blend
		cardBg: "bg-gradient-to-br from-[#ff7a52] via-[#f95d2e] to-[#e04520]",
		iconBg: "bg-white/20",
		iconColor: "text-white",
		numColor: "text-white",
		labelColor: "text-white/80",
		changeColor: "text-white/70",
		moreColor: "text-white/50 hover:text-white hover:bg-white/15",
		change: "+3 this week",
		positive: true,
	},
	{
		label: "Applications",
		value: 6,
		icon: Building2,
		// brand slate → indigo blend
		cardBg: "bg-gradient-to-br from-[#334155] via-[#1e293b] to-[#0f172a]",
		iconBg: "bg-white/15",
		iconColor: "text-white",
		numColor: "text-white",
		labelColor: "text-white/75",
		changeColor: "text-white/60",
		moreColor: "text-white/40 hover:text-white hover:bg-white/10",
		change: "2 in review",
		positive: null,
	},
	{
		label: "Shortlisted",
		value: 4,
		icon: CheckCircle2,
		// sage → emerald blend
		cardBg: "bg-gradient-to-br from-[#4aba8a] via-[#33a674] to-[#268660]",
		iconBg: "bg-white/20",
		iconColor: "text-white",
		numColor: "text-white",
		labelColor: "text-white/80",
		changeColor: "text-white/70",
		moreColor: "text-white/50 hover:text-white hover:bg-white/15",
		change: "+1 new",
		positive: true,
	},
	{
		label: "Messages",
		value: 12,
		icon: MessageSquare,
		// teal → cyan blend
		cardBg: "bg-gradient-to-br from-[#5bb8cf] via-[#3a9db8] to-[#2d7f96]",
		iconBg: "bg-white/20",
		iconColor: "text-white",
		numColor: "text-white",
		labelColor: "text-white/80",
		changeColor: "text-white/70",
		moreColor: "text-white/50 hover:text-white hover:bg-white/15",
		change: "4 unread",
		positive: null,
	},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
	if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000)     return `₦${(n / 1_000).toFixed(0)}k`;
	return `₦${n}`;
}

function StatusBadge({ status }: { status: OrderStatus }) {
	const cfg = statusConfig[status];
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
		>
			<span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
			{cfg.label}
		</span>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClientDashboardPage() {
	return (
		<div className="space-y-8">

			{/* Page header — "Profile Active" badge removed */}
			<header>
				<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
					Dashboard
				</p>
				<h1 className="mt-1.5 text-4xl font-black tracking-[-0.04em] text-slate-900">
					Overview
				</h1>
			</header>

			{/* ── Stat Cards ─────────────────────────────────────────────────────── */}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<div
							key={stat.label}
							className={`group relative overflow-hidden rounded-3xl p-6 shadow-sm ring-1 ring-black/8 transition-transform duration-200 hover:-translate-y-0.5 ${stat.cardBg}`}
						>
							{/* subtle noise/texture overlay for depth */}
							<div className="pointer-events-none absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.75%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%20opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] opacity-40" />

							<div className="relative flex items-start justify-between">
								<div
									className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.iconBg}`}
								>
									<Icon className={`h-5 w-5 ${stat.iconColor}`} />
								</div>
								<button
									className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${stat.moreColor}`}
								>
									<MoreHorizontal className="h-4 w-4" />
								</button>
							</div>

							<div className="relative mt-4">
								<p className={`text-sm font-medium ${stat.labelColor}`}>
									{stat.label}
								</p>
								<p className={`mt-1 text-4xl font-black tracking-[-0.06em] ${stat.numColor}`}>
									{String(stat.value).padStart(2, "0")}
								</p>
							</div>

							<p className={`relative mt-3 text-xs font-semibold ${stat.changeColor}`}>
								{stat.change}
							</p>
						</div>
					);
				})}
			</div>

			{/* ── Spending Analytics Chart ────────────────────────────────────────── */}
			<SpendingChart />

			{/* ── Recent Applications Table ───────────────────────────────────────── */}
			<div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/60">
				<div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
					<div>
						<h2 className="text-lg font-black tracking-[-0.03em] text-slate-900">
							Recent Applications
						</h2>
						<p className="mt-0.5 text-sm text-slate-500">
							Your latest property enquiries &amp; bookings
						</p>
					</div>
					<button className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700">
						View all
						<ArrowUpRight className="h-3.5 w-3.5" />
					</button>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-stone-100 bg-stone-50/70">
								<th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
									Agent / Landlord
								</th>
								<th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
									Property Type
								</th>
								<th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
									Status
								</th>
								<th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
									Price
								</th>
								<th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
									Date
								</th>
								<th className="px-6 py-3.5" />
							</tr>
						</thead>
						<tbody className="divide-y divide-stone-100">
							{recentOrders.map((order) => {
								const typeBadge = agentTypeBadge[order.agentType];
								return (
									<tr
										key={order.id}
										className="group transition-colors hover:bg-stone-50/60"
									>
										<td className="px-6 py-4">
											<div className="flex flex-col gap-1">
												<span className="text-sm font-bold text-slate-800">
													{order.agentOrLandlord}
												</span>
												<div className="flex items-center gap-1.5">
													<span
														className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${typeBadge.bg} ${typeBadge.text}`}
													>
														{order.agentType}
													</span>
													<span className="text-xs text-slate-400">{order.location}</span>
												</div>
											</div>
										</td>
										<td className="px-4 py-4">
											<span className="text-sm font-medium text-slate-600">
												{order.propertyType}
											</span>
										</td>
										<td className="px-4 py-4">
											<StatusBadge status={order.status} />
										</td>
										<td className="px-4 py-4 text-right">
											<span className="text-sm font-black tracking-tight text-slate-900">
												{formatPrice(order.price)}
											</span>
											<span className="text-xs text-slate-400">/{order.pricePeriod}</span>
										</td>
										<td className="px-4 py-4 text-right">
											<span className="text-xs font-medium text-slate-400">
												{order.date}
											</span>
										</td>
										<td className="px-6 py-4">
											<button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-stone-100 hover:text-slate-600">
												<MoreHorizontal className="h-4 w-4" />
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				<div className="border-t border-stone-100 px-6 py-4">
					<p className="text-xs font-medium text-slate-400">
						Showing {recentOrders.length} of 6 applications
					</p>
				</div>
			</div>
		</div>
	);
}
