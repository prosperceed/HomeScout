"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MapPin, ExternalLink, Pencil, Trash2, Lock, AlertTriangle, Loader2 } from "lucide-react";
import type { Tables } from "@/types/database.types";
import { EditListingModal } from "@/components/agent/EditListingModal";
import { deleteListingAction } from "@/app/actions/listing-actions";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";

type PropertyRow = Tables<"property_listings">;
interface Props { properties: PropertyRow[]; }

const statusConfig: Record<string, { label: string; classes: string }> = {
  available:    { label: "Available",    classes: "bg-sage-50 text-sage-700 ring-1 ring-sage-200" },
  rented:       { label: "Rented",       classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  under_review: { label: "Under review", classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  inactive:     { label: "Inactive",     classes: "bg-slate-100 text-slate-500 ring-1 ring-slate-200" },
};

const tagConfig: Record<string, { label: string; classes: string }> = {
  for_sale: { label: "For Sale",  classes: "bg-emerald-100 text-emerald-700" },
  for_rent: { label: "For Rent",  classes: "bg-blue-100 text-blue-700" },
  shortlet: { label: "Shortlet",  classes: "bg-violet-100 text-violet-700" },
};

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

function formatPrice(n: number, period: string) {
  const val = n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `₦${(n / 1_000).toFixed(0)}k` : `₦${n}`;
  const p = period === "per_year" ? "/yr" : period === "per_month" ? "/mo" : "/night";
  return `${val}${p}`;
}

export function LandlordListingsTable({ properties: initialProperties }: Props) {
  // Optimistic local state so deletes reflect immediately without full page reload
  const [properties, setProperties] = useState<PropertyRow[]>(initialProperties);

  // Edit modal
  const [editingListing, setEditingListing] = useState<PropertyRow | null>(null);

  // Delete confirmation
  const [deletingListing, setDeletingListing] = useState<PropertyRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deletingListing) return;
    setIsDeleting(true);
    const result = await deleteListingAction(deletingListing.id);
    setIsDeleting(false);
    if (result.success) {
      setProperties((prev) => prev.filter((p) => p.id !== deletingListing.id));
      toast.success("Listing deleted.");
      setDeletingListing(null);
    } else {
      toast.error(result.error ?? "Failed to delete listing.");
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
          <div>
            <h2 className="text-base font-black tracking-[-0.02em] text-slate-900">Your Properties</h2>
            <p className="mt-0.5 text-sm text-slate-400">{properties.length} listing{properties.length !== 1 ? "s" : ""} total</p>
          </div>
          <Link
            href="/landlord/properties/new"
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Add listing
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-semibold text-slate-400">No properties yet</p>
            <p className="mt-1 text-xs text-slate-300">Add your first listing to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/70">
                  {["Property", "Tag", "Price", "Bedrooms", "Status", "Listed", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {properties.map((p) => {
                  const thumb = getThumbnail(p.images, p.id);
                  const status = statusConfig[p.status] ?? statusConfig.inactive;
                  const tag = tagConfig[p.listing_tag] ?? tagConfig.for_rent;
                  const locked = p.status === "under_review";

                  return (
                    <tr key={p.id} className="group transition-colors hover:bg-stone-50/60">
                      {/* Property */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
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
                          <div className="min-w-0">
                            <p className="max-w-[200px] truncate text-sm font-semibold text-slate-800">{p.title}</p>
                            {p.formatted_address && (
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{p.formatted_address}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Tag */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold ${tag.classes}`}>
                          {tag.label}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 text-sm font-bold text-slate-900">
                        {formatPrice(p.price, p.price_period)}
                      </td>

                      {/* Bedrooms */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {p.bedrooms} bed · {p.bathrooms} bath
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${status.classes}`}>
                          {status.label}
                        </span>
                      </td>

                      {/* Listed */}
                      <td className="px-5 py-4 text-xs text-slate-400">
                        {formatDate(p.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {/* View */}
                          <Link
                            href={`/properties/${p.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-stone-50 hover:text-slate-900"
                          >
                            View
                            <ExternalLink className="h-3 w-3" />
                          </Link>

                          {/* Edit */}
                          <button
                            onClick={() => setEditingListing(p)}
                            disabled={locked}
                            title={locked ? "Under review — cannot edit" : "Edit listing"}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                              locked
                                ? "cursor-not-allowed border-stone-100 bg-stone-50 text-slate-300"
                                : "border-teal-100 bg-teal-50 text-teal-600 hover:bg-teal-100 hover:text-teal-700"
                            }`}
                          >
                            {locked ? <Lock className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
                            Edit
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingListing(p)}
                            disabled={locked}
                            title={locked ? "Under review — cannot delete" : "Delete listing"}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                              locked
                                ? "cursor-not-allowed border-stone-100 bg-stone-50 text-slate-300"
                                : "border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700"
                            }`}
                          >
                            {locked ? <Lock className="h-3 w-3" /> : <Trash2 className="h-3 w-3" />}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal — reuse the shared EditListingModal */}
      {editingListing && (
        <EditListingModal
          listing={editingListing}
          open={Boolean(editingListing)}
          onClose={() => setEditingListing(null)}
          onUpdated={() => setEditingListing(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingListing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeletingListing(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_32px_80px_rgba(15,23,42,0.25)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="mt-4 text-base font-black text-slate-900">Delete Listing</h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">{deletingListing.title}</span>?
              This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                onClick={() => setDeletingListing(null)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
