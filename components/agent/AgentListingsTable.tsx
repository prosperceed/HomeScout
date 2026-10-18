"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database.types";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

type PropertyRow = Tables<"property_listings">;

export default function AgentListingsTable() {
	const [listings, setListings] = useState<PropertyRow[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let channel: any;
		const supabase = createClient();

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
				setListings(data || []);
			} catch (err) {
				console.error("Failed to load agent listings", err);
			} finally {
				setLoading(false);
			}
		}

		fetchListings();

		// subscribe to realtime changes and update list
		channel = supabase
			.channel("public:property_listings")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "property_listings" },
				(payload: any) => {
					const newRow = payload?.new;
					const oldRow = payload?.old;
					const event = payload?.eventType ?? payload?.event;
					// update only if change affects this user
					supabase.auth.getUser().then(({ data }) => {
						const userId = data?.user?.id;
						if (!userId) return;
						const affectsUser = (r: any) =>
							r && (r.owner_id === userId || r.agent_id === userId);
						setListings((prev) => {
							if (event === "INSERT") {
								if (affectsUser(newRow)) return [newRow, ...prev];
								return prev;
							}
							if (event === "UPDATE") {
								if (affectsUser(newRow))
									return [newRow, ...prev.filter((p) => p.id !== newRow.id)];
								if (affectsUser(oldRow) && !affectsUser(newRow))
									return prev.filter((p) => p.id !== oldRow.id);
							}
							if (event === "DELETE") {
								if (affectsUser(oldRow))
									return prev.filter((p) => p.id !== oldRow.id);
							}
							return prev;
						});
					});
				},
			)
			.subscribe();

		return () => {
			if (channel) channel.unsubscribe();
		};
	}, []);

	if (loading) return <div className="p-6">Loading listings…</div>;

	return (
		<div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
			<div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
				<div>
					<h2 className="text-base font-black tracking-[-0.03em] text-slate-900">
						Your Listings
					</h2>
					<p className="mt-0.5 text-sm text-slate-400">
						{listings.length} listings
					</p>
				</div>
				<Link
					href="/agent/properties/new"
					className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
				>
					Add listing
				</Link>
			</div>

			{listings.length === 0 ? (
				<div className="p-6 text-center text-sm text-slate-500">
					No listings yet
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full min-w-[700px]">
						<thead>
							<tr className="border-b border-slate-100">
								<th className="w-10 px-4 py-3.5" />
								<th className="px-4 py-3.5 text-left">Property</th>
								<th className="px-4 py-3.5">Tag</th>
								<th className="px-4 py-3.5">Status</th>
								<th className="px-4 py-3.5">Items</th>
								<th className="px-4 py-3.5">Total</th>
								<th className="px-4 py-3.5" />
							</tr>
						</thead>
						<tbody>
							{listings.map((l) => (
								<tr key={l.id} className="group border-b">
									<td className="px-4 py-3.5" />
									<td className="px-4 py-3.5">
										<p className="max-w-[240px] truncate text-sm font-semibold text-slate-800">
											{l.title}
										</p>
										<p className="mt-0.5 text-xs text-slate-400">
											{l.formatted_address ?? "—"}
										</p>
									</td>
									<td className="px-4 py-3.5 text-sm text-slate-600">
										{l.listing_tag}
									</td>
									<td className="px-4 py-3.5 text-sm text-slate-600">
										{l.status}
									</td>
									<td className="px-4 py-3.5 text-sm font-semibold text-slate-700">
										{(l.images as any)?.length ?? 0}
									</td>
									<td className="px-4 py-3.5 text-sm font-black text-slate-900">
										{l.price ? `₦${l.price.toLocaleString()}` : "-"}
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
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
