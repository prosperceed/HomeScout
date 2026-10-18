import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLandlordStats, getLandlordProperties } from "@/lib/supabase/queries";
import { LandlordStatCards } from "@/components/landlord/LandlordStatCards";
import { LandlordListingsTable } from "@/components/landlord/LandlordListingsTable";

export default async function LandlordDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [stats, properties] = await Promise.all([
    getLandlordStats(user.id),
    getLandlordProperties(user.id),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Dashboard</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] text-slate-900">Landlord overview</h1>
      </header>

      <LandlordStatCards stats={stats} />

      <LandlordListingsTable properties={properties} />
    </div>
  );
}
