import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientStats, getClientBookings } from "@/lib/supabase/queries";
import { ClientBookingsTable } from "@/components/client/ClientBookingsTable";
import { ClientStatCards } from "@/components/client/ClientStatCards";
import { ClientWelcomeHero } from "@/components/client/ClientWelcomeHero";
import { ClientJourneyCard } from "@/components/client/ClientJourneyCard";
import { SpendingChart } from "@/components/ui/SpendingChart";

async function ClientDashboardContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [stats, bookings] = await Promise.all([
    getClientStats(user.id),
    getClientBookings(user.id),
  ]);

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "there";
  const firstName = fullName.trim().split(/\s+/)[0] || "there";

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 sm:space-y-8">
      <ClientWelcomeHero firstName={firstName} />

      <section aria-label="Overview statistics" className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Your space</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-900 sm:text-3xl">Overview</h2>
          </div>
        </div>
        <ClientStatCards stats={stats} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <SpendingChart />
        </div>
        <ClientJourneyCard bookings={bookings} />
      </div>

      <ClientBookingsTable bookings={bookings} />
    </div>
  );
}

function DashboardSkeleton() {
  const block = "animate-pulse rounded-3xl bg-white/70 ring-1 ring-stone-200/60";
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 sm:space-y-8">
      <div className="h-[240px] animate-pulse rounded-[2rem] bg-slate-800/90 sm:h-[220px]" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`h-44 sm:h-52 ${block}`} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className={`h-[380px] ${block}`} />
        <div className={`h-[380px] ${block}`} />
      </div>
      <div className={`h-72 ${block}`} />
    </div>
  );
}

export default function ClientDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ClientDashboardContent />
    </Suspense>
  );
}
