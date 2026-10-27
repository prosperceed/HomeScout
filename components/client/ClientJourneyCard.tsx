import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import type { BookingWithProperty } from "@/lib/supabase/queries";

interface Props {
	bookings: BookingWithProperty[];
}

const stages = [
	{ key: "pending", label: "Pending review", color: "bg-amber-400", text: "text-amber-700" },
	{ key: "viewing", label: "Viewing scheduled", color: "bg-teal-500", text: "text-teal-700" },
	{ key: "approved", label: "Approved", color: "bg-sage-500", text: "text-sage-700" },
	{ key: "completed", label: "Moved in", color: "bg-brand-700", text: "text-slate-700" },
	{ key: "closed", label: "Declined / cancelled", color: "bg-stone-300", text: "text-slate-500" },
] as const;

export function ClientJourneyCard({ bookings }: Props) {
	const counts: Record<string, number> = {
		pending: 0,
		viewing: 0,
		approved: 0,
		completed: 0,
		closed: 0,
	};
	for (const b of bookings) {
		const key = b.status === "rejected" || b.status === "cancelled" ? "closed" : b.status;
		if (key in counts) counts[key] += 1;
	}
	const total = bookings.length;

	const nextStep =
		counts.approved > 0
			? { title: "Finalise your approved home", body: "Reach out to your agent to sign and move in." }
			: counts.viewing > 0
				? { title: "Prepare for your viewing", body: "Note your questions and confirm the time with your agent." }
				: counts.pending > 0
					? { title: "Hang tight", body: "Agents usually respond within 24–48 hours." }
					: { title: "Start your search", body: "Explore verified listings and send your first request." };

	return (
		<div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
			<div className="border-b border-slate-100 px-5 py-4 sm:px-6">
				<h2 className="text-base font-bold tracking-tight text-slate-900">
					Application Journey
				</h2>
				<p className="mt-0.5 text-xs text-slate-500">Where your requests stand</p>
			</div>

			<div className="flex flex-1 flex-col gap-5 px-5 py-5 sm:px-6">
				{/* Stacked progress bar */}
				<div>
					<div className="flex items-end justify-between">
						<p className="text-4xl font-black tracking-[-0.05em] text-slate-900">
							{total}
						</p>
						<p className="pb-1 text-xs font-semibold text-slate-400">
							total request{total !== 1 ? "s" : ""}
						</p>
					</div>
					<div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
						{total > 0 &&
							stages.map((s) =>
								counts[s.key] > 0 ? (
									<div
										key={s.key}
										className={`${s.color} h-full first:rounded-l-full last:rounded-r-full`}
										style={{ width: `${(counts[s.key] / total) * 100}%` }}
									/>
								) : null,
							)}
					</div>
				</div>

				{/* Legend */}
				<ul className="space-y-2.5">
					{stages.map((s) => (
						<li key={s.key} className="flex items-center justify-between text-sm">
							<span className="flex items-center gap-2.5 font-medium text-slate-600">
								<span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
								{s.label}
							</span>
							<span className={`font-black tabular-nums ${s.text}`}>
								{counts[s.key]}
							</span>
						</li>
					))}
				</ul>

				{/* Next step */}
				<div className="mt-auto rounded-xl border border-slate-200/80 bg-slate-50 p-4">
					<div className="flex items-start gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700">
							<Compass className="h-4 w-4" />
						</div>
						<div className="min-w-0">
							<p className="text-sm font-semibold text-slate-900">{nextStep.title}</p>
							<p className="mt-0.5 text-xs leading-relaxed text-slate-500">
								{nextStep.body}
							</p>
						</div>
					</div>
					<Link
						href={total > 0 ? "/client/applications" : "/explore"}
						className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 transition hover:gap-2"
					>
						{total > 0 ? "View applications" : "Explore homes"}
						<ArrowRight className="h-3.5 w-3.5" />
					</Link>
				</div>
			</div>
		</div>
	);
}

