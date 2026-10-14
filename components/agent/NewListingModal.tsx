"use client";

import { useState } from "react";
import { X, MapPin, Upload, ChevronDown, CheckCircle2 } from "lucide-react";
import { PropertyMapPicker, type PickedLocation } from "@/components/maps/PropertyMapPicker";
import { PROPERTY_TYPES, AMENITIES } from "@/lib/constants";

interface NewListingModalProps {
	open: boolean;
	onClose: () => void;
}

const PRICE_PERIODS = [
	{ value: "per_year", label: "Per Year" },
	{ value: "per_month", label: "Per Month" },
	{ value: "per_night", label: "Per Night" },
];

export function NewListingModal({ open, onClose }: NewListingModalProps) {
	const [mapOpen, setMapOpen] = useState(false);
	const [location, setLocation] = useState<PickedLocation | null>(null);
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form, setForm] = useState({
		title: "",
		description: "",
		type: "",
		price: "",
		price_period: "per_year",
		bedrooms: "",
		bathrooms: "",
		area_sqft: "",
	});

	if (!open) return null;

	const handleField = (key: keyof typeof form) => (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

	const toggleAmenity = (a: string) =>
		setSelectedAmenities((prev) =>
			prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
		);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!location) {
			alert("Please pick a location on the map.");
			return;
		}
		setIsSubmitting(true);
		await new Promise((r) => setTimeout(r, 1200));
		setIsSubmitting(false);
		onClose();
	};

	return (
		<>
			<div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 py-8">
				<div
					className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
					onClick={onClose}
				/>
				<div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-[0_32px_80px_rgba(15,23,42,0.25)]">
					<div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
						<div>
							<h2 className="text-lg font-black tracking-[-0.03em] text-slate-900">
								New Property Listing
							</h2>
							<p className="mt-0.5 text-xs text-slate-400">Fill in the details and pin the location</p>
						</div>
						<button
							onClick={onClose}
							className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
						>
							<X className="h-4 w-4" />
						</button>
					</div>

					<form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
						<div className="space-y-1.5">
							<label className="text-xs font-bold text-slate-700">Listing Title</label>
							<input
								required
								value={form.title}
								onChange={handleField("title")}
								placeholder="e.g. 3-Bed Apartment, Lekki Phase 1"
								className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<label className="text-xs font-bold text-slate-700">Property Type</label>
								<div className="relative">
									<select
										required
										value={form.type}
										onChange={handleField("type")}
										className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
									>
										<option value="">Select type</option>
										{PROPERTY_TYPES.map((pt) => (
											<option key={pt.value} value={pt.value}>{pt.label}</option>
										))}
									</select>
									<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								</div>
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-bold text-slate-700">Price Period</label>
								<div className="relative">
									<select
										value={form.price_period}
										onChange={handleField("price_period")}
										className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
									>
										{PRICE_PERIODS.map((p) => (
											<option key={p.value} value={p.value}>{p.label}</option>
										))}
									</select>
									<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								</div>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-1.5">
								<label className="text-xs font-bold text-slate-700">Price (₦)</label>
								<input
									required
									type="number"
									value={form.price}
									onChange={handleField("price")}
									placeholder="1,200,000"
									className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
								/>
							</div>
							<div className="space-y-1.5">
								<label className="text-xs font-bold text-slate-700">Bedrooms</label>
								<input
									type="number"
									value={form.bedrooms}
									onChange={handleField("bedrooms")}
									min="0"
									placeholder="3"
									className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
								/>
							</div>
							<div className="space-y-1.5">
								<label className="text-xs font-bold text-slate-700">Bathrooms</label>
								<input
									type="number"
									value={form.bathrooms}
									onChange={handleField("bathrooms")}
									min="0"
									placeholder="2"
									className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-bold text-slate-700">Description</label>
							<textarea
								rows={3}
								value={form.description}
								onChange={handleField("description")}
								placeholder="Describe the property features, condition, and key selling points…"
								className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-xs font-bold text-slate-700">Amenities</label>
							<div className="flex flex-wrap gap-2">
								{AMENITIES.map((a) => {
									const on = selectedAmenities.includes(a);
									return (
										<button
											type="button"
											key={a}
											onClick={() => toggleAmenity(a)}
											className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
												on
													? "bg-blue-600 text-white shadow-sm"
													: "bg-slate-100 text-slate-600 hover:bg-slate-200"
											}`}
										>
											{a}
										</button>
									);
								})}
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-bold text-slate-700">Property Location</label>
							<button
								type="button"
								onClick={() => setMapOpen(true)}
								className={`flex h-12 w-full items-center gap-3 rounded-xl border px-4 text-sm font-semibold transition ${
									location
										? "border-blue-400 bg-blue-50 text-blue-700"
										: "border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-blue-50/50"
								}`}
							>
								{location ? (
									<>
										<CheckCircle2 className="h-4 w-4 text-blue-600" />
										<span className="flex-1 truncate text-left">{location.formatted_address}</span>
									</>
								) : (
									<>
										<MapPin className="h-4 w-4 text-slate-400" />
										<span>Click to pick location on Google Maps</span>
									</>
								)}
							</button>
							{location && (
								<p className="text-xs text-slate-400">
									{location.lat.toFixed(5)}, {location.lng.toFixed(5)} · {location.state}
								</p>
							)}
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-bold text-slate-700">Photos</label>
							<div className="flex h-24 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition hover:border-blue-300 hover:bg-blue-50/40">
								<Upload className="h-5 w-5" />
								<span className="text-sm font-medium">Upload property images</span>
							</div>
						</div>

						<div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4">
							<button
								type="button"
								onClick={onClose}
								className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)] transition hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)] disabled:opacity-60"
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
