"use client";

import { CheckCircle2, TrendingUp } from "lucide-react";

const closedDeals = [
	{ id: "D002", property: "4-Bed Duplex, Ikoyi", client: "Chidi Nwachukwu", value: "₦3,600,000", commission: "₦360,000", closedDate: "Oct 06, 2026", duration: "14 days" },
	{ id: "D005", property: "Villa, Banana Island", client: "Ngozi Eze", value: "₦8,400,000", commission: "₦840,000", closedDate: "Sep 30, 2026", duration: "21 days" },
	{ id: "D008", property: "3-Bed Apartment, GRA Ikeja", client: "Biodun Falope", value: "₦1,500,000", commission: "₦150,000", closedDate: "Sep 22, 2026", duration: "9 days" },
	{ id: "D011", property: "2-Bed, Ajah", client: "Chiamaka Obi", value: "₦600,000", commission: "₦60,000", closedDate: "Sep 15, 2026", duration: "7 days" },
	{ id: "D014", property: "Duplex, Magodo Phase 2", client: "Sola Adesanya", value: "₦2,400,000", commission: "₦240,000", closedDate: "Sep 10, 2026", duration: "12 days" },
];

export default function AgentClosedPage() {
	const totalCommission = "₦1,650,000";
	const totalValue = "₦16,500,000";

	return (
		<div className="mx-auto max-w-[1400px] space-y-6">
			<div>
				<p className="text-xs font-bold uppercase tracking-widest text-slate-400">Closed Deals</p>
				<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">Closed Deals</h1>
				<p className="mt-0.5 text-sm text-slate-400">Your successfully closed transactions</p>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-5 text-white shadow-[0_8px_32px_rgba(37,99,235,0.3)]">
					<p className="text-xs font-semibold uppercase tracking-widest text-blue-100">Total Closed</p>
					<p className="mt-2 text-3xl font-black">72</p>
					<div className="mt-1.5 flex items-center gap-1 text-xs font-bold text-green-300">
						<TrendingUp className="h-3.5 w-3.5" /> +20% this quarter
					</div>
				</div>
				<div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
					<p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total Value</p>
					<p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">{totalValue}</p>
					<p className="mt-1 text-xs text-slate-400">Across all closed deals</p>
				</div>
				<div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
					<p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total Commission</p>
					<p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">{totalCommission}</p>
					<p className="mt-1 text-xs text-slate-400">10% avg commission rate</p>
				</div>
			</div>

			<div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
				<div className="border-b border-slate-100 px-6 py-5">
					<h2 className="text-base font-black tracking-[-0.03em] text-slate-900">Closed Transactions</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full min-w-[600px]">
						<thead>
							<tr className="border-b border-slate-100">
								{["Deal ID", "Property", "Client", "Deal Value", "Commission Earned", "Closed Date", "Duration"].map((h) => (
									<th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{closedDeals.map((d) => (
								<tr key={d.id} className="group border-b border-slate-50 transition hover:bg-blue-50/40">
									<td className="px-4 py-4 text-sm font-mono font-semibold text-slate-500">{d.id}</td>
									<td className="px-4 py-4 text-sm font-semibold text-slate-800">{d.property}</td>
									<td className="px-4 py-4 text-sm text-slate-600">{d.client}</td>
									<td className="px-4 py-4 text-sm font-black text-slate-900">{d.value}</td>
									<td className="px-4 py-4">
										<span className="text-sm font-black text-green-700">{d.commission}</span>
									</td>
									<td className="px-4 py-4 text-sm text-slate-400">{d.closedDate}</td>
									<td className="px-4 py-4">
										<span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
											<CheckCircle2 className="h-3 w-3" />
											{d.duration}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
