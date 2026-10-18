"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
	ArrowLeft,
	MapPin,
	Bed,
	Bath,
	ShieldCheck,
	Phone,
	MessageCircle,
	Heart,
	Share2,
	CheckCircle2,
	Calendar,
	Building2,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { LISTING_TAGS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const periodLabel: Record<string, string> = {
	per_year: "/ year",
	per_month: "/ month",
	per_night: "/ night",
};

function formatNaira(amount: number): string {
	if (amount >= 1_000_000) {
		const val = amount / 1_000_000;
		return `₦${val % 1 === 0 ? val : val.toFixed(1)}M`;
	}
	if (amount >= 1_000) {
		const val = amount / 1_000;
		return `₦${val % 1 === 0 ? val : val.toFixed(0)}k`;
	}
	return `₦${amount.toLocaleString()}`;
}

function normalizeImages(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value
			.map((item) => {
				if (typeof item === "string") return item;
				if (
					item &&
					typeof item === "object" &&
					"url" in item &&
					typeof item.url === "string"
				)
					return item.url;
				return "";
			})
			.filter(Boolean) as string[];
	}
	if (typeof value === "string") return [value];
	return [];
}

export default function PropertyDetailPage() {
	const params = useParams<{ id: string }>();
	const propertyId = params?.id ?? "";
	const [property, setProperty] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);
	const [imgIdx, setImgIdx] = useState(0);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		let isActive = true;
		const supabase = createClient();

		async function loadProperty() {
			if (!propertyId) {
				if (isActive) {
					setProperty(null);
					setLoading(false);
				}
				return;
			}

			try {
				const { data, error } = await supabase
					.from("property_listings")
					.select("*")
					.eq("id", propertyId)
					.single();

				if (!isActive) return;
				if (error) throw error;
				setProperty(data);
			} catch (err) {
				console.error("Failed to load property details", err);
				if (isActive) setProperty(null);
			} finally {
				if (isActive) setLoading(false);
			}
		}

		loadProperty();
		return () => {
			isActive = false;
		};
	}, [propertyId]);

	const images = useMemo(() => {
		if (!property) return [];
		const src = normalizeImages(property.images);
		return src.length > 0 ? src : ["/assets/house1.jpeg"];
	}, [property]);

	const tag = property
		? LISTING_TAGS.find((t) => t.value === property.listing_tag)
		: null;
	const tagStyle: Record<string, string> = {
		for_sale: "bg-sage-500 text-white",
		for_rent: "bg-brand-500 text-white",
		shortlet: "bg-coral-500 text-white",
	};

	const mapSrc = property
		? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${property.lat},${property.lng}&zoom=16`
		: "";

	if (loading) {
		return (
			<div className="min-h-screen bg-[#f8f5f2] px-4 pt-28">
				<div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
					Loading property details…
				</div>
			</div>
		);
	}

	if (!property) {
		return (
			<div className="min-h-screen bg-[#f8f5f2] px-4 pt-28">
				<div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
					Property not found.
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f8f5f2] pb-16">
			<div className="bg-brand-700 pb-10 pt-23">
				<div className="container-shell">
					<div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
						<Link href="/" className="hover:text-white">
							Home
						</Link>
						<span>/</span>
						<Link href="/explore" className="hover:text-white">
							Properties
						</Link>
						<span>/</span>
						<span className="text-white">{property.title}</span>
					</div>

					<div className="mt-4 flex flex-wrap items-start justify-between gap-4">
						<div>
							{tag && (
								<span
									className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${tagStyle[tag.value] ?? "bg-slate-600 text-white"}`}
								>
									<span className="h-1.5 w-1.5 rounded-full bg-white/70" />
									{tag.label}
								</span>
							)}
							<h1 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white md:text-3xl">
								{property.title}
							</h1>
							<div className="mt-2 flex items-center gap-1.5 text-sm text-slate-300">
								<MapPin className="h-4 w-4 shrink-0 text-sage-400" />
								{property.formatted_address ??
									property.state ??
									"Location not provided"}
							</div>
						</div>

						<div className="flex items-center gap-2">
							<button
								onClick={() => setSaved((v) => !v)}
								className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${saved ? "border-coral-400 bg-coral-50 text-coral-500" : "border-white/20 bg-white/10 text-white hover:bg-white/20"}`}
								aria-label="Save property"
							>
								<Heart className={`h-4 w-4 ${saved ? "fill-coral-500" : ""}`} />
							</button>
							<button
								className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
								aria-label="Share property"
							>
								<Share2 className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container-shell -mt-6">
				<div className="grid gap-8 lg:grid-cols-[1fr_340px]">
					<div className="space-y-6">
						<div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 shadow-sm">
							<div className="relative h-90 md:h-130">
								<Image
									src={images[imgIdx] ?? "/assets/house1.jpeg"}
									alt={property.title}
									fill
									className="object-contain object-center bg-white"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 60vw"
									priority
								/>

								{images.length > 1 && (
									<>
										<button
											onClick={() => setImgIdx((i) => Math.max(0, i - 1))}
											disabled={imgIdx === 0}
											className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-slate-700 transition hover:bg-white disabled:opacity-30"
										>
											<ChevronLeft className="h-5 w-5" />
										</button>
										<button
											onClick={() =>
												setImgIdx((i) => Math.min(images.length - 1, i + 1))
											}
											disabled={imgIdx === images.length - 1}
											className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-slate-700 transition hover:bg-white disabled:opacity-30"
										>
											<ChevronRight className="h-5 w-5" />
										</button>
									</>
								)}

								<div className="absolute bottom-3 right-3 rounded-lg bg-slate-950/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
									{imgIdx + 1} / {images.length}
								</div>

								{property.is_verified && (
									<span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-xl bg-sage-500/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
										<ShieldCheck className="h-3.5 w-3.5" />
										Verified listing
									</span>
								)}
							</div>

							{images.length > 1 && (
								<div className="flex gap-2 overflow-x-auto p-3">
									{images.map((img, i) => (
										<button
											key={`${img}-${i}`}
											onClick={() => setImgIdx(i)}
											className={`relative h-16 min-w-24 overflow-hidden rounded-xl transition ${i === imgIdx ? "ring-2 ring-brand-700 ring-offset-1" : "opacity-60 hover:opacity-90"}`}
										>
											<Image
												src={img}
												alt=""
												fill
												className="object-cover"
												sizes="96px"
											/>
										</button>
									))}
								</div>
							)}
						</div>

						<div className="rounded-2xl border border-slate-200/70 bg-white p-6">
							<div className="flex flex-wrap items-center gap-6">
								<div className="flex items-center gap-2.5 text-slate-600">
									<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
										<Bed className="h-4 w-4 text-brand-600" />
									</div>
									<div>
										<p className="text-xs font-bold text-slate-400">Bedrooms</p>
										<p className="text-lg font-black text-slate-900">
											{property.bedrooms ?? 0}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2.5 text-slate-600">
									<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-50">
										<Bath className="h-4 w-4 text-sage-600" />
									</div>
									<div>
										<p className="text-xs font-bold text-slate-400">
											Bathrooms
										</p>
										<p className="text-lg font-black text-slate-900">
											{property.bathrooms ?? 0}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2.5">
									<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100">
										<Building2 className="h-4 w-4 text-stone-500" />
									</div>
									<div>
										<p className="text-xs font-bold text-slate-400">Type</p>
										<p className="text-sm font-bold text-slate-900">
											{property.type ?? property.property_type ?? "Property"}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2.5">
									<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100">
										<Calendar className="h-4 w-4 text-stone-500" />
									</div>
									<div>
										<p className="text-xs font-bold text-slate-400">Listed</p>
										<p className="text-sm font-bold text-slate-900">
											{new Date(property.created_at).toLocaleDateString(
												"en-NG",
												{ day: "numeric", month: "short", year: "numeric" },
											)}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-slate-200/70 bg-white p-6">
							<h2 className="text-base font-black tracking-[-0.02em] text-slate-900">
								About this property
							</h2>
							<p className="mt-3 text-sm leading-7 text-slate-500">
								{property.description}
							</p>
						</div>

						{(property.amenities ?? []).length > 0 && (
							<div className="rounded-2xl border border-slate-200/70 bg-white p-6">
								<h2 className="text-base font-black tracking-[-0.02em] text-slate-900">
									Amenities
								</h2>
								<div className="mt-4 flex flex-wrap gap-2">
									{(property.amenities ?? []).map((a: string) => (
										<span
											key={a}
											className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
										>
											<CheckCircle2 className="h-3 w-3 text-sage-500" />
											{a}
										</span>
									))}
								</div>
							</div>
						)}

						<div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
							<div className="border-b border-slate-100 px-6 py-4">
								<h2 className="text-base font-black tracking-[-0.02em] text-slate-900">
									Location
								</h2>
								<p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
									<MapPin className="h-3.5 w-3.5 text-sage-500" />
									{property.formatted_address ??
										property.state ??
										"Location not provided"}
								</p>
							</div>
							<div className="relative h-80 w-full bg-slate-100">
								{process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY &&
								property.lat &&
								property.lng ? (
									<iframe
										src={mapSrc}
										className="h-full w-full border-0"
										allowFullScreen
										loading="lazy"
										referrerPolicy="no-referrer-when-downgrade"
										title="Property location map"
									/>
								) : (
									<div className="flex h-full items-center justify-center">
										<div className="text-center">
											<MapPin className="mx-auto mb-2 h-8 w-8 text-slate-300" />
											<p className="text-sm font-semibold text-slate-400">
												Map unavailable
											</p>
											<p className="mt-1 text-xs text-slate-300">
												{property.lat ?? ""}, {property.lng ?? ""}
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="space-y-5">
						<div className="rounded-2xl border border-slate-200/70 bg-white p-6">
							<p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
								Asking price
							</p>
							<p className="mt-1 text-3xl font-black tracking-tight text-slate-900">
								{formatNaira(Number(property.price ?? 0))}
							</p>
							<p className="text-sm font-semibold text-slate-400">
								{periodLabel[property.price_period] ?? "/ year"}
							</p>

							<div className="mt-5 space-y-3">
								<button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-700 py-3.5 text-sm font-bold text-white transition hover:bg-brand-600">
									<Phone className="h-4 w-4" />
									Call agent
								</button>
								<button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-sage-500 py-3.5 text-sm font-bold text-sage-600 transition hover:bg-sage-50">
									<MessageCircle className="h-4 w-4" />
									Send message
								</button>
							</div>
						</div>

						<div className="rounded-2xl border border-slate-200/70 bg-white p-5">
							<p className="mb-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
								Listed by
							</p>
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-black text-brand-700">
									{(property.owner_id ?? "A").slice(0, 2).toUpperCase()}
								</div>
								<div>
									<p className="text-sm font-bold text-slate-900">
										HomeScout Agent
									</p>
									<p className="text-xs text-slate-400">
										Verified property partner
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
