"use client";

import { useState, useMemo, useEffect } from "react";
import {
	Search,
	SlidersHorizontal,
	X,
	ChevronDown,
	MapPin,
} from "lucide-react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { LISTING_TAGS, PROPERTY_TYPES, NIGERIAN_STATES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const PRICE_BANDS = [
	{ label: "Any price", min: 0, max: Infinity },
	{ label: "Under ₦500k", min: 0, max: 500_000 },
	{ label: "₦500k – ₦1.2M", min: 500_000, max: 1_200_000 },
	{ label: "₦1.2M – ₦3M", min: 1_200_000, max: 3_000_000 },
	{ label: "₦3M+", min: 3_000_000, max: Infinity },
];

const SORT_OPTIONS = [
	{ value: "newest", label: "Newest first" },
	{ value: "price_asc", label: "Price: Low to High" },
	{ value: "price_desc", label: "Price: High to Low" },
];

export default function ExplorePage() {
	const [query, setQuery] = useState("");
	const [activeTags, setActiveTags] = useState<string[]>([]);
	const [activeTypes, setActiveTypes] = useState<string[]>([]);
	const [selectedState, setSelectedState] = useState("");
	const [priceBandIdx, setPriceBandIdx] = useState(0);
	const [bedroomsMin, setBedroomsMin] = useState(0);
	const [sortBy, setSortBy] = useState("newest");
	const [agentSearch, setAgentSearch] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleTag = (tag: string) =>
		setActiveTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
		);

	const toggleType = (type: string) =>
		setActiveTypes((prev) =>
			prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
		);

	const clearFilters = () => {
		setActiveTags([]);
		setActiveTypes([]);
		setSelectedState("");
		setPriceBandIdx(0);
		setBedroomsMin(0);
		setAgentSearch("");
	};

	const hasActiveFilters =
		activeTags.length > 0 ||
		activeTypes.length > 0 ||
		selectedState ||
		priceBandIdx > 0 ||
		bedroomsMin > 0 ||
		agentSearch;

	// properties fetched from Supabase
	const [properties, setProperties] = useState<any[]>([]);
	useEffect(() => {
		const supabase = createClient();
		let channel: any;

		async function fetchProperties() {
			try {
				const { data, error } = await supabase
					.from("property_listings")
					.select("*")
					.eq("status", "available")
					.order("created_at", { ascending: false });
				if (error) throw error;
				setProperties(data || []);
			} catch (err) {
				console.error("Failed to fetch properties", err);
			}
		}

		fetchProperties();

		channel = supabase
			.channel("public:property_listings")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "property_listings" },
				(payload: any) => {
					const ev = payload?.eventType ?? payload?.event;
					const n = payload?.new;
					const o = payload?.old;
					setProperties((prev) => {
						if (ev === "INSERT") {
							if (n?.status === "available") return [n, ...prev];
							return prev;
						}
						if (ev === "UPDATE") {
							// replace or remove
							if (n?.status === "available")
								return [n, ...prev.filter((p) => p.id !== n.id)];
							if (o?.status === "available" && n?.status !== "available")
								return prev.filter((p) => p.id !== o.id);
						}
						if (ev === "DELETE") {
							if (o?.status === "available")
								return prev.filter((p) => p.id !== o.id);
						}
						return prev;
					});
				},
			)
			.subscribe();

		return () => {
			if (channel) channel.unsubscribe();
		};
	}, []);

	const filtered = useMemo(() => {
		const band = PRICE_BANDS[priceBandIdx];
		let list = properties.filter((p) => {
			const q = query.toLowerCase();
			const matchQuery =
				!q ||
				(p.title ?? "").toLowerCase().includes(q) ||
				((p.formatted_address ?? "") as string).toLowerCase().includes(q);
			const matchTag =
				activeTags.length === 0 || activeTags.includes(p.listing_tag);
			const matchType =
				activeTypes.length === 0 ||
				activeTypes.includes((p.type ?? "").toLowerCase());
			const matchState = !selectedState || p.state === selectedState;
			const matchPrice =
				(p.price ?? 0) >= band.min && (p.price ?? 0) <= band.max;
			const matchBeds = bedroomsMin === 0 || (p.bedrooms ?? 0) >= bedroomsMin;
			const matchAgent = !agentSearch || false; // agent search not implemented for DB rows yet
			return (
				matchQuery &&
				matchTag &&
				matchType &&
				matchState &&
				matchPrice &&
				matchBeds &&
				matchAgent
			);
		});

		if (sortBy === "price_asc")
			list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
		else if (sortBy === "price_desc")
			list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
		else
			list = [...list].sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);

		return list;
	}, [
		query,
		activeTags,
		activeTypes,
		selectedState,
		priceBandIdx,
		bedroomsMin,
		sortBy,
		agentSearch,
		properties,
	]);

	const recent = filtered.slice(0, 4);
	const rest = filtered.slice(4);

	return (
		<div className="min-h-screen bg-[#f8f5f2]">
			<div className="bg-brand-700 pt-24 pb-10">
				<div className="container-shell">
					<p className="text-xs font-bold uppercase tracking-[0.2em] text-sage-300">
						Properties
					</p>
					<h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">
						Find your next home
					</h1>
					<p className="mt-2 text-sm text-slate-300">
						Verified listings across Nigeria: rent, buy, or book a stay.
					</p>

					<div className="mt-6 flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
						<Search className="ml-4 h-5 w-5 shrink-0 text-white/60" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search by location, title, or agent…"
							className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/50 focus:outline-none"
						/>
						{query && (
							<button
								onClick={() => setQuery("")}
								className="mr-3 text-white/60 hover:text-white"
							>
								<X className="h-4 w-4" />
							</button>
						)}
					</div>
				</div>
			</div>

			<div className="container-shell py-8">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<p className="text-sm font-semibold text-slate-500">
						<span className="font-black text-slate-900">{filtered.length}</span>{" "}
						{filtered.length === 1 ? "property" : "properties"} found
					</p>
					<div className="flex items-center gap-3">
						<button
							onClick={() => setSidebarOpen((v) => !v)}
							className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 lg:hidden"
						>
							<SlidersHorizontal className="h-4 w-4" />
							Filters
							{hasActiveFilters && (
								<span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-[10px] font-black text-white">
									{
										[
											activeTags.length > 0,
											activeTypes.length > 0,
											!!selectedState,
											priceBandIdx > 0,
											bedroomsMin > 0,
											!!agentSearch,
										].filter(Boolean).length
									}
								</span>
							)}
						</button>
						<div className="relative">
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="h-9 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-sm font-semibold text-slate-700 focus:outline-none"
							>
								{SORT_OPTIONS.map((o) => (
									<option key={o.value} value={o.value}>
										{o.label}
									</option>
								))}
							</select>
							<ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
						</div>
					</div>
				</div>

				<div className="mt-6 flex gap-8">
					<aside
						className={`${sidebarOpen ? "fixed inset-0 z-50 overflow-y-auto bg-white p-6 lg:static lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0" : "hidden lg:block"} w-full shrink-0 lg:w-64 xl:w-72`}
					>
						{sidebarOpen && (
							<div
								className="fixed inset-0 bg-slate-900/40 lg:hidden"
								onClick={() => setSidebarOpen(false)}
							/>
						)}
						<div className="relative">
							<div className="rounded-2xl border border-slate-200/70 bg-white p-5">
								<div className="flex items-center justify-between">
									<p className="text-sm font-black tracking-[-0.02em] text-slate-900">
										Filters
									</p>
									{hasActiveFilters && (
										<button
											onClick={clearFilters}
											className="text-xs font-bold text-sage-500 hover:text-sage-600"
										>
											Clear all
										</button>
									)}
									<button
										onClick={() => setSidebarOpen(false)}
										className="ml-2 text-slate-400 lg:hidden"
									>
										<X className="h-4 w-4" />
									</button>
								</div>

								<div className="mt-5 space-y-5">
									<div>
										<p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
											Listing type
										</p>
										<div className="space-y-2">
											{LISTING_TAGS.map((tag) => (
												<label
													key={tag.value}
													className="flex cursor-pointer items-center gap-2.5"
												>
													<input
														type="checkbox"
														checked={activeTags.includes(tag.value)}
														onChange={() => toggleTag(tag.value)}
														className="h-4 w-4 rounded border-slate-300 accent-brand-700"
													/>
													<div className="flex items-center gap-2">
														<span
															className={`h-2 w-2 rounded-full ${tag.color}`}
														/>
														<span className="text-sm font-medium text-slate-700">
															{tag.label}
														</span>
													</div>
												</label>
											))}
										</div>
									</div>

									<div className="border-t border-slate-100 pt-4">
										<p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
											Property type
										</p>
										<div className="space-y-2">
											{PROPERTY_TYPES.map((pt) => (
												<label
													key={pt.value}
													className="flex cursor-pointer items-center gap-2.5"
												>
													<input
														type="checkbox"
														checked={activeTypes.includes(pt.value)}
														onChange={() => toggleType(pt.value)}
														className="h-4 w-4 rounded border-slate-300 accent-brand-700"
													/>
													<span className="text-sm font-medium text-slate-700">
														{pt.label}
													</span>
												</label>
											))}
										</div>
									</div>

									<div className="border-t border-slate-100 pt-4">
										<p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
											State
										</p>
										<div className="relative">
											{/* <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /> */}
											<select
												value={selectedState}
												onChange={(e) => setSelectedState(e.target.value)}
												className="h-9 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm text-slate-700 focus:border-brand-400 focus:outline-none"
											>
												<option value="">All states</option>
												{NIGERIAN_STATES.map((s) => (
													<option key={s} value={s}>
														{s}
													</option>
												))}
											</select>
										</div>
									</div>

									<div className="border-t border-slate-100 pt-4">
										<p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
											Price range
										</p>
										<div className="space-y-1.5">
											{PRICE_BANDS.map((band, idx) => (
												<button
													key={band.label}
													onClick={() => setPriceBandIdx(idx)}
													className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
														priceBandIdx === idx
															? "bg-brand-700 text-white"
															: "text-slate-600 hover:bg-slate-100"
													}`}
												>
													{band.label}
												</button>
											))}
										</div>
									</div>

									<div className="border-t border-slate-100 pt-4">
										<p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
											Min. bedrooms
										</p>
										<div className="flex flex-wrap gap-2">
											{[0, 1, 2, 3, 4, 5].map((n) => (
												<button
													key={n}
													onClick={() => setBedroomsMin(n)}
													className={`h-9 w-9 rounded-xl text-sm font-bold transition ${
														bedroomsMin === n
															? "bg-brand-700 text-white"
															: "border border-slate-200 text-slate-600 hover:border-brand-300"
													}`}
												>
													{n === 0 ? "Any" : n === 5 ? "5+" : n}
												</button>
											))}
										</div>
									</div>

									<div className="border-t border-slate-100 pt-4">
										<p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
											Agent / Agency
										</p>
										<div className="relative">
											<Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
											<input
												type="text"
												value={agentSearch}
												onChange={(e) => setAgentSearch(e.target.value)}
												placeholder="e.g. PrimeProp"
												className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</aside>

					<div className="min-w-0 flex-1">
						{filtered.length === 0 ? (
							<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
								<Search className="mb-3 h-10 w-10 text-slate-300" />
								<p className="text-base font-bold text-slate-500">
									No properties match your filters
								</p>
								<p className="mt-1 text-sm text-slate-400">
									Try adjusting your search or clearing some filters
								</p>
								<button
									onClick={clearFilters}
									className="mt-4 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
								>
									Clear filters
								</button>
							</div>
						) : (
							<>
								{recent.length > 0 && (
									<section>
										<div className="mb-4 flex items-center justify-between">
											<div>
												<p className="text-[10px] font-black uppercase tracking-[0.15em] text-sage-500">
													Just in
												</p>
												<h2 className="text-xl font-black tracking-[-0.03em] text-slate-900">
													Recent listings
												</h2>
											</div>
										</div>
										<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2">
											{recent.map((p) => (
												<PropertyCard key={p.id} {...p} />
											))}
										</div>
									</section>
								)}

								{rest.length > 0 && (
									<section className="mt-10">
										<div className="mb-4">
											<p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
												More properties
											</p>
											<h2 className="text-xl font-black tracking-[-0.03em] text-slate-900">
												All results
											</h2>
										</div>
										<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2">
											{rest.map((p) => (
												<PropertyCard key={p.id} {...p} />
											))}
										</div>
									</section>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
