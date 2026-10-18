import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientStats, getClientBookings } from "@/lib/supabase/queries";
import { ClientBookingsTable } from "@/components/client/ClientBookingsTable";
import { ClientStatCards } from "@/components/client/ClientStatCards";
import { SpendingChart } from "@/components/ui/SpendingChart";

export default async function ClientDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [stats, bookings] = await Promise.all([
    getClientStats(user.id),
    getClientBookings(user.id),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Your space</p>
        <h1 className="mt-1.5 text-4xl font-black tracking-[-0.04em] text-slate-900">Overview</h1>
      </header>

      <ClientStatCards stats={stats} />

      <SpendingChart />

      <ClientBookingsTable bookings={bookings} />
    </div>
  );
}
