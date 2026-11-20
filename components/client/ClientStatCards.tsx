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
			iconBg: "bg-coral-50 text-coral-600",
			chip: "bg-coral-50 text-coral-700",
			bar: "bg-coral-500",
			progress: Math.min(stats.savedCount * 10, 100),
		},
		{
			label: "Applications",
			value: stats.applicationsCount,
			note: "Total booking requests",
			href: "/client/applications",
			icon: Building2,
			iconBg: "bg-slate-100 text-slate-700",
			chip: "bg-slate-100 text-slate-700",
			bar: "bg-slate-800",
			progress: Math.min(stats.applicationsCount * 10, 100),
		},
		{
			label: "Shortlisted",
			value: stats.shortlistedCount,
			note: `${approvalRate}% approval rate`,
			href: "/client/applications",
			icon: CheckCircle2,
			iconBg: "bg-sage-50 text-sage-700",
			chip: "bg-sage-50 text-sage-700",
			bar: "bg-sage-600",
			progress: approvalRate,
		},
		{
			label: "Messages",
			value: stats.totalMessages,
			note:
				stats.unreadMessages > 0
					? `${stats.unreadMessages} unread`
					: "All caught up",
			href: "/client/messages",
			icon: MessageSquare,
			iconBg: "bg-teal-50 text-teal-700",
			chip: "bg-teal-50 text-teal-700",
			bar: "bg-teal-600",
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
						className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 transition-colors hover:border-slate-300 sm:p-5"
					>
						<div>
							<div className="flex items-center justify-between">
								<div
									className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${card.iconBg}`}
								>
									<Icon className="h-5 w-5" />
								</div>
								<span className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors group-hover:text-slate-900">
									<ArrowUpRight className="h-4 w-4" />
								</span>
							</div>

							<div className="mt-4 sm:mt-5">
								<p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
									{card.label}
								</p>
								<p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
									{card.value}
								</p>
							</div>
						</div>

						<div className="mt-4 space-y-2">
							<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
								<div
									className={`h-full rounded-full transition-all duration-500 ${card.bar}`}
									style={{ width: `${Math.max(card.progress, 6)}%` }}
								/>
							</div>
							<span
								className={`inline-block truncate rounded-md px-2 py-0.5 text-[10px] font-medium sm:text-xs ${card.chip}`}
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
