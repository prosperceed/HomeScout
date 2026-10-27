"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database.types";
import {
	Building2,
	MapPin,
	Plus,
	Search,
	SlidersHorizontal,
	ExternalLink,
	Sparkles,
} from "lucide-react";

type PropertyRow = Tables<"property_listings">;

const statusConfig: Record<string, { label: string; classes: string }> = {
	available: {
		label: "Available",
		classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
	},
	rented: {
		label: "Rented",
		classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
	},
	under_review: {
		label: "Under review",
		classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
	},
	inactive: {
		label: "Inactive",
		classes: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
	},
};

const tagConfig: Record<string, { label: string; classes: string }> = {
	for_sale: { label: "For Sale", classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
	for_rent: { label: "For Rent", classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
	shortlet: { label: "Shortlet", classes: "bg-purple-50 text-purple-700 ring-1 ring-purple-200" },
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

function getThumbnail(images: unknown, fallbackId?: string): string {
	if (Array.isArray(images) && images.length > 0) {
		const first = images[0];
		if (typeof first === "string" && first.trim()) return first;
		if (first && typeof first === "object" && "url" in first && typeof (first as { url?: string }).url === "string") {
			return (first as { url: string }).url;
		}
	}
	if (typeof images === "string" && images.trim()) {
		try {
			const parsed = JSON.parse(images);
			if (Array.isArray(parsed) && parsed.length > 0) {
				return getThumbnail(parsed, fallbackId);
			}
		} catch {
			return images;
		}
	}
	const fallbackAssets = [
		"/assets/house1.jpeg",
		"/assets/house2.jpeg",
		"/assets/house3.jpeg",
		"/assets/house4.jpeg",
	];
	if (fallbackId) {
		const charCode = fallbackId.charCodeAt(fallbackId.length - 1) || 0;
		return fallbackAssets[charCode % fallbackAssets.length];
	}
	return "/assets/house1.jpeg";
}

export default function AgentListingsTable() {
	const [listings, setListings] = useState<PropertyRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	useEffect(() => {
		const supabase = createClient();
		let active = true;

		async function fetchListings() {
			setLoading(true);
			try {
				const { data: userData } = await supabase.auth.getUser();
				const user = userData?.user;
				if (!user) return;
				const userId = user.id;

				const { data, error } = await supabase
					.from("property_listings")
					.select("*")
					.or(`owner_id.eq.${userId},agent_id.eq.${userId}`)
					.order("created_at", { ascending: false });

				if (error) throw error;
				if (active) {
					setListings(data || []);
				}
			} catch (err) {
				console.error("Failed to load agent listings", err);
			} finally {
				if (active) setLoading(false);
			}
		}

		fetchListings();

		// Realtime subscription for agent's properties
		const channel = supabase
			.channel("agent_property_listings_realtime")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "property_listings" },
				async (payload: any) => {
					const { data: userData } = await supabase.auth.getUser();
					const userId = userData?.user?.id;
					if (!userId) return;

					const newRow = payload.new as PropertyRow | undefined;
					const oldRow = payload.old as PropertyRow | undefined;
					const event = payload.eventType;

					const belongsToAgent = (row?: PropertyRow) =>
						Boolean(row && (row.owner_id === userId || row.agent_id === userId));

					setListings((current) => {
						if (event === "INSERT") {
							if (belongsToAgent(newRow)) {
								return [newRow!, ...current.filter((item) => item.id !== newRow!.id)];
							}
							return current;
						}
						if (event === "UPDATE") {
							if (belongsToAgent(newRow)) {
								const exists = current.some((item) => item.id === newRow!.id);
								if (exists) {
									return current.map((item) => (item.id === newRow!.id ? newRow! : item));
								}
								return [newRow!, ...current];
							}
							return current.filter((item) => item.id !== oldRow?.id);
						}
						if (event === "DELETE") {
							if (oldRow?.id) {
								return current.filter((item) => item.id !== oldRow.id);
							}
						}
						return current;
					});
				},
			)
			.subscribe();

		return () => {
			active = false;
			supabase.removeChannel(channel);
		};
	}, []);

	const filteredListings = useMemo(() => {
		return listings.filter((item) => {
			const query = searchQuery.trim().toLowerCase();
			const matchesQuery =
				!query ||
				item.title.toLowerCase().includes(query) ||
				(item.formatted_address && item.formatted_address.toLowerCase().includes(query)) ||
				(item.state && item.state.toLowerCase().includes(query)) ||
				(item.listing_tag && item.listing_tag.toLowerCase().includes(query));

			const matchesStatus =
				statusFilter === "all" || item.status === statusFilter;

			return matchesQuery && matchesStatus;
		});
	}, [listings, searchQuery, statusFilter]);

	return (
		<div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
			{/* Top Bar */}
			<div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="flex items-center gap-2">
						<h2 className="text-base font-bold text-slate-900">
							Your Uploaded Listings
						</h2>
						<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
							{listings.length}
						</span>
					</div>
					<p className="mt-0.5 text-xs text-slate-500">
						Properties uploaded directly by you with real-time sync
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2.5">
					<div className="relative min-w-[200px] flex-1 sm:w-64 sm:flex-initial">
						<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search by title, location..."
							className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
						/>
					</div>

					<div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/50 p-0.5">
						{["all", "available", "rented"].map((s) => (
							<button
								key={s}
								onClick={() => setStatusFilter(s)}
								className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
									statusFilter === s
										? "bg-white text-slate-900 shadow-sm"
										: "text-slate-500 hover:text-slate-900"
								}`}
							>
								{s}
							</button>
						))}
					</div>

					<Link
						href="/agent/properties/new"
						className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
					>
						<Plus className="h-3.5 w-3.5" />
						New Listing
					</Link>
				</div>
			</div>

			{/* Table Content */}
			{loading ? (
				<div className="flex items-center justify-center py-16 text-slate-400 text-xs">
					Loading your listings...
				</div>
			) : filteredListings.length === 0 ? (
				<div className="flex flex-col items-center justify-center px-4 py-16 text-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
						<Building2 className="h-6 w-6" />
					</div>
					<h3 className="mt-3 text-sm font-bold text-slate-800">
						{listings.length === 0
							? "No listings uploaded yet"
							: "No listings match your search"}
					</h3>
					<p className="mt-1 max-w-sm text-xs text-slate-400">
						{listings.length === 0
							? "Every property listing you create will show up here immediately with live status updates."
							: "Try adjusting your search keywords or status filter."}
					</p>
					{listings.length === 0 && (
						<Link
							href="/agent/properties/new"
							className="mt-4 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
						>
							<Plus className="h-3.5 w-3.5" />
							Upload First Listing
						</Link>
					)}
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full min-w-[700px] border-collapse text-left text-xs">
						<thead>
							<tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
								<th className="px-5 py-3.5">Property</th>
								<th className="px-4 py-3.5">Type / Tag</th>
								<th className="px-4 py-3.5">Price</th>
								<th className="px-4 py-3.5">Bed / Bath</th>
								<th className="px-4 py-3.5">Status</th>
								<th className="px-4 py-3.5">Listed Date</th>
								<th className="px-4 py-3.5 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{filteredListings.map((p) => {
								const thumb = getThumbnail(p.images, p.id);
								const status = statusConfig[p.status] ?? statusConfig.inactive;
								const tag = tagConfig[p.listing_tag] ?? tagConfig.for_rent;

								return (
									<tr
										key={p.id}
										className="group transition-colors hover:bg-slate-50/70"
									>
										{/* Property Info */}
										<td className="px-5 py-3.5">
											<div className="flex items-center gap-3">
												<div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
													{/* eslint-disable-next-line @next/next/no-img-element */}
													<img
														src={thumb}
														alt={p.title}
														className="h-full w-full object-cover"
														onError={(e) => {
															(e.target as HTMLImageElement).src = "/assets/house1.jpeg";
														}}
													/>
												</div>
												<div className="min-w-0 max-w-[240px]">
													<p className="truncate font-bold text-slate-900">
														{p.title}
													</p>
													<p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-400">
														<MapPin className="h-3 w-3 flex-shrink-0" />
														<span className="truncate">
															{p.formatted_address ?? p.state ?? "No address recorded"}
														</span>
													</p>
												</div>
											</div>
										</td>

										{/* Tag */}
										<td className="px-4 py-3.5">
											<div className="flex flex-col gap-1 items-start">
												<span
													className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${tag.classes}`}
												>
													{tag.label}
												</span>
												<span className="text-[11px] capitalize text-slate-500">
													{p.type.replace(/_/g, " ")}
												</span>
											</div>
										</td>

										{/* Price */}
										<td className="px-4 py-3.5 font-bold text-slate-900">
											{formatPrice(p.price, p.price_period)}
										</td>

										{/* Bed / Bath */}
										<td className="px-4 py-3.5 text-slate-600">
											{p.bedrooms} bed · {p.bathrooms} bath
										</td>

										{/* Status */}
										<td className="px-4 py-3.5">
											<span
												className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${status.classes}`}
											>
												{status.label}
											</span>
										</td>

										{/* Listed Date */}
										<td className="px-4 py-3.5 text-slate-400">
											{new Date(p.created_at).toLocaleDateString("en-NG", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</td>

										{/* Actions */}
										<td className="px-4 py-3.5 text-right">
											<Link
												href={`/properties/${p.id}`}
												target="_blank"
												className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
											>
												View
												<ExternalLink className="h-3 w-3" />
											</Link>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
