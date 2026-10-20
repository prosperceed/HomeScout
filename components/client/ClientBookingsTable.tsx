"use client";

import { ArrowUpRight, Building2, CheckCircle2, Clock, MapPin, Search, XCircle } from "lucide-react";
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
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
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

function periodShort(p: string | null | undefined) {
  return p === "per_year" ? "yr" : p === "per_month" ? "mo" : "night";
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function firstImage(images: unknown): string | null {
  if (Array.isArray(images)) {
    const first = images[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "url" in first && typeof (first as { url: unknown }).url === "string") {
      return (first as { url: string }).url;
    }
  }
  if (typeof images === "string") return images;
  return null;
}

function PropertyThumb({ images, title }: { images: unknown; title: string }) {
  const src = firstImage(images);
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 ring-1 ring-stone-200/70">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={title} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-400">
          <Building2 className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}

function CardHeader({ count }: { count?: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-5 sm:px-6">
      <div>
        <h2 className="text-lg font-black tracking-[-0.03em] text-slate-900">Recent Applications</h2>
        <p className="mt-0.5 text-sm text-slate-500">Your latest property enquiries &amp; bookings</p>
      </div>
      {count !== undefined && (
        <Link
          href="/client/applications"
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
        >
          View all <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

export function ClientBookingsTable({ bookings }: Props) {
  if (bookings.length === 0) {
    return (
      <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/70 shadow-[0_2px_16px_-6px_rgba(15,23,42,0.08)]">
        <CardHeader />
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-3xl bg-coral-200 opacity-60 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-coral-400 to-coral-600 text-white shadow-[0_10px_24px_-8px_rgba(249,93,46,0.6)]">
              <Search className="h-7 w-7" />
            </div>
          </div>
          <p className="text-base font-black tracking-tight text-slate-900">No applications yet</p>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Browse verified properties and send your first booking request.
          </p>
          <Link
            href="/explore"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-700"
          >
            Explore properties <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/70 shadow-[0_2px_16px_-6px_rgba(15,23,42,0.08)]">
      <CardHeader count={bookings.length} />

      {/* ── Mobile / tablet: card list ── */}
      <ul className="divide-y divide-stone-100 md:hidden">
        {bookings.map((booking) => {
          const property = booking.property;
          const agent = booking.agent_profile;
          const title = property?.title ?? "Property";
          return (
            <li key={booking.id} className="px-5 py-4 transition-colors active:bg-stone-50">
              <div className="flex items-start gap-3">
                <PropertyThumb images={property?.images} title={title} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-bold text-slate-900">{title}</p>
                    <StatusBadge status={booking.status as BookingStatus} />
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{property?.formatted_address ?? property?.state ?? "—"}</span>
                  </p>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-600">{agent?.full_name ?? "Owner"}</p>
                      <p className="text-[11px] text-slate-400">{formatDate(booking.created_at)}</p>
                    </div>
                    <p className="shrink-0 text-right">
                      <span className="text-base font-black tracking-tight text-slate-900">
                        {formatPrice(booking.price_at_booking)}
                      </span>
                      <span className="text-xs text-slate-400">/{periodShort(booking.price_period)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* ── Desktop: table ── */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/70">
              <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Property</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Agent / Landlord</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Status</th>
              <th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Price</th>
              <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {bookings.map((booking) => {
              const property = booking.property;
              const agent = booking.agent_profile;
              const title = property?.title ?? "Property";
              const initials = (agent?.full_name ?? "Owner")
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <tr key={booking.id} className="group transition-colors hover:bg-[#faf8f6]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <PropertyThumb images={property?.images} title={title} />
                      <div className="min-w-0 max-w-[260px]">
                        <p className="truncate text-sm font-bold text-slate-900 group-hover:text-coral-600">{title}</p>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
                          <span className="capitalize">{property?.type?.replace(/_/g, " ") ?? "—"}</span>
                          <span className="text-slate-300">•</span>
                          <span className="truncate">{property?.formatted_address ?? property?.state ?? ""}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[11px] font-black text-teal-700 ring-1 ring-teal-100">
                        {initials}
                      </span>
                      <span className="truncate text-sm font-semibold text-slate-700">{agent?.full_name ?? "Owner"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={booking.status as BookingStatus} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <span className="text-sm font-black tracking-tight text-slate-900">
                      {formatPrice(booking.price_at_booking)}
                    </span>
                    <span className="text-xs text-slate-400">/{periodShort(booking.price_period)}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <span className="text-xs font-medium text-slate-400">{formatDate(booking.created_at)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-stone-100 px-5 py-4 sm:px-6">
        <p className="text-xs font-medium text-slate-400">
          Showing {bookings.length} application{bookings.length !== 1 ? "s" : ""}
        </p>
        <Link href="/explore" className="text-xs font-bold text-coral-600 transition hover:text-coral-700">
          Find more homes →
        </Link>
      </div>
    </div>
  );
}
