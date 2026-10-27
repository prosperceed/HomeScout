import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAgentStats } from "@/lib/supabase/queries";
import { AgentPerformanceChart } from "@/components/agent/AgentPerformanceChart";
import { AgentDealGrowthChart } from "@/components/agent/AgentDealGrowthChart";
import { AgentStatCardsDB } from "@/components/agent/AgentStatCardsDB";

export default async function AgentAnalyticsPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const stats = await getAgentStats(user.id);

	return (
		<div className="mx-auto max-w-[1400px] space-y-6">
			<div>
				<p className="text-xs font-bold uppercase tracking-widest text-slate-400">
					Analytics
				</p>
				<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">
					Performance & Insights
				</h1>
				<p className="mt-0.5 text-sm text-slate-400">
					Detailed breakdown of your property inquiries, deal conversion, and revenue metrics
				</p>
			</div>

			<AgentStatCardsDB stats={stats} />

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
				<AgentPerformanceChart />
				<AgentDealGrowthChart />
			</div>
		</div>
	);
}
