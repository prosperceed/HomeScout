"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, MoreHorizontal } from "lucide-react";
import type { BookingWithProperty } from "@/lib/supabase/queries";

type BookingStatus = "pending" | "approved" | "viewing" | "rejected" | "cancelled" | "completed";

interface Props { bookings: BookingWithProperty[]; }

const statusConfig: Record<BookingStatus, { label: string; classes: string }> = {
  pending:   { label: "Pending",   classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  approved:  { label: "Approved",  classes: "bg-green-50 text-green-700 ring-1 ring-green-200" },
  viewing:   { label: "Viewing",   classes: "bg-teal-50 text-teal-700 ring-1 ring-teal-200" },
  rejected:  { label: "Rejected",  classes: "bg-red-50 text-red-600 ring-1 ring-red-200" },
  cancelled: { label: "Cancelled", classes: "bg-slate-100 text-slate-500 ring-1 ring-slate-200" },
  completed: { label: "Completed", classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = statusConfig[status] ?? statusConfig.pending;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

function formatPrice(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₦${(n / 1_000).toFixed(0)}k`;
  return `₦${n}`;
}

export function AgentListingsTableDB({ bookings }: Props) {
  const [query, setQuery] = useState("");

  const filtered = bookings.filter((b) => {
    const q = query.toLowerCase();
    return (
      !q ||
      (b.property?.title ?? "").toLowerCase().includes(q) ||
      (b.client_profile?.full_name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
        <h2 className="text-base font-black tracking-[-0.03em] text-slate-900">Recent Bookings</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties or clients..."
              className="h-8 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Sort
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100">
              {["Property", "Booking ID", "Date", "Client", "Status", "Price"].map((h) => (
                <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {h}
                </th>
              ))}
              <th className="px-4 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-slate-400">
                  {bookings.length === 0 ? "No bookings yet" : "No bookings match your search"}
                </td>
              </tr>
            ) : (
              filtered.map((booking) => (
                <tr key={booking.id} className="group border-b border-slate-50 transition hover:bg-blue-50/40">
                  <td className="px-4 py-3.5">
                    <p className="max-w-[200px] truncate text-sm font-semibold text-slate-800">
                      {booking.property?.title ?? "—"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {booking.property?.formatted_address ?? booking.property?.state ?? ""}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-mono font-medium text-slate-400">
                    #{booking.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">
                    {new Date(booking.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-slate-700">
                    {booking.client_profile?.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={booking.status as BookingStatus} />
                  </td>
                  <td className="px-4 py-3.5 text-sm font-black text-slate-900">
                    {formatPrice(booking.price_at_booking)}
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
