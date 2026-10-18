"use client";

import { ArrowUpRight, MoreHorizontal, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import type { BookingWithProperty } from "@/lib/supabase/queries";

type BookingStatus = "pending" | "approved" | "viewing" | "rejected" | "cancelled" | "completed";

interface Props { bookings: BookingWithProperty[]; }

const statusConfig: Record<BookingStatus, { label: string; bg: string; text: string; dot: string; icon: React.ElementType }> = {
  approved:  { label: "Approved",  bg: "bg-sage-50",   text: "text-sage-700",   dot: "bg-sage-500",  icon: CheckCircle2 },
  pending:   { label: "Pending",   bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400", icon: Clock },
  viewing:   { label: "Viewing",   bg: "bg-teal-50",   text: "text-teal-700",   dot: "bg-teal-500",  icon: ArrowUpRight },
  rejected:  { label: "Rejected",  bg: "bg-rose-50",   text: "text-rose-700",   dot: "bg-rose-400",  icon: XCircle },
  cancelled: { label: "Cancelled", bg: "bg-slate-100", text: "text-slate-500",  dot: "bg-slate-400", icon: XCircle },
  completed: { label: "Completed", bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500",  icon: CheckCircle2 },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = statusConfig[status] ?? statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function formatPrice(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₦${(n / 1_000).toFixed(0)}k`;
  return `₦${n}`;
}

const agentTypeBadge: Record<string, { bg: string; text: string }> = {
  agent:    { bg: "bg-teal-100",  text: "text-teal-700"  },
  landlord: { bg: "bg-coral-100", text: "text-coral-700" },
};

export function ClientBookingsTable({ bookings }: Props) {
  if (bookings.length === 0) {
    return (
      <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/60">
        <div className="border-b border-stone-100 px-6 py-5">
          <h2 className="text-lg font-black tracking-[-0.03em] text-slate-900">Recent Applications</h2>
          <p className="mt-0.5 text-sm text-slate-500">Your latest property enquiries &amp; bookings</p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-semibold text-slate-400">No applications yet</p>
          <p className="mt-1 text-xs text-slate-300">Browse properties and send your first booking request.</p>
          <Link href="/explore" className="mt-4 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600">
            Explore properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/60">
      <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-black tracking-[-0.03em] text-slate-900">Recent Applications</h2>
          <p className="mt-0.5 text-sm text-slate-500">Your latest property enquiries &amp; bookings</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-700">
          View all <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/70">
              {["Agent / Landlord", "Property Type", "Status", "Price", "Date", ""].map((h) => (
                <th key={h} className={`px-${h ? "4" : "6"} py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 ${h === "Price" || h === "Date" ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {bookings.map((booking) => {
              const property = booking.property;
              const agent = booking.agent_profile;
              const typeKey = property ? "agent" : "landlord";
              const badge = agentTypeBadge[typeKey];

              return (
                <tr key={booking.id} className="group transition-colors hover:bg-stone-50/60">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-slate-800">
                        {agent?.full_name ?? "Owner"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                          Agent
                        </span>
                        <span className="truncate text-xs text-slate-400">
                          {property?.formatted_address ?? property?.state ?? ""}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-slate-600 capitalize">
                      {property?.type?.replace(/_/g, " ") ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={booking.status as BookingStatus} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-black tracking-tight text-slate-900">
                      {formatPrice(booking.price_at_booking)}
                    </span>
                    <span className="text-xs text-slate-400">/{booking.price_period === "per_year" ? "yr" : booking.price_period === "per_month" ? "mo" : "night"}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-xs font-medium text-slate-400">
                      {new Date(booking.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-stone-100 hover:text-slate-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-stone-100 px-6 py-4">
        <p className="text-xs font-medium text-slate-400">
          Showing {bookings.length} application{bookings.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
