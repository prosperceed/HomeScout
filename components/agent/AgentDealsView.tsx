"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Search, ExternalLink, MapPin } from "lucide-react";
import type { BookingWithProperty } from "@/lib/supabase/queries";

const stageConfig: Record<string, { label: string; classes: string }> = {
	pending: { label: "Under Review", classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
	viewing: { label: "Viewing Set", classes: "bg-teal-50 text-teal-700 ring-1 ring-teal-200" },
	approved: { label: "Approved", classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
	completed: { label: "Closed Won", classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
	rejected: { label: "Declined", classes: "bg-red-50 text-red-600 ring-1 ring-red-200" },
	cancelled: { label: "Cancelled", classes: "bg-slate-100 text-slate-500 ring-1 ring-slate-200" },
};

function formatPrice(n: number) {
	if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
	return `₦${n.toLocaleString()}`;
}

export function AgentDealsView({ bookings }: { bookings: BookingWithProperty[] }) {
	const [query, setQuery] = useState("");

	const filtered = bookings.filter((b) => {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		const prop = b.property?.title?.toLowerCase() ?? "";
		const client = b.client_profile?.full_name?.toLowerCase() ?? "";
		const id = b.id.toLowerCase();
		return prop.includes(q) || client.includes(q) || id.includes(q);
	});

	const inProgressCount = bookings.filter((b) => b.status === "pending" || b.status === "viewing").length;
	const wonCount = bookings.filter((b) => b.status === "approved" || b.status === "completed").length;
	const totalPipelineValue = bookings.reduce((sum, b) => sum + (b.price_at_booking || 0), 0);

	return (
		<div className="space-y-6">
			{/* Real Metrics */}
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Deals</p>
					<p className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">{bookings.length}</p>
					<p className="mt-1 text-xs text-slate-400">All deal engagements</p>
				</div>
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">In Progress</p>
					<p className="mt-2 text-2xl font-black tracking-[-0.04em] text-blue-600">{inProgressCount}</p>
					<p className="mt-1 text-xs text-slate-400">Active negotiations</p>
				</div>
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Closed Won</p>
					<p className="mt-2 text-2xl font-black tracking-[-0.04em] text-emerald-600">{wonCount}</p>
					<p className="mt-1 text-xs text-slate-400">Successful agreements</p>
				</div>
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pipeline Value</p>
					<p className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">
						{totalPipelineValue > 0 ? formatPrice(totalPipelineValue) : "₦0"}
					</p>
					<p className="mt-1 text-xs text-slate-400">Gross deal volume</p>
				</div>
			</div>

			{/* Pipeline Table */}
			<div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
				<div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-base font-bold text-slate-900">Deal Pipeline</h2>
						<p className="mt-0.5 text-xs text-slate-400">
							Active proposals, viewings, and finalized transactions
						</p>
					</div>
					<div className="relative min-w-[220px]">
						<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search deals..."
							className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
						/>
					</div>
				</div>

				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center px-4 py-16 text-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
							<Briefcase className="h-6 w-6" />
						</div>
						<h3 className="mt-3 text-sm font-bold text-slate-800">
							{bookings.length === 0 ? "No deals in pipeline" : "No matching deals found"}
						</h3>
						<p className="mt-1 max-w-sm text-xs text-slate-400">
							{bookings.length === 0
								? "As clients interact with your property listings, active deals and bookings will automatically populate your pipeline."
								: "Try adjusting your search query."}
						</p>
						{bookings.length === 0 && (
							<Link
								href="/agent/properties/new"
								className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
							>
								Create a Listing
							</Link>
						)}
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[700px] border-collapse text-left text-xs">
							<thead>
								<tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
									<th className="px-5 py-3.5">Deal ID</th>
									<th className="px-4 py-3.5">Property</th>
									<th className="px-4 py-3.5">Client</th>
									<th className="px-4 py-3.5">Value</th>
									<th className="px-4 py-3.5">Stage</th>
									<th className="px-4 py-3.5">Date</th>
									<th className="px-4 py-3.5 text-right">View</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{filtered.map((d) => {
									const stage = stageConfig[d.status] ?? stageConfig.pending;
									const shortId = d.id.slice(0, 8).toUpperCase();

									return (
										<tr key={d.id} className="transition-colors hover:bg-slate-50/60">
											<td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-slate-500">
												#{shortId}
											</td>
											<td className="px-4 py-3.5">
												<p className="max-w-[220px] truncate font-bold text-slate-800">
													{d.property?.title || "Property"}
												</p>
												{d.property?.formatted_address && (
													<p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-400">
														<MapPin className="h-3 w-3 flex-shrink-0" />
														<span className="truncate">{d.property.formatted_address}</span>
													</p>
												)}
											</td>
											<td className="px-4 py-3.5">
												<p className="font-semibold text-slate-800">
													{d.client_profile?.full_name || "Prospective Client"}
												</p>
												<p className="text-[11px] text-slate-400">
													{d.client_profile?.email || "No email"}
												</p>
											</td>
											<td className="px-4 py-3.5 font-bold text-slate-900">
												{formatPrice(d.price_at_booking)}
											</td>
											<td className="px-4 py-3.5">
												<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${stage.classes}`}>
													{stage.label}
												</span>
											</td>
											<td className="px-4 py-3.5 text-slate-400">
												{new Date(d.created_at).toLocaleDateString("en-NG", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</td>
											<td className="px-4 py-3.5 text-right">
												{d.property?.id && (
													<Link
														href={`/properties/${d.property.id}`}
														target="_blank"
														className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
													>
														Property
														<ExternalLink className="h-3 w-3" />
													</Link>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}

