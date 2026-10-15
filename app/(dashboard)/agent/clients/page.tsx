"use client";

import { Users, Search, MoreHorizontal, TrendingUp } from "lucide-react";

const clients = [
	{
		id: "1",
		name: "Emeka Okafor",
		email: "emeka@example.com",
		phone: "+234 801 234 5678",
		status: "active",
		properties: 2,
		totalValue: "₦2,400,000",
		joined: "Aug 2026",
	},
	{
		id: "2",
		name: "Aisha Bello",
		email: "aisha@example.com",
		phone: "+234 802 345 6789",
		status: "prospect",
		properties: 0,
		totalValue: "—",
		joined: "Sep 2026",
	},
	{
		id: "3",
		name: "Chidi Nwachukwu",
		email: "chidi@example.com",
		phone: "+234 803 456 7890",
		status: "closed",
		properties: 3,
		totalValue: "₦7,200,000",
		joined: "Jul 2026",
	},
	{
		id: "4",
		name: "Fatima Ibrahim",
		email: "fatima@example.com",
		phone: "+234 804 567 8901",
		status: "active",
		properties: 1,
		totalValue: "₦720,000",
		joined: "Sep 2026",
	},
	{
		id: "5",
		name: "Tunde Adeyemi",
		email: "tunde@example.com",
		phone: "+234 805 678 9012",
		status: "inactive",
		properties: 1,
		totalValue: "₦480,000",
		joined: "Jun 2026",
	},
];

const statusMap: Record<string, string> = {
	active: "bg-green-50 text-green-700 ring-1 ring-green-200",
	prospect: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
	closed: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
	inactive: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

export default function AgentClientsPage() {
	return (
		<div className="mx-auto max-w-[1400px] space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs font-bold uppercase tracking-widest text-slate-400">
						Clients
					</p>
					<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">
						Client Directory
					</h1>
					<p className="mt-0.5 text-sm text-slate-400">
						Manage and track your client relationships
					</p>
				</div>
				<button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 text-sm font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)] transition hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)]">
					<Users className="h-4 w-4" />
					Add Client
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{[
					{
						label: "Total Clients",
						value: "110",
						change: "+7.5%",
						color: "text-green-600",
					},
					{
						label: "Active Clients",
						value: "78",
						change: "+12%",
						color: "text-green-600",
					},
					{
						label: "New This Month",
						value: "14",
						change: "+3.2%",
						color: "text-blue-600",
					},
				].map((s) => (
					<div
						key={s.label}
						className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]"
					>
						<p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
							{s.label}
						</p>
						<div className="mt-2 flex items-end justify-between">
							<span className="text-3xl font-black tracking-[-0.04em] text-slate-900">
								{s.value}
							</span>
							<span
								className={`flex items-center gap-0.5 text-xs font-bold ${s.color}`}
							>
								<TrendingUp className="h-3.5 w-3.5" />
								{s.change}
							</span>
						</div>
					</div>
				))}
			</div>

			<div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
					<h2 className="text-base font-black tracking-[-0.03em] text-slate-900">
						All Clients
					</h2>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
						<input
							placeholder="Search clients…"
							className="h-8 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
						/>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full min-w-[600px]">
						<thead>
							<tr className="border-b border-slate-100">
								{[
									"Name",
									"Email",
									"Phone",
									"Status",
									"Properties",
									"Total Value",
									"Joined",
									"",
								].map((h) => (
									<th
										key={h}
										className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{clients.map((c) => (
								<tr
									key={c.id}
									className="group border-b border-slate-50 transition hover:bg-blue-50/40"
								>
									<td className="px-4 py-4">
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-black text-white">
												{c.name.charAt(0)}
											</div>
											<span className="text-sm font-semibold text-slate-800">
												{c.name}
											</span>
										</div>
									</td>
									<td className="px-4 py-4 text-sm text-slate-500">
										{c.email}
									</td>
									<td className="px-4 py-4 text-sm text-slate-500">
										{c.phone}
									</td>
									<td className="px-4 py-4">
										<span
											className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${statusMap[c.status]}`}
										>
											{c.status}
										</span>
									</td>
									<td className="px-4 py-4 text-sm font-semibold text-slate-700">
										{c.properties}
									</td>
									<td className="px-4 py-4 text-sm font-black text-slate-900">
										{c.totalValue}
									</td>
									<td className="px-4 py-4 text-sm text-slate-400">
										{c.joined}
									</td>
									<td className="px-4 py-4">
										<button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700">
											<MoreHorizontal className="h-4 w-4" />
										</button>
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
