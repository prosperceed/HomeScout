"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Users, Mail, Phone, MapPin, Building2, ExternalLink } from "lucide-react";
import type { BookingWithProperty } from "@/lib/supabase/queries";

const statusConfig: Record<string, { label: string; classes: string }> = {
	pending: { label: "Inquiry Pending", classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
	viewing: { label: "Viewing Set", classes: "bg-teal-50 text-teal-700 ring-1 ring-teal-200" },
	approved: { label: "Approved", classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
	completed: { label: "Deal Closed", classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
	rejected: { label: "Declined", classes: "bg-red-50 text-red-600 ring-1 ring-red-200" },
	cancelled: { label: "Cancelled", classes: "bg-slate-100 text-slate-500 ring-1 ring-slate-200" },
};

function formatPrice(n: number) {
	if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
	return `₦${n.toLocaleString()}`;
}

export function AgentClientsView({ bookings }: { bookings: BookingWithProperty[] }) {
	const [query, setQuery] = useState("");

	const uniqueClientsMap = new Map<string, {
		id: string;
		name: string;
		email: string;
		phone: string;
		latestProperty: string;
		status: string;
		totalValue: number;
		lastActive: string;
	}>();

	for (const b of bookings) {
		const clientId = b.client_id;
		const name = b.client_profile?.full_name || "Prospective Client";
		const email = b.client_profile?.email || "No email";
		const phone = b.client_profile?.phone || "No phone";
		const propertyTitle = b.property?.title || "Property Listing";

		if (!uniqueClientsMap.has(clientId)) {
			uniqueClientsMap.set(clientId, {
				id: clientId,
				name,
				email,
				phone,
				latestProperty: propertyTitle,
				status: b.status,
				totalValue: b.price_at_booking || 0,
				lastActive: b.created_at,
			});
		} else {
			const existing = uniqueClientsMap.get(clientId)!;
			existing.totalValue += b.price_at_booking || 0;
			if (b.status === "completed" || b.status === "approved") {
				existing.status = b.status;
			}
		}
	}

	const clients = Array.from(uniqueClientsMap.values());

	const filtered = clients.filter((c) => {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		return (
			c.name.toLowerCase().includes(q) ||
			c.email.toLowerCase().includes(q) ||
			c.phone.toLowerCase().includes(q) ||
			c.latestProperty.toLowerCase().includes(q)
		);
	});

	const activeCount = clients.filter(
		(c) => c.status === "pending" || c.status === "viewing" || c.status === "approved",
	).length;
	const closedCount = clients.filter((c) => c.status === "completed").length;

	return (
		<div className="space-y-6">
			{/* Metric Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
						Total Clients
					</p>
					<p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">
						{clients.length}
					</p>
					<p className="mt-1 text-xs text-slate-400">Total client relationships</p>
				</div>
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
						Active Inquiries
					</p>
					<p className="mt-2 text-3xl font-black tracking-[-0.04em] text-blue-600">
						{activeCount}
					</p>
					<p className="mt-1 text-xs text-slate-400">In review or viewing stages</p>
				</div>
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
						Closed Clients
					</p>
					<p className="mt-2 text-3xl font-black tracking-[-0.04em] text-emerald-600">
						{closedCount}
					</p>
					<p className="mt-1 text-xs text-slate-400">Successfully closed deals</p>
				</div>
			</div>

			{/* Client Directory Table */}
			<div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
				<div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-base font-bold text-slate-900">Client Directory</h2>
						<p className="mt-0.5 text-xs text-slate-400">
							Direct inquiries and active prospects for your properties
						</p>
					</div>
					<div className="relative min-w-[220px]">
						<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search clients..."
							className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
						/>
					</div>
				</div>

				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center px-4 py-16 text-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
							<Users className="h-6 w-6" />
						</div>
						<h3 className="mt-3 text-sm font-bold text-slate-800">
							{clients.length === 0 ? "No clients yet" : "No matching clients found"}
						</h3>
						<p className="mt-1 max-w-sm text-xs text-slate-400">
							{clients.length === 0
								? "As prospective buyers and tenants submit inquiries and viewing requests for your properties, their details will be organized here."
								: "Try adjusting your search keywords."}
						</p>
						{clients.length === 0 && (
							<Link
								href="/agent/properties/new"
								className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
							>
								Upload a Property to Attract Clients
							</Link>
						)}
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[700px] border-collapse text-left text-xs">
							<thead>
								<tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
									<th className="px-5 py-3.5">Client</th>
									<th className="px-4 py-3.5">Interest / Property</th>
									<th className="px-4 py-3.5">Status</th>
									<th className="px-4 py-3.5">Deal Volume</th>
									<th className="px-4 py-3.5">Last Active</th>
									<th className="px-4 py-3.5">Contact</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{filtered.map((c) => {
									const status = statusConfig[c.status] ?? statusConfig.pending;
									const initials = c.name
										.split(" ")
										.map((part) => part[0])
										.slice(0, 2)
										.join("")
										.toUpperCase();

									return (
										<tr key={c.id} className="transition-colors hover:bg-slate-50/60">
											<td className="px-5 py-3.5">
												<div className="flex items-center gap-3">
													<div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-700">
														{initials || "C"}
													</div>
													<div>
														<p className="font-bold text-slate-900">{c.name}</p>
														<p className="text-[11px] text-slate-400">{c.email}</p>
													</div>
												</div>
											</td>

											<td className="px-4 py-3.5 text-slate-700 font-medium">
												{c.latestProperty}
											</td>

											<td className="px-4 py-3.5">
												<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${status.classes}`}>
													{status.label}
												</span>
											</td>

											<td className="px-4 py-3.5 font-bold text-slate-900">
												{c.totalValue > 0 ? formatPrice(c.totalValue) : "In discussion"}
											</td>

											<td className="px-4 py-3.5 text-slate-400">
												{new Date(c.lastActive).toLocaleDateString("en-NG", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</td>

											<td className="px-4 py-3.5">
												<div className="flex items-center gap-2">
													{c.phone && c.phone !== "No phone" && (
														<a
															href={`tel:${c.phone}`}
															className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"
															title={c.phone}
														>
															<Phone className="h-3.5 w-3.5" />
														</a>
													)}
													{c.email && c.email !== "No email" && (
														<a
															href={`mailto:${c.email}`}
															className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"
															title={c.email}
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

