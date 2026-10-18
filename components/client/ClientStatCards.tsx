"use client";

import { Heart, Building2, CheckCircle2, MessageSquare, MoreHorizontal } from "lucide-react";
import type { getClientStats } from "@/lib/supabase/queries";

type Stats = Awaited<ReturnType<typeof getClientStats>>;

interface Props { stats: Stats; }

export function ClientStatCards({ stats }: Props) {
  const cards = [
    {
      label: "Saved Homes",
      value: stats.savedCount,
      change: "View saved",
      icon: Heart,
      cardBg: "bg-gradient-to-br from-[#ff7a52] via-[#f95d2e] to-[#e04520]",
      iconBg: "bg-white/20",
    },
    {
      label: "Applications",
      value: stats.applicationsCount,
      change: "Track all",
      icon: Building2,
      cardBg: "bg-gradient-to-br from-[#334155] via-[#1e293b] to-[#0f172a]",
      iconBg: "bg-white/15",
    },
    {
      label: "Shortlisted",
      value: stats.shortlistedCount,
      change: "Approved bookings",
      icon: CheckCircle2,
      cardBg: "bg-gradient-to-br from-[#4aba8a] via-[#33a674] to-[#268660]",
      iconBg: "bg-white/20",
    },
    {
      label: "Messages",
      value: stats.totalMessages,
      change: `${stats.unreadMessages} unread`,
      icon: MessageSquare,
      cardBg: "bg-gradient-to-br from-[#5bb8cf] via-[#3a9db8] to-[#2d7f96]",
      iconBg: "bg-white/20",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`group relative overflow-hidden rounded-3xl p-6 ring-1 ring-black/8 transition-transform duration-200 hover:-translate-y-0.5 ${card.cardBg}`}
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.75%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%20opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] opacity-40" />
            <div className="relative flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBg}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <button className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/15 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="relative mt-4">
              <p className="text-sm font-medium text-white/80">{card.label}</p>
              <p className="mt-1 text-4xl font-black tracking-[-0.06em] text-white">
                {String(card.value).padStart(2, "0")}
              </p>
            </div>
            <p className="relative mt-3 text-xs font-semibold text-white/60">{card.change}</p>
          </div>
        );
      })}
    </div>
  );
}
