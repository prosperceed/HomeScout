import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAgentStats, getAgentBookings } from "@/lib/supabase/queries";
import { AgentStatCardsDB } from "@/components/agent/AgentStatCardsDB";
import { AgentListingsTableDB } from "@/components/agent/AgentListingsTableDB";
import { AgentPerformanceChart } from "@/components/agent/AgentPerformanceChart";
import { AgentDealGrowthChart } from "@/components/agent/AgentDealGrowthChart";
import { Calendar, Download } from "lucide-react";

async function AgentDashboardContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [stats, bookings] = await Promise.all([
    getAgentStats(user.id),
    getAgentBookings(user.id),
  ]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Agent Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">
            Sales Overview
          </h1>
          <p className="mt-0.5 text-sm text-slate-400">
            {stats.agentInfo?.agency_name
              ? `${stats.agentInfo.agency_name} · Your current summary`
              : "Your current sales summary and activity"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            <Calendar className="h-4 w-4 text-slate-400" />
            This Month
          </button>
          <button className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            <Download className="h-4 w-4 text-slate-400" />
            Export
          </button>
        </div>
      </div>

      <AgentStatCardsDB stats={stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <AgentPerformanceChart />
        <AgentDealGrowthChart />
      </div>

      <div className="mt-4">
        <AgentListingsTableDB bookings={bookings} />
      </div>
    </div>
  );
}

export default function AgentDashboardPage() {
  return (
    <Suspense>
      <AgentDashboardContent />
    </Suspense>
  );
}
