"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Bed, Bath, ArrowUpRight, ShieldCheck, Bookmark } from "lucide-react";
import { LISTING_TAGS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/toast";

interface PropertyCardProps {
	id?: string;
	title?: string | null;
	location?: string | null;
	formatted_address?: string | null;
	price?: number | null;
	price_period?: "per_month" | "per_year" | "per_night" | string | null;
	bedrooms?: number | null;
	bathrooms?: number | null;
	listing_tag?: string | null;
	property_type?: string | null;
	type?: string | null;
	image?: string | string[] | null;
	images?: string[] | Array<{ url?: string } | string> | unknown;
	is_verified?: boolean | null;
	agent_name?: string | null;
	agency_name?: string | null;
	owner_type?: "agent" | "landlord" | string | null;
	isBookmarked?: boolean;
	onBookmarkToggle?: (propertyId: string, isBookmarked: boolean) => void;
	[key: string]: unknown;
}

const periodLabel: Record<string, string> = {
	per_year: "/ yr",
	per_month: "/ mo",
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

function toImageArray(value: unknown): string[] {
	if (!value) return [];
	if (Array.isArray(value)) {
		return value
			.map((item) => {
				if (typeof item === "string") return item;
				if (item && typeof item === "object" && "url" in item) {
					return (item as { url?: string }).url ?? "";
				}
				return "";
			})
			.filter(Boolean) as string[];
	}
	return typeof value === "string" ? [value] : [];
}

export function PropertyCard({
	id = "",
	title = "Property listing",
	location,
	formatted_address,
	price = 0,
	price_period = "per_year",
	bedrooms = 0,
	bathrooms = 0,
	listing_tag = "for_rent",
	property_type,
	type,
	image,
	images,
	is_verified,
	agent_name,
	agency_name,
	owner_type = "agent",
	isBookmarked,
	onBookmarkToggle,
}: PropertyCardProps) {
	const router = useRouter();
	const [bookmarked, setBookmarked] = useState(isBookmarked ?? false);

	useEffect(() => {
		if (isBookmarked !== undefined) {
			setBookmarked(isBookmarked);
		}
	}, [isBookmarked]);

	const handleBookmark = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!id) return;

		const supabase = createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			toast.error("Please sign in to bookmark properties", {
				description: "Sign in to save and manage your favourite homes.",
				action: {
					label: "Sign in",
					onClick: () => router.push(`/login?next=/explore`),
				},
			});
			return;
		}

		const nextState = !bookmarked;
		setBookmarked(nextState);
		onBookmarkToggle?.(id, nextState);

		try {
			if (nextState) {
				const { error } = await supabase.from("saved_properties").insert({
					client_id: user.id,
					property_id: id,
				});
				if (error && error.code !== "23505") {
					throw error;
				}
				toast.success("Property bookmarked", {
					description: "Saved to your shortlisted homes.",
				});
			} else {
				const { error } = await supabase
					.from("saved_properties")
					.delete()
					.eq("client_id", user.id)
					.eq("property_id", id);
				if (error) throw error;
				toast.info("Bookmark removed", {
					description: "Removed from your saved homes.",
				});
			}
		} catch (err) {
			setBookmarked(!nextState);
			onBookmarkToggle?.(id, !nextState);
			toast.error("Failed to update bookmark", {
				description:
					err instanceof Error ? err.message : "Please try again later.",
			});
		}
	};

	const tag = LISTING_TAGS.find((t) => t.value === listing_tag);
	const resolvedLocation = location ?? formatted_address ?? "Nigeria";
	const resolvedType = property_type ?? type ?? "Property";
	const primaryImage =
		toImageArray(images).find(Boolean) ??
		toImageArray(image).find(Boolean) ??
		"/assets/house1.jpeg";

	const tagStyle: Record<string, string> = {
		for_sale: "bg-sage-500 text-white",
		for_rent: "bg-brand-500 text-white",
		shortlet: "bg-coral-500 text-white",
	};

	return (
		<Link
			href={`/property/${id}`}
			className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white transition-all duration-200 hover:-translate-y-0.5"
		>
			<div className="relative h-56 overflow-hidden bg-slate-100">
				<Image
					src={primaryImage}
					alt={title ?? "Property"}
					fill
					className="object-cover transition duration-500 group-hover:scale-[1.04]"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					unoptimized={
						primaryImage.startsWith("http") || primaryImage.startsWith("https")
					}
				/>

				<div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />

				{tag && (
					<span
						className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9.2px] font-black uppercase tracking-wider ${tagStyle[tag.value] ?? "bg-slate-800 text-white"}`}
					>
						<span className="h-1.5 w-1.5 rounded-full bg-white/70" />
						{tag.label}
					</span>
				)}

				{is_verified && (
					<span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-sage-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
						<ShieldCheck className="h-3 w-3" />
						Verified
					</span>
				)}
			</div>

			<div className="flex flex-1 flex-col p-4">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<h3 className="truncate text-[15px] font-bold leading-tight tracking-[-0.02em] text-slate-900">
							{title ?? "Property listing"}
						</h3>
						<div className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
							<MapPin className="h-3 w-3 shrink-0" />
							<span className="truncate">{resolvedLocation}</span>
						</div>
					</div>
				</div>

				<div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
					<div className="flex items-center gap-4">
						<span className="flex items-center gap-1.5">
							<Bed className="h-3.5 w-3.5 text-slate-400" />
							<span className="font-semibold text-slate-700">
								{bedrooms ?? 0}
							</span>{" "}
							bed
							{(bedrooms ?? 0) !== 1 ? "s" : ""}
						</span>
						<span className="flex items-center gap-1.5">
							<Bath className="h-3.5 w-3.5 text-slate-400" />
							<span className="font-semibold text-slate-700">
								{bathrooms ?? 0}
							</span>{" "}
							bath{(bathrooms ?? 0) !== 1 ? "s" : ""}
						</span>
					</div>

					<button
						type="button"
						onClick={handleBookmark}
						aria-label={bookmarked ? "Remove bookmark" : "Bookmark property"}
						title={bookmarked ? "Remove bookmark" : "Bookmark property"}
						className={`group/btn flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200 ${
							bookmarked
								? "border-coral-300 bg-coral-50 text-coral-500 hover:bg-coral-100"
								: "border-slate-200/80 bg-slate-50/80 text-slate-400 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-600"
						}`}
					>
						<Bookmark
							className={`h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:scale-110 ${
								bookmarked ? "fill-coral-500 text-coral-500" : ""
							}`}
						/>
					</button>
				</div>

				<div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
					<div>
						<p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
							Price
						</p>
						<p className="mt-0.5 text-xl font-black tracking-tight text-slate-900">
							{formatNaira(price ?? 0)}
							<span className="ml-1 text-xs font-semibold text-slate-400">
								{periodLabel[price_period ?? "per_year"] ?? "/ yr"}
							</span>
						</p>
					</div>

					<div className="flex flex-col items-end gap-1.5">
						{(agent_name || agency_name) && (
							<span className="rounded-lg bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-500 ring-1 ring-brand-100">
								{agency_name ?? agent_name}
							</span>
						)}
						<span className="flex items-center gap-1 rounded-xl bg-brand-700 px-3.5 py-2 text-[11px] font-bold text-white transition group-hover:bg-sage-500">
							View <ArrowUpRight className="h-3 w-3" />
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
