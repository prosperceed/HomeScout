"use client";

import { useState, useEffect } from "react";
import { X, MapPin, ChevronDown, CheckCircle2, Loader2, Lock } from "lucide-react";
import { PropertyMapPicker, type PickedLocation } from "@/components/maps/PropertyMapPicker";
import { PROPERTY_TYPES, AMENITIES } from "@/lib/constants";
import { updateListingAction } from "@/app/actions/listing-actions";
import { toast } from "@/lib/toast";
import type { Tables } from "@/types/database.types";

type PropertyRow = Tables<"property_listings">;

interface EditListingModalProps {
  listing: PropertyRow;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

const PRICE_PERIODS = [
  { value: "per_year", label: "Per Year" },
  { value: "per_month", label: "Per Month" },
  { value: "per_night", label: "Per Night" },
];

const LISTING_TAGS = [
  { value: "for_rent", label: "For Rent" },
  { value: "for_sale", label: "For Sale" },
  { value: "shortlet", label: "Shortlet" },
];

export function EditListingModal({ listing, open, onClose, onUpdated }: EditListingModalProps) {
  const isLocked = listing.status === "under_review";

  const [mapOpen, setMapOpen] = useState(false);
  const [location, setLocation] = useState<PickedLocation | null>(
    listing.lat && listing.lng
      ? {
          lat: listing.lat,
          lng: listing.lng,
          formatted_address: listing.formatted_address ?? "",
          state: listing.state ?? "",
          local_government: listing.local_government ?? "",
          city: listing.city ?? "",
        }
      : null
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(listing.amenities ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: listing.title,
    description: listing.description ?? "",
    type: listing.type,
    price: String(listing.price),
    price_period: listing.price_period,
    listing_tag: listing.listing_tag,
    bedrooms: String(listing.bedrooms),
    bathrooms: String(listing.bathrooms),
  });

  // Re-sync when listing prop changes
  useEffect(() => {
    setForm({
      title: listing.title,
      description: listing.description ?? "",
      type: listing.type,
      price: String(listing.price),
      price_period: listing.price_period,
      listing_tag: listing.listing_tag,
      bedrooms: String(listing.bedrooms),
      bathrooms: String(listing.bathrooms),
    });
    setSelectedAmenities(listing.amenities ?? []);
    setLocation(
      listing.lat && listing.lng
        ? {
            lat: listing.lat,
            lng: listing.lng,
            formatted_address: listing.formatted_address ?? "",
            state: listing.state ?? "",
            local_government: listing.local_government ?? "",
            city: listing.city ?? "",
          }
        : null
    );
  }, [listing]);

  if (!open) return null;

  const handleField =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setIsSubmitting(true);
    const result = await updateListingAction({
      id: listing.id,
      title: form.title,
      description: form.description || null,
      type: form.type,
      price: Number(form.price),
      price_period: form.price_period,
      listing_tag: form.listing_tag,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      amenities: selectedAmenities,
      formatted_address: location?.formatted_address ?? null,
      lat: location?.lat ?? null,
      lng: location?.lng ?? null,
      state: location?.state ?? null,
      local_government: location?.local_government ?? null,
      city: location?.city ?? null,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Listing updated successfully.");
      onUpdated?.();
      onClose();
    } else {
      toast.error(result.error ?? "Failed to update listing.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 py-8">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-[0_32px_80px_rgba(15,23,42,0.25)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-black tracking-[-0.03em] text-slate-900">
                Edit Listing
              </h2>
              {isLocked ? (
                <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                  <Lock className="h-3 w-3" />
                  Under review — editing is locked
                </p>
              ) : (
                <p className="mt-0.5 text-xs text-slate-400">Update your property details</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Locked overlay banner */}
          {isLocked && (
            <div className="mx-6 mt-5 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
              <Lock className="h-4 w-4 flex-shrink-0 text-amber-600" />
              <p className="text-xs font-semibold text-amber-700">
                This listing is currently under review. You cannot make changes until the review is complete.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Listing Title</label>
              <input
                required
                disabled={isLocked}
                value={form.title}
                onChange={handleField("title")}
                placeholder="e.g. 3-Bed Apartment, Lekki Phase 1"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Type + Period */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Property Type</label>
                <div className="relative">
                  <select
                    required
                    disabled={isLocked}
                    value={form.type}
                    onChange={handleField("type")}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {PROPERTY_TYPES.map((pt) => (
                      <option key={pt.value} value={pt.value}>{pt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Listing Tag</label>
                <div className="relative">
                  <select
                    disabled={isLocked}
                    value={form.listing_tag}
                    onChange={handleField("listing_tag")}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {LISTING_TAGS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Price / Beds / Baths */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Price (₦)</label>
                <input
                  required
                  type="number"
                  disabled={isLocked}
                  value={form.price}
                  onChange={handleField("price")}
                  placeholder="1,200,000"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  disabled={isLocked}
                  value={form.bedrooms}
                  onChange={handleField("bedrooms")}
                  placeholder="3"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Bathrooms</label>
                <input
                  type="number"
                  min="0"
                  disabled={isLocked}
                  value={form.bathrooms}
                  onChange={handleField("bathrooms")}
                  placeholder="2"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Price Period */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Price Period</label>
              <div className="relative w-48">
                <select
                  disabled={isLocked}
                  value={form.price_period}
                  onChange={handleField("price_period")}
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {PRICE_PERIODS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Description</label>
              <textarea
                rows={3}
                disabled={isLocked}
                value={form.description}
                onChange={handleField("description")}
                placeholder="Describe the property features…"
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => {
                  const on = selectedAmenities.includes(a);
                  return (
                    <button
                      type="button"
                      key={a}
                      disabled={isLocked}
                      onClick={() => toggleAmenity(a)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        on
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Property Location</label>
              <button
                type="button"
                disabled={isLocked}
                onClick={() => setMapOpen(true)}
                className={`flex h-12 w-full items-center gap-3 rounded-xl border px-4 text-sm font-semibold transition ${
                  location
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-blue-50/50"
                } disabled:cursor-not-allowed disabled:opacity-50`}
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

            {/* Footer */}
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
                disabled={isLocked || isSubmitting}
                style={!isLocked ? { background: "linear-gradient(to right, #3b82f6, #1d4ed8)" } : undefined}
                className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)] transition hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : isLocked ? (
                  <>
                    <Lock className="h-4 w-4" />
                    Locked
                  </>
                ) : (
                  "Save Changes"
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
