"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Search, ExternalLink, MapPin } from "lucide-react";
import type { BookingWithProperty } from "@/lib/supabase/queries";

function formatPrice(n: number) {
	if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
	return `₦${n.toLocaleString()}`;
}

export function AgentClosedView({ bookings }: { bookings: BookingWithProperty[] }) {
	const [query, setQuery] = useState("");

	// Closed transactions: completed or approved
	const closed = bookings.filter((b) => b.status === "completed" || b.status === "approved");

	const filtered = closed.filter((b) => {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		const prop = b.property?.title?.toLowerCase() ?? "";
		const client = b.client_profile?.full_name?.toLowerCase() ?? "";
		const id = b.id.toLowerCase();
		return prop.includes(q) || client.includes(q) || id.includes(q);
	});

	const totalValue = closed.reduce((sum, b) => sum + (b.price_at_booking || 0), 0);
	const estimatedCommission = totalValue * 0.1; // 10% typical agency commission

	return (
		<div className="space-y-6">
			{/* Metric Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Closed</p>
					<p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">{closed.length}</p>
					<p className="mt-1 text-xs text-slate-400">Successfully executed transactions</p>
				</div>
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Transaction Value</p>
					<p className="mt-2 text-3xl font-black tracking-[-0.04em] text-emerald-600">
						{totalValue > 0 ? formatPrice(totalValue) : "₦0"}
					</p>
					<p className="mt-1 text-xs text-slate-400">Gross closed volume</p>
				</div>
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estimated Commission</p>
					<p className="mt-2 text-3xl font-black tracking-[-0.04em] text-blue-600">
						{estimatedCommission > 0 ? formatPrice(estimatedCommission) : "₦0"}
					</p>
					<p className="mt-1 text-xs text-slate-400">10% standard agency rate</p>
				</div>
			</div>

			{/* Transactions Table */}
			<div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
				<div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-base font-bold text-slate-900">Closed Transactions</h2>
						<p className="mt-0.5 text-xs text-slate-400">
							History of finalized property rentals and sales
						</p>
					</div>
					<div className="relative min-w-[220px]">
						<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search closed transactions..."
							className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
						/>
					</div>
				</div>

				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center px-4 py-16 text-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
							<CheckCircle2 className="h-6 w-6" />
						</div>
						<h3 className="mt-3 text-sm font-bold text-slate-800">
							{closed.length === 0 ? "No closed transactions yet" : "No matching closed transactions"}
						</h3>
						<p className="mt-1 max-w-sm text-xs text-slate-400">
							{closed.length === 0
								? "Once property viewings and client applications are approved or marked completed, they will appear in this ledger."
								: "Try adjusting your search criteria."}
						</p>
						{closed.length === 0 && (
							<Link
								href="/agent/properties/new"
								className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
							>
								Create New Listing
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
									<th className="px-4 py-3.5">Deal Value</th>
									<th className="px-4 py-3.5">Est. Commission</th>
									<th className="px-4 py-3.5">Date</th>
									<th className="px-4 py-3.5 text-right">Property</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{filtered.map((b) => {
									const shortId = b.id.slice(0, 8).toUpperCase();
									const commission = (b.price_at_booking || 0) * 0.1;

									return (
										<tr key={b.id} className="transition-colors hover:bg-slate-50/60">
											<td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-slate-500">
												#{shortId}
											</td>
											<td className="px-4 py-3.5">
												<p className="max-w-[220px] truncate font-bold text-slate-800">
													{b.property?.title || "Property Listing"}
												</p>
												{b.property?.formatted_address && (
													<p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-400">
														<MapPin className="h-3 w-3 flex-shrink-0" />
														<span className="truncate">{b.property.formatted_address}</span>
													</p>
												)}
											</td>
											<td className="px-4 py-3.5">
												<p className="font-semibold text-slate-800">
													{b.client_profile?.full_name || "Client"}
												</p>
												<p className="text-[11px] text-slate-400">
													{b.client_profile?.email || "No email"}
												</p>
											</td>
											<td className="px-4 py-3.5 font-bold text-slate-900">
												{formatPrice(b.price_at_booking)}
											</td>
											<td className="px-4 py-3.5 font-bold text-emerald-600">
												{formatPrice(commission)}
											</td>
											<td className="px-4 py-3.5 text-slate-400">
												{new Date(b.created_at).toLocaleDateString("en-NG", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</td>
											<td className="px-4 py-3.5 text-right">
												{b.property?.id && (
													<Link
														href={`/properties/${b.property.id}`}
														target="_blank"
														className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
													>
														View
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

