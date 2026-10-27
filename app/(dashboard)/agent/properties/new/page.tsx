"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Building2,
	CheckCircle2,
	ChevronDown,
	MapPin,
	Upload,
} from "lucide-react";
import Link from "next/link";
import {
	PropertyMapPicker,
	type PickedLocation,
} from "@/components/maps/PropertyMapPicker";
import { PROPERTY_TYPES, AMENITIES, LISTING_TAGS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const PRICE_PERIODS = [
	{ value: "per_year", label: "Per Year" },
	{ value: "per_month", label: "Per Month" },
	{ value: "per_night", label: "Per Night" },
];

export default function NewListingPage() {
	const router = useRouter();
	const [mapOpen, setMapOpen] = useState(false);
	const [location, setLocation] = useState<PickedLocation | null>(null);
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imageFiles, setImageFiles] = useState<File[]>([]);
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFiles = (files: FileList | null) => {
		if (!files || files.length === 0) return;
		const picked: File[] = [];
		const urls: string[] = [];
		for (let i = 0; i < files.length; i++) {
			const f = files[i];
			if (!f.type.startsWith("image/")) continue;
			picked.push(f);
			urls.push(URL.createObjectURL(f));
		}
		setImageFiles((prev) => [...prev, ...picked].slice(-6));
		setPreviewUrls((prev) => [...prev, ...urls].slice(-6)); // keep last 6 previews
	};
	useEffect(() => {
		return () => {
			previewUrls.forEach((u) => URL.revokeObjectURL(u));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const [form, setForm] = useState({
		title: "",
		description: "",
		type: "",
		listing_tag: "",
		price: "",
		price_period: "per_year",
		bedrooms: "",
		bathrooms: "",
		area_sqft: "",
	});

	const handleField =
		(key: keyof typeof form) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
			>,
		) =>
			setForm((prev) => ({ ...prev, [key]: e.target.value }));

	const toggleAmenity = (a: string) =>
		setSelectedAmenities((prev) =>
			prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
		);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!location) {
			alert("Please pick a location on the map.");
			return;
		}
		if (!form.listing_tag) {
			alert("Please select a listing tag (For Sale, For Rent, or Shortlet).");
			return;
		}
		setIsSubmitting(true);
		// Persist to Supabase: upload images to storage, insert property row
		const supabase = createClient();
		try {
			const { data: userData } = await supabase.auth.getUser();
			const user = userData?.user;
			if (!user) throw new Error("You must be signed in to publish a listing.");

			// upload images sequentially and collect public URLs
			const uploadedUrls: string[] = [];
			for (let i = 0; i < imageFiles.length; i++) {
				const file = imageFiles[i];
				const path = `properties/${user.id}/${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
				const { error: upErr } = await supabase.storage
					.from("property-images")
					.upload(path, file, { upsert: false });
				if (upErr) {
					console.warn("Upload error", upErr.message);
					continue;
				}
				const { data: urlData } = supabase.storage
					.from("property-images")
					.getPublicUrl(path);
				if (urlData?.publicUrl) uploadedUrls.push(urlData.publicUrl);
			}

			const insertPayload = {
				title: form.title || "Untitled property",
				description: form.description || null,
				type: (form.type || null) as any,
				status: "available",
				listing_tag: (form.listing_tag || null) as any,
				price: form.price ? Number(form.price) : 0,
				price_period: form.price_period as any,
				bedrooms: form.bedrooms ? Number(form.bedrooms) : 0,
				bathrooms: form.bathrooms ? Number(form.bathrooms) : 0,
				images: uploadedUrls.length > 0 ? uploadedUrls : ["/assets/house1.jpeg"],
				amenities: selectedAmenities,
				lat: location?.lat ?? null,
				lng: location?.lng ?? null,
				formatted_address: location?.formatted_address ?? null,
				state: location?.state ?? null,
				city: location?.city ?? null,
				is_verified: false,
				is_featured: false,
				views_count: 0,
				owner_id: user.id,
				owner_type: "agent",
				agent_id: user.id,
			};

			const { data: inserted, error: insertErr } = await supabase
				.from("property_listings")
				.insert(insertPayload)
				.select()
				.single();

			if (insertErr) throw insertErr;

			setIsSubmitting(false);
			toast.success("Property added", {
				description: "Your listing was added to the marketplace.",
			});
			router.push("/agent/properties");
		} catch (err: any) {
			console.error(err);
			setIsSubmitting(false);
			toast.error("Failed to add property", {
				description: err?.message ?? "Please try again.",
			});
		}
	};

	return (
		<>
			<div className="mx-auto max-w-3xl space-y-6">
				{/* ── Page header ── */}
				<div className="flex items-center gap-4">
					<Link
						href="/agent/properties"
						className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
					>
						<ArrowLeft className="h-4 w-4" />
					</Link>
					<div>
						<p className="text-xs font-bold uppercase tracking-widest text-slate-400">
							Properties
						</p>
						<h1 className="mt-0.5 text-2xl font-black tracking-[-0.04em] text-slate-900">
							New Property Listing
						</h1>
					</div>
				</div>

				{/* ── Card ── */}
				<div
					className="overflow-hidden rounded-3xl border border-slate-200/70 shadow-[0_8px_40px_rgba(15,23,42,0.08)]"
					style={{
						background:
							"linear-gradient(145deg, #ffffff 0%, #f8faff 50%, #f0f4ff 100%)",
					}}
				>
					{/* Card header strip */}
					<div className="flex items-center gap-3 border-b border-slate-100 bg-white/60 px-8 py-5 backdrop-blur-sm">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 shadow-[rgba(59,130,246,0.35)]">
							<Building2 className="h-4.5 w-4.5 h-[18px] w-[18px] text-white" />
						</div>
						<div>
							<p className="text-sm font-bold text-slate-900">
								Property Details
							</p>
							<p className="text-xs text-slate-400">
								Fill in all details and pin the location on the map
							</p>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-7 px-8 py-8">
						{/* ── Listing tag ── */}
						<div className="space-y-2">
							<label className="text-xs font-bold text-slate-700">
								Listing Tag <span className="text-red-400">*</span>
							</label>
							<p className="text-xs text-slate-400">
								How should this property be listed to users?
							</p>
							<div className="flex flex-wrap gap-3">
								{LISTING_TAGS.map((tag) => {
									const active = form.listing_tag === tag.value;
									return (
										<button
											key={tag.value}
											type="button"
											onClick={() =>
												setForm((p) => ({ ...p, listing_tag: tag.value }))
											}
											className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
												active
													? "border-transparent bg-slate-900 text-white shadow-md"
													: "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
											}`}
										>
											<span
												className={`h-2.5 w-2.5 rounded-full ${tag.color}`}
											/>
											{tag.label}
										</button>
									);
								})}
							</div>
						</div>

						<div className="h-px bg-slate-100" />

						{/* ── Title ── */}
						<div className="space-y-1.5">
							<label className="text-xs font-bold text-slate-700">
								Listing Title <span className="text-red-400">*</span>
							</label>
							<input
								required
								value={form.title}
								onChange={handleField("title")}
								placeholder="e.g. 3-Bed Apartment, Lekki Phase 1"
								className="h-11 w-full rounded-xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
							/>
						</div>

						{/* ── Type & Period ── */}
						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
							<div className="space-y-1.5">
								<label className="text-xs font-bold text-slate-700">
									Property Type <span className="text-red-400">*</span>
								</label>
								<div className="relative">
									<select
										required
										value={form.type}
										onChange={handleField("type")}
										className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
									>
										<option value="">Select type</option>
										{PROPERTY_TYPES.map((pt) => (
											<option key={pt.value} value={pt.value}>
												{pt.label}
											</option>
										))}
									</select>
									<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								</div>
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-bold text-slate-700">
									Price Period
								</label>
								<div className="relative">
									<select
										value={form.price_period}
										onChange={handleField("price_period")}
										className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
									>
										{PRICE_PERIODS.map((p) => (
											<option key={p.value} value={p.value}>
												{p.label}
											</option>
										))}
									</select>
									<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								</div>
							</div>
						</div>

						{/* ── Price / Beds / Baths ── */}
						<div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
							<div className="space-y-1.5">
								<label className="text-xs font-bold text-slate-700">
									Price (₦) <span className="text-red-400">*</span>
								</label>
								<input
									required
									type="number"
									min="0"
									value={form.price}
									onChange={handleField("price")}
									placeholder="1,200,000"
									className="h-11 w-full rounded-xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
								/>
							</div>
							<div className="space-y-1.5">
								<label className="text-xs font-bold text-slate-700">
									Bedrooms
								</label>
								<input
									type="number"
									min="0"
									value={form.bedrooms}
									onChange={handleField("bedrooms")}
									placeholder="3"
									className="h-11 w-full rounded-xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
								/>
							</div>
							<div className="space-y-1.5">
								<label className="text-xs font-bold text-slate-700">
									Bathrooms
								</label>
								<input
									type="number"
									min="0"
									value={form.bathrooms}
									onChange={handleField("bathrooms")}
									placeholder="2"
									className="h-11 w-full rounded-xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
								/>
							</div>
						</div>

						{/* ── Description ── */}
						<div className="space-y-1.5">
							<label className="text-xs font-bold text-slate-700">
								Description
							</label>
							<textarea
								rows={4}
								value={form.description}
								onChange={handleField("description")}
								placeholder="Describe the property features, condition, and key selling points…"
								className="w-full resize-none rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
							/>
						</div>

						{/* ── Amenities ── */}
						<div className="space-y-2">
							<label className="text-xs font-bold text-slate-700">
								Amenities
							</label>
							<div className="flex flex-wrap gap-2">
								{AMENITIES.map((a) => {
									const on = selectedAmenities.includes(a);
									return (
										<button
											type="button"
											key={a}
											onClick={() => toggleAmenity(a)}
											className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition ${
												on
													? "bg-blue-600 text-white shadow-sm"
													: "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
											}`}
										>
											{a}
										</button>
									);
								})}
							</div>
						</div>

						{/* ── Location ── */}
						<div className="space-y-1.5">
							<label className="text-xs font-bold text-slate-700">
								Property Location <span className="text-red-400">*</span>
							</label>
							<button
								type="button"
								onClick={() => setMapOpen(true)}
								className={`flex h-12 w-full cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm font-semibold transition ${
									location
										? "border-blue-400 bg-blue-50 text-blue-700"
										: "border-dashed border-slate-300 bg-white/60 text-slate-500 hover:border-blue-300 hover:bg-blue-50/50"
								}`}
							>
								{location ? (
									<>
										<CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
										<span className="flex-1 truncate text-left">
											{location.formatted_address}
										</span>
									</>
								) : (
									<>
										<MapPin className="h-4 w-4 shrink-0 text-slate-400" />
										<span>Click to pick location on the map</span>
									</>
								)}
							</button>
							{location && (
								<p className="text-xs text-slate-400">
									{location.lat.toFixed(5)}, {location.lng.toFixed(5)} ·{" "}
									{location.state}
								</p>
							)}
						</div>

						{/* ── Photos ── */}
						<div className="space-y-1.5">
							<label className="text-xs font-bold text-slate-700">Photos</label>

							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								multiple
								onChange={(e) => handleFiles(e.target.files)}
								className="hidden"
								aria-hidden="true"
							/>

							<div
								role="button"
								tabIndex={0}
								onClick={() => fileInputRef.current?.click()}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ")
										fileInputRef.current?.click();
								}}
								className="relative flex h-28 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-white/60 text-slate-400 transition hover:border-blue-300 hover:bg-blue-50/40"
								aria-label="Upload property images"
							>
								<Upload className="h-5 w-5" />
								<span className="text-sm font-medium">
									Upload property images
								</span>

								{previewUrls.length > 0 && (
									<div className="absolute left-3 top-3 flex items-center gap-2">
										{previewUrls.slice(0, 3).map((src, i) => (
											<div
												key={i}
												className="h-12 w-12 overflow-hidden rounded-lg border bg-slate-50"
											>
												<img
													src={src}
													alt={`preview-${i}`}
													className="h-full w-full object-cover"
												/>
											</div>
										))}
										{previewUrls.length > 3 && (
											<div className="ml-2 rounded-md bg-slate-900/80 px-2 py-0.5 text-xs font-semibold text-white">
												+{previewUrls.length - 3}
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* ── Actions ── */}
						<div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
							<Link
								href="/agent/properties"
								className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
							>
								Cancel
							</Link>
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-7 py-2.5 text-sm font-bold text-white transition hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isSubmitting ? (
									<>
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
										Publishing…
									</>
								) : (
									"Publish Listing"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>

			<PropertyMapPicker
				open={mapOpen}
				onClose={() => setMapOpen(false)}
				onConfirm={(loc) => {
					setLocation(loc);
					setMapOpen(false);
				}}
				initialLocation={location ?? undefined}
			/>
		</>
	);
}
