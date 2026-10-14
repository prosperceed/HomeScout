"use client";

import { Briefcase, TrendingUp, MoreHorizontal } from "lucide-react";

const deals = [
	{ id: "D001", property: "3-Bed Apartment, Lekki", client: "Emeka Okafor", value: "₦1,200,000", stage: "negotiation", date: "Oct 10, 2026", probability: 75 },
	{ id: "D002", property: "4-Bed Duplex, Ikoyi", client: "Chidi Nwachukwu", value: "₦3,600,000", stage: "closed", date: "Oct 06, 2026", probability: 100 },
	{ id: "D003", property: "Studio Flat, VI", client: "Aisha Bello", value: "₦480,000", stage: "proposal", date: "Oct 08, 2026", probability: 40 },
	{ id: "D004", property: "2-Bed Apartment, Surulere", client: "Fatima Ibrahim", value: "₦720,000", stage: "qualification", date: "Oct 04, 2026", probability: 60 },
	{ id: "D005", property: "Villa, Banana Island", client: "Ngozi Eze", value: "₦8,400,000", stage: "closed", date: "Sep 30, 2026", probability: 100 },
];

const stageMap: Record<string, { label: string; classes: string }> = {
	qualification: { label: "Qualification", classes: "bg-slate-100 text-slate-600 ring-1 ring-slate-200" },
	proposal: { label: "Proposal", classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
	negotiation: { label: "Negotiation", classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
	closed: { label: "Closed Won", classes: "bg-green-50 text-green-700 ring-1 ring-green-200" },
};

export default function AgentDealsPage() {
	return (
		<div className="mx-auto max-w-[1400px] space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs font-bold uppercase tracking-widest text-slate-400">Deals</p>
					<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">Deal Pipeline</h1>
					<p className="mt-0.5 text-sm text-slate-400">Track and manage your active deals</p>
				</div>
				<button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 text-sm font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
					<Briefcase className="h-4 w-4" />
					New Deal
				</button>
			</div>

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{[
					{ label: "Total Deals", value: "72", gradient: true },
					{ label: "In Progress", value: "24", gradient: false },
					{ label: "Won This Month", value: "18", gradient: false },
					{ label: "Pipeline Value", value: "₦14.4M", gradient: false },
				].map((s) => (
					<div key={s.label} className={`rounded-2xl p-5 ${s.gradient ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[0_8px_32px_rgba(37,99,235,0.3)]" : "bg-white ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]"}`}>
						<p className={`text-xs font-semibold uppercase tracking-widest ${s.gradient ? "text-blue-100" : "text-slate-400"}`}>{s.label}</p>
						<p className={`mt-2 text-2xl font-black tracking-[-0.04em] ${s.gradient ? "text-white" : "text-slate-900"}`}>{s.value}</p>
					</div>
				))}
			</div>

			<div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
				<div className="border-b border-slate-100 px-6 py-5">
					<h2 className="text-base font-black tracking-[-0.03em] text-slate-900">All Deals</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full min-w-[600px]">
						<thead>
							<tr className="border-b border-slate-100">
								{["Deal ID", "Property", "Client", "Value", "Stage", "Probability", "Date", ""].map((h) => (
									<th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{deals.map((d) => {
								const s = stageMap[d.stage];
								return (
									<tr key={d.id} className="group border-b border-slate-50 transition hover:bg-blue-50/40">
										<td className="px-4 py-4 text-sm font-mono font-semibold text-slate-500">{d.id}</td>
										<td className="px-4 py-4 text-sm font-semibold text-slate-800">{d.property}</td>
										<td className="px-4 py-4 text-sm text-slate-600">{d.client}</td>
										<td className="px-4 py-4 text-sm font-black text-slate-900">{d.value}</td>
										<td className="px-4 py-4">
											<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${s.classes}`}>{s.label}</span>
										</td>
										<td className="px-4 py-4">
											<div className="flex items-center gap-2">
												<div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
													<div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: `${d.probability}%` }} />
												</div>
												<span className="text-xs font-bold text-slate-600">{d.probability}%</span>
											</div>
										</td>
										<td className="px-4 py-4 text-sm text-slate-400">{d.date}</td>
										<td className="px-4 py-4">
											<button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-100">
												<MoreHorizontal className="h-4 w-4" />
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
