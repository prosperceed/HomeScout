"use client";

import { Building2, Home, Clock, CheckCircle2 } from "lucide-react";
import type { getLandlordStats } from "@/lib/supabase/queries";

type Stats = Awaited<ReturnType<typeof getLandlordStats>>;
interface Props { stats: Stats; }

export function LandlordStatCards({ stats }: Props) {
  const cards = [
    {
      label: "Total listings",
      value: stats.totalListings,
      icon: Building2,
      accent: "bg-teal-500",
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      label: "Active listings",
      value: stats.activeListings,
      icon: Home,
      accent: "bg-sage-500",
      iconBg: "bg-sage-50",
      iconColor: "text-sage-600",
    },
    {
      label: "Occupied units",
      value: stats.rentedUnits,
      icon: CheckCircle2,
      accent: "bg-brand-500",
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
    },
    {
      label: "Pending requests",
      value: stats.pendingRequests,
      icon: Clock,
      accent: "bg-amber-500",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-[24px] border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg}`}>
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black tracking-[-0.06em] text-slate-900">
              {String(card.value).padStart(2, "0")}
            </p>
            <div className={`mt-3 h-1 w-12 rounded-full ${card.accent}`} />
          </div>
        );
      })}
    </div>
  );
}
