"use client";

import Link from "next/link";
import { Plus, MapPin } from "lucide-react";
import type { Tables } from "@/types/database.types";

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

function formatPrice(n: number, period: string) {
  const val = n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `₦${(n / 1_000).toFixed(0)}k` : `₦${n}`;
  const p = period === "per_year" ? "/yr" : period === "per_month" ? "/mo" : "/night";
  return `${val}${p}`;
}

export function LandlordListingsTable({ properties }: Props) {
  return (
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
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70">
                {["Property", "Tag", "Price", "Bedrooms", "Status", "Listed"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {properties.map((p) => {
                const status = statusConfig[p.status] ?? statusConfig.inactive;
                const tag = tagConfig[p.listing_tag] ?? tagConfig.for_rent;
                return (
                  <tr key={p.id} className="group transition-colors hover:bg-stone-50/60">
                    <td className="px-5 py-4">
                      <p className="max-w-[220px] truncate text-sm font-semibold text-slate-800">{p.title}</p>
                      {p.formatted_address && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{p.formatted_address}</span>
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold ${tag.classes}`}>
                        {tag.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-900">
                      {formatPrice(p.price, p.price_period)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {p.bedrooms} bed · {p.bathrooms} bath
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${status.classes}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {new Date(p.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
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
