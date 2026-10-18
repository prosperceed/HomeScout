"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { getAgentStats } from "@/lib/supabase/queries";

type Stats = Awaited<ReturnType<typeof getAgentStats>>;

interface Props { stats: Stats; }

function formatRevenue(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₦${(n / 1_000).toFixed(0)}k`;
  return `₦${n}`;
}

export function AgentStatCardsDB({ stats }: Props) {
  const bookingChange = stats.lastMonthBookings > 0
    ? Math.round(((stats.thisMonthBookings - stats.lastMonthBookings) / stats.lastMonthBookings) * 100)
    : 0;

  const cards = [
    {
      label: "Total Listings",
      value: String(stats.totalListings),
      sub: `${stats.activeListings} active`,
      change: 0,
      gradient: true,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
        </svg>
      ),
    },
    {
      label: "Active Clients",
      value: String(stats.activeClients),
      sub: `${stats.thisMonthBookings} this month`,
      change: bookingChange,
      gradient: false,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      ),
    },
    {
      label: "Closed Deals",
      value: String(stats.closedDeals),
      sub: "All time",
      change: 0,
      gradient: false,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: "Total Revenue",
      value: formatRevenue(stats.totalRevenue),
      sub: "Completed bookings",
      change: 0,
      gradient: false,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const isUp = card.change >= 0;
        return (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-2xl p-5 ${
              card.gradient
                ? "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white"
                : "bg-white ring-1 ring-slate-200/80"
            }`}
          >
            {card.gradient && (
              <>
                <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-white/5" />
              </>
            )}
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest ${card.gradient ? "text-blue-100" : "text-slate-400"}`}>
                  {card.label}
                </p>
                <p className={`mt-2 text-3xl font-black tracking-[-0.04em] ${card.gradient ? "text-white" : "text-slate-900"}`}>
                  {card.value}
                </p>
                {card.change !== 0 && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {isUp
                      ? <TrendingUp className={`h-3.5 w-3.5 ${card.gradient ? "text-green-300" : "text-green-500"}`} />
                      : <TrendingDown className={`h-3.5 w-3.5 ${card.gradient ? "text-red-300" : "text-red-500"}`} />
                    }
                    <span className={`text-xs font-bold ${isUp ? (card.gradient ? "text-green-300" : "text-green-600") : (card.gradient ? "text-red-300" : "text-red-500")}`}>
                      {isUp ? "+" : ""}{card.change}%
                    </span>
                    <span className={`text-xs ${card.gradient ? "text-blue-200" : "text-slate-400"}`}>vs last month</span>
                  </div>
                )}
                <p className={`mt-2 text-xs ${card.gradient ? "text-blue-200" : "text-slate-400"}`}>
                  {card.sub}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${card.gradient ? "bg-white/20" : "bg-slate-100"}`}>
                <span className={card.gradient ? "text-white" : "text-slate-600"}>{card.icon}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
