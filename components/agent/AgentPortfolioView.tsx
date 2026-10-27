"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Building2,
	MapPin,
	Bed,
	Bath,
	Plus,
	ExternalLink,
	Search,
} from "lucide-react";
import type { Tables } from "@/types/database.types";

type PropertyRow = Tables<"property_listings">;

const statusConfig: Record<string, { label: string; classes: string }> = {
	available: { label: "Available", classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
	rented: { label: "Rented", classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
	under_review: { label: "Under Review", classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
	inactive: { label: "Inactive", classes: "bg-slate-100 text-slate-500 ring-1 ring-slate-200" },
};

function formatPrice(n: number, period: string) {
	const val =
		n >= 1_000_000
			? `₦${(n / 1_000_000).toFixed(1)}M`
			: n >= 1_000
				? `₦${(n / 1_000).toFixed(0)}k`
				: `₦${n.toLocaleString()}`;
	const p =
		period === "per_year"
			? "/yr"
			: period === "per_month"
				? "/mo"
				: period === "per_night"
					? "/night"
					: "";
	return `${val}${p}`;
}

function getThumbnail(images: unknown): string | null {
	if (Array.isArray(images) && images.length > 0 && typeof images[0] === "string") {
		return images[0];
	}
	return null;
}

export function AgentPortfolioView({ properties }: { properties: PropertyRow[] }) {
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const filtered = properties.filter((p) => {
		const q = query.trim().toLowerCase();
		const matchesQuery =
			!q ||
			p.title.toLowerCase().includes(q) ||
			(p.formatted_address && p.formatted_address.toLowerCase().includes(q)) ||
			(p.state && p.state.toLowerCase().includes(q));

		const matchesStatus = statusFilter === "all" || p.status === statusFilter;
		return matchesQuery && matchesStatus;
	});

	const availableCount = properties.filter((p) => p.status === "available").length;
	const rentedCount = properties.filter((p) => p.status === "rented").length;
	const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);

	return (
		<div className="space-y-6">
			{/* Portfolio KPI Cards */}
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Listings</p>
					<p className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">{properties.length}</p>
					<p className="mt-1 text-xs text-slate-400">Under your management</p>
				</div>
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Available Units</p>
					<p className="mt-2 text-2xl font-black tracking-[-0.04em] text-emerald-600">{availableCount}</p>
					<p className="mt-1 text-xs text-slate-400">Ready for occupancy</p>
				</div>
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rented Units</p>
					<p className="mt-2 text-2xl font-black tracking-[-0.04em] text-blue-600">{rentedCount}</p>
					<p className="mt-1 text-xs text-slate-400">Actively leased</p>
				</div>
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Portfolio Value</p>
					<p className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">
						{totalValue > 0 ? formatPrice(totalValue, "total") : "₦0"}
					</p>
					<p className="mt-1 text-xs text-slate-400">Combined asset listing value</p>
				</div>
			</div>

			{/* Search & Filter Bar */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative min-w-[240px] flex-1 sm:max-w-xs">
					<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search your portfolio..."
						className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
					/>
				</div>

				<div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/50 p-0.5">
					{["all", "available", "rented"].map((s) => (
						<button
							key={s}
							onClick={() => setStatusFilter(s)}
							className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition ${
								statusFilter === s
									? "bg-white text-slate-900 shadow-sm"
									: "text-slate-500 hover:text-slate-900"
							}`}
						>
							{s}
						</button>
					))}
				</div>
			</div>

			{/* Property Grid */}
			{filtered.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-4 py-16 text-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
						<Building2 className="h-6 w-6" />
					</div>
					<h3 className="mt-3 text-sm font-bold text-slate-800">
						{properties.length === 0 ? "Portfolio is currently empty" : "No matching properties found"}
					</h3>
					<p className="mt-1 max-w-sm text-xs text-slate-400">
						{properties.length === 0
							? "Listings created and managed by your agency will appear here in your active portfolio."
							: "Try refining your search filter."}
					</p>
					{properties.length === 0 && (
						<Link
							href="/agent/properties/new"
							className="mt-4 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
						>
							<Plus className="h-3.5 w-3.5" />
							Add Property to Portfolio
						</Link>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((p) => {
						const thumb = getThumbnail(p.images);
						const status = statusConfig[p.status] ?? statusConfig.inactive;

						return (
							<div
								key={p.id}
								className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition hover:border-slate-300"
							>
								{/* Image */}
								<div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
									{thumb ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={thumb}
											alt={p.title}
											className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center text-slate-400">
											<Building2 className="h-8 w-8" />
										</div>
									)}
									<span
										className={`absolute right-3 top-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${status.classes}`}
									>
										{status.label}
									</span>
								</div>

								{/* Details */}
								<div className="p-4">
									<p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
										{p.listing_tag.replace(/_/g, " ")}
									</p>
									<h3 className="mt-1 truncate text-sm font-bold text-slate-900">{p.title}</h3>
									<p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-400">
										<MapPin className="h-3 w-3 flex-shrink-0" />
										<span className="truncate">{p.formatted_address ?? p.state ?? "No location"}</span>
									</p>

									<div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
										<span className="flex items-center gap-1">
											<Bed className="h-3.5 w-3.5 text-slate-400" />
											{p.bedrooms} beds
										</span>
										<span className="flex items-center gap-1">
											<Bath className="h-3.5 w-3.5 text-slate-400" />
											{p.bathrooms} baths
										</span>
									</div>

									<div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
										<p className="text-sm font-black text-slate-900">
											{formatPrice(p.price, p.price_period)}
										</p>
										<Link
											href={`/properties/${p.id}`}
											target="_blank"
											className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
										>
											View
											<ExternalLink className="h-3 w-3" />
										</Link>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

