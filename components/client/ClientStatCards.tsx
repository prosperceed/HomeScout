import Link from "next/link";
import {
	ArrowUpRight,
	Building2,
	CheckCircle2,
	Heart,
	MessageSquare,
} from "lucide-react";
import type { getClientStats } from "@/lib/supabase/queries";

type Stats = Awaited<ReturnType<typeof getClientStats>>;

interface Props {
	stats: Stats;
}

export function ClientStatCards({ stats }: Props) {
	const approvalRate =
		stats.applicationsCount > 0
			? Math.round((stats.shortlistedCount / stats.applicationsCount) * 100)
			: 0;

	const cards = [
		{
			label: "Saved Homes",
			value: stats.savedCount,
			note: stats.savedCount > 0 ? "Ready to revisit" : "Start your wishlist",
			href: "/client/saved",
			icon: Heart,
			iconBg: "from-coral-400 to-coral-600",
			iconShadow: "shadow-[0_8px_20px_-6px_rgba(249,93,46,0.55)]",
			glow: "bg-coral-200",
			chip: "bg-coral-50 text-coral-600",
			bar: "from-coral-300 to-coral-500",
			progress: Math.min(stats.savedCount * 10, 100),
		},
		{
			label: "Applications",
			value: stats.applicationsCount,
			note: "Total booking requests",
			href: "/client/applications",
			icon: Building2,
			iconBg: "from-brand-500 to-brand-700",
			iconShadow: "shadow-[0_8px_20px_-6px_rgba(15,23,42,0.55)]",
			glow: "bg-slate-200",
			chip: "bg-slate-100 text-slate-600",
			bar: "from-slate-400 to-slate-700",
			progress: Math.min(stats.applicationsCount * 10, 100),
		},
		{
			label: "Shortlisted",
			value: stats.shortlistedCount,
			note: `${approvalRate}% approval rate`,
			href: "/client/applications",
			icon: CheckCircle2,
			iconBg: "from-sage-400 to-sage-600",
			iconShadow: "shadow-[0_8px_20px_-6px_rgba(51,166,116,0.55)]",
			glow: "bg-sage-200",
			chip: "bg-sage-50 text-sage-700",
			bar: "from-sage-300 to-sage-500",
			progress: approvalRate,
		},
		{
			label: "Messages",
			value: stats.totalMessages,
			note:
				stats.unreadMessages > 0
					? `${stats.unreadMessages} unread`
					: "You're all caught up",
			href: "/client/messages",
			icon: MessageSquare,
			iconBg: "from-teal-400 to-teal-600",
			iconShadow: "shadow-[0_8px_20px_-6px_rgba(58,157,184,0.55)]",
			glow: "bg-teal-200",
			chip: "bg-teal-50 text-teal-700",
			bar: "from-teal-300 to-teal-500",
			progress:
				stats.totalMessages > 0
					? Math.round(
							((stats.totalMessages - stats.unreadMessages) /
								stats.totalMessages) *
								100,
						)
					: 100,
		},
	];

	return (
		<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
			{cards.map((card) => {
				const Icon = card.icon;
				return (
					<Link
						key={card.label}
						href={card.href}
						className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-4 ring-1 ring-stone-200/70 shadow-[0_2px_16px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.28)] hover:ring-stone-300/80 sm:p-6"
					>
						{/* Decorative glow */}
						<div
							className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-90 ${card.glow}`}
						/>

						<div className="relative flex items-start justify-between">
							<div
								className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br text-white sm:h-12 sm:w-12 ${card.iconBg} ${card.iconShadow}`}
							>
								<Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
							</div>
							<span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-50 text-slate-400 ring-1 ring-stone-200/70 transition-all duration-300 group-hover:rotate-45 group-hover:bg-slate-900 group-hover:text-white group-hover:ring-slate-900">
								<ArrowUpRight className="h-4 w-4" />
							</span>
						</div>

						<div className="relative mt-5 sm:mt-6">
							<p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
								{card.label}
							</p>
							<p className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-[2.6rem] sm:leading-none">
								{String(card.value).padStart(2, "0")}
							</p>
						</div>

						<div className="relative mt-4 space-y-2.5">
							<div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
								<div
									className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${card.bar}`}
									style={{ width: `${Math.max(card.progress, 6)}%` }}
								/>
							</div>
							<span
								className={`inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-[10px] font-bold sm:text-[11px] ${card.chip}`}
							>
								{card.note}
							</span>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
