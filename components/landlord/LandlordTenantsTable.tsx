"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Users, Mail, Phone, MapPin, Building2 } from "lucide-react";
import type { BookingWithProperty } from "@/lib/supabase/queries";

type BookingStatus = "pending" | "approved" | "viewing" | "rejected" | "cancelled" | "completed";

const statusConfig: Record<string, { label: string; classes: string }> = {
	approved: { label: "Active Tenant", classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
	completed: { label: "Completed", classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
	viewing: { label: "Viewing Scheduled", classes: "bg-teal-50 text-teal-700 ring-1 ring-teal-200" },
	pending: { label: "Application Pending", classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
	rejected: { label: "Declined", classes: "bg-red-50 text-red-600 ring-1 ring-red-200" },
	cancelled: { label: "Cancelled", classes: "bg-slate-100 text-slate-500 ring-1 ring-slate-200" },
};

function formatPrice(n: number, period?: string | null) {
	const val =
		n >= 1_000_000
			? `₦${(n / 1_000_000).toFixed(1)}M`
			: n >= 1_000
				? `₦${(n / 1_000).toFixed(0)}k`
				: `₦${n.toLocaleString()}`;
	const p = period === "per_year" ? "/yr" : period === "per_month" ? "/mo" : "";
	return `${val}${p}`;
}

export function LandlordTenantsTable({ tenants }: { tenants: BookingWithProperty[] }) {
	const [query, setQuery] = useState("");

	const filtered = tenants.filter((t) => {
		const q = query.toLowerCase().trim();
		if (!q) return true;
		const name = t.client_profile?.full_name?.toLowerCase() ?? "";
		const email = t.client_profile?.email?.toLowerCase() ?? "";
		const property = t.property?.title?.toLowerCase() ?? "";
		return name.includes(q) || email.includes(q) || property.includes(q);
	});

	const activeCount = tenants.filter((t) => t.status === "approved" || t.status === "completed").length;
	const pendingCount = tenants.filter((t) => t.status === "pending" || t.status === "viewing").length;

	return (
		<div className="space-y-5">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="rounded-2xl border border-stone-200 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Records</p>
					<p className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900">{tenants.length}</p>
					<p className="mt-1 text-xs text-slate-400">All tenant engagements</p>
				</div>
				<div className="rounded-2xl border border-stone-200 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Tenants</p>
					<p className="mt-2 text-2xl font-black tracking-[-0.03em] text-emerald-600">{activeCount}</p>
					<p className="mt-1 text-xs text-slate-400">Current verified occupancies</p>
				</div>
				<div className="rounded-2xl border border-stone-200 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Inquiries</p>
					<p className="mt-2 text-2xl font-black tracking-[-0.03em] text-amber-600">{pendingCount}</p>
					<p className="mt-1 text-xs text-slate-400">Awaiting review or viewing</p>
				</div>
			</div>

			<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
				<div className="flex flex-col gap-3 border-b border-stone-100 p-5 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-base font-bold text-slate-900">Tenant Directory</h2>
						<p className="mt-0.5 text-xs text-slate-400">
							Active tenants and approved applicants across your properties
						</p>
					</div>
					<div className="relative min-w-[220px]">
						<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search by tenant or property..."
							className="h-9 w-full rounded-xl border border-stone-200 bg-stone-50/60 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
						/>
					</div>
				</div>

				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center px-4 py-16 text-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-slate-400">
							<Users className="h-6 w-6" />
						</div>
						<h3 className="mt-3 text-sm font-bold text-slate-800">
							{tenants.length === 0 ? "No tenants yet" : "No matching tenants found"}
						</h3>
						<p className="mt-1 max-w-sm text-xs text-slate-400">
							{tenants.length === 0
								? "When prospective tenants apply and get approved for your listings, their lease and contact details will appear here."
								: "Try adjusting your search criteria."}
						</p>
						{tenants.length === 0 && (
							<Link
								href="/landlord/properties/new"
								className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-700"
							>
								Add a Property Listing
							</Link>
						)}
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[700px] border-collapse text-left text-xs">
							<thead>
								<tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
									<th className="px-5 py-3.5">Tenant</th>
									<th className="px-4 py-3.5">Property</th>
									<th className="px-4 py-3.5">Rent / Price</th>
									<th className="px-4 py-3.5">Status</th>
									<th className="px-4 py-3.5">Date</th>
									<th className="px-4 py-3.5">Contact</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-stone-100">
								{filtered.map((item) => {
									const status = statusConfig[item.status] ?? statusConfig.pending;
									const tenantName = item.client_profile?.full_name || "Applicant";
									const initials = tenantName
										.split(" ")
										.map((n) => n[0])
										.slice(0, 2)
										.join("")
										.toUpperCase();

									return (
										<tr key={item.id} className="transition-colors hover:bg-stone-50/60">
											<td className="px-5 py-3.5">
												<div className="flex items-center gap-3">
													<div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xs font-black text-teal-700">
														{initials || "T"}
													</div>
													<div>
														<p className="font-bold text-slate-900">{tenantName}</p>
														<p className="text-[11px] text-slate-400">{item.client_profile?.email || "No email"}</p>
													</div>
												</div>
											</td>

											<td className="px-4 py-3.5">
												<p className="max-w-[200px] truncate font-semibold text-slate-800">
													{item.property?.title || "Property Listing"}
												</p>
												{item.property?.formatted_address && (
													<p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-400">
														<MapPin className="h-3 w-3 flex-shrink-0" />
														<span className="truncate">{item.property.formatted_address}</span>
													</p>
												)}
											</td>

											<td className="px-4 py-3.5 font-bold text-slate-900">
												{formatPrice(item.price_at_booking, item.price_period)}
											</td>

											<td className="px-4 py-3.5">
												<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${status.classes}`}>
													{status.label}
												</span>
											</td>

											<td className="px-4 py-3.5 text-slate-400">
												{new Date(item.created_at).toLocaleDateString("en-NG", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</td>

											<td className="px-4 py-3.5">
												<div className="flex items-center gap-2">
													{item.client_profile?.phone && (
														<a
															href={`tel:${item.client_profile.phone}`}
															className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 text-slate-500 hover:border-teal-400 hover:text-teal-600"
															title={item.client_profile.phone}
														>
															<Phone className="h-3.5 w-3.5" />
														</a>
													)}
													{item.client_profile?.email && (
														<a
															href={`mailto:${item.client_profile.email}`}
															className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 text-slate-500 hover:border-teal-400 hover:text-teal-600"
															title={item.client_profile.email}
														>
															<Mail className="h-3.5 w-3.5" />
														</a>
													)}
												</div>
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

