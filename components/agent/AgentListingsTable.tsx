"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, MoreHorizontal, ChevronDown } from "lucide-react";

type DealStatus = "active" | "pending" | "closed" | "cancelled";

interface Listing {
	id: string;
	property: string;
	orderId: string;
	date: string;
	client: string;
	category: string;
	status: DealStatus;
	items: number;
	total: string;
}

const listings: Listing[] = [
	{
		id: "1",
		property: "3-Bed Apartment, Lekki Phase 1",
		orderId: "#HS-001",
		date: "Oct 10, 2026",
		client: "Emeka Okafor",
		category: "Family Apartment",
		status: "active",
		items: 3,
		total: "₦1,200,000",
	},
	{
		id: "2",
		property: "Studio Flat, Victoria Island",
		orderId: "#HS-002",
		date: "Oct 08, 2026",
		client: "Aisha Bello",
		category: "Shared Flat",
		status: "pending",
		items: 1,
		total: "₦480,000",
	},
	{
		id: "3",
		property: "4-Bed Duplex, Ikoyi",
		orderId: "#HS-003",
		date: "Oct 06, 2026",
		client: "Chidi Nwachukwu",
		category: "Duplex",
		status: "closed",
		items: 4,
		total: "₦3,600,000",
	},
	{
		id: "4",
		property: "2-Bed Apartment, Surulere",
		orderId: "#HS-004",
		date: "Oct 04, 2026",
		client: "Fatima Ibrahim",
		category: "Family Apartment",
		status: "active",
		items: 2,
		total: "₦720,000",
	},
	{
		id: "5",
		property: "Student Lodge, Yaba",
		orderId: "#HS-005",
		date: "Oct 02, 2026",
		client: "Tunde Adeyemi",
		category: "Student Lodge",
		status: "cancelled",
		items: 1,
		total: "₦240,000",
	},
	{
		id: "6",
		property: "Villa, Banana Island",
		orderId: "#HS-006",
		date: "Sep 30, 2026",
		client: "Ngozi Eze",
		category: "Villa",
		status: "closed",
		items: 5,
		total: "₦8,400,000",
	},
];

const statusConfig: Record<DealStatus, { label: string; classes: string }> = {
	active: { label: "Active", classes: "bg-green-50 text-green-700 ring-1 ring-green-200" },
	pending: { label: "Pending", classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
	closed: { label: "Closed", classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
	cancelled: { label: "Cancelled", classes: "bg-red-50 text-red-600 ring-1 ring-red-200" },
};

function StatusBadge({ status }: { status: DealStatus }) {
	const cfg = statusConfig[status];
	return (
		<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${cfg.classes}`}>
			{cfg.label}
		</span>
	);
}

export function AgentListingsTable({ onNewListing }: { onNewListing?: () => void }) {
	const [query, setQuery] = useState("");
	const [sortBy, setSortBy] = useState("date");
	const [selected, setSelected] = useState<string[]>([]);

	const filtered = listings.filter(
		(l) =>
			l.property.toLowerCase().includes(query.toLowerCase()) ||
			l.client.toLowerCase().includes(query.toLowerCase()) ||
			l.orderId.toLowerCase().includes(query.toLowerCase())
	);

	const toggleSelect = (id: string) => {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};

	const toggleAll = () => {
		setSelected(selected.length === filtered.length ? [] : filtered.map((l) => l.id));
	};

	return (
		<div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
				<h2 className="text-base font-black tracking-[-0.03em] text-slate-900">
					Recent Orders
				</h2>
				<div className="flex items-center gap-2">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search products..."
							className="h-8 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
						/>
					</div>
					<button
						className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
					>
						<SlidersHorizontal className="h-3.5 w-3.5" />
						Sort by
						<ChevronDown className="h-3 w-3" />
					</button>
					{onNewListing && (
						<button
							onClick={onNewListing}
							className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-1.5 text-xs font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)] transition hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)]"
						>
							+ New Listing
						</button>
					)}
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[700px]">
					<thead>
						<tr className="border-b border-slate-100">
							<th className="w-10 px-4 py-3.5">
								<input
									type="checkbox"
									checked={selected.length === filtered.length && filtered.length > 0}
									onChange={toggleAll}
									className="h-4 w-4 rounded-md border-slate-300 accent-blue-600"
								/>
							</th>
							{["Property Info", "Order Id", "Date", "Client", "Category", "Status", "Items", "Total"].map(
								(h) => (
									<th
										key={h}
										className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400"
									>
										{h}
									</th>
								)
							)}
							<th className="px-4 py-3.5" />
						</tr>
					</thead>
					<tbody>
						{filtered.length === 0 ? (
							<tr>
								<td colSpan={9} className="py-12 text-center text-sm text-slate-400">
									No listings found
								</td>
							</tr>
						) : (
							filtered.map((listing) => (
								<tr
									key={listing.id}
									className="group border-b border-slate-50 transition hover:bg-blue-50/40"
								>
									<td className="px-4 py-3.5">
										<input
											type="checkbox"
											checked={selected.includes(listing.id)}
											onChange={() => toggleSelect(listing.id)}
											className="h-4 w-4 rounded-md border-slate-300 accent-blue-600"
										/>
									</td>
									<td className="px-4 py-3.5">
										<p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">
											{listing.property}
										</p>
									</td>
									<td className="px-4 py-3.5 text-sm font-medium text-slate-500">
										{listing.orderId}
									</td>
									<td className="px-4 py-3.5 text-sm text-slate-500">
										{listing.date}
									</td>
									<td className="px-4 py-3.5 text-sm font-medium text-slate-700">
										{listing.client}
									</td>
									<td className="px-4 py-3.5">
										<span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
											{listing.category}
										</span>
									</td>
									<td className="px-4 py-3.5">
										<StatusBadge status={listing.status} />
									</td>
									<td className="px-4 py-3.5 text-sm font-semibold text-slate-700">
										{listing.items}
									</td>
									<td className="px-4 py-3.5 text-sm font-black text-slate-900">
										{listing.total}
									</td>
									<td className="px-4 py-3.5">
										<button
											aria-label="More"
											className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
										>
											<MoreHorizontal className="h-4 w-4" />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
