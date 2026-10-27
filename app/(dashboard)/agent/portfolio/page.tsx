import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAgentProperties } from "@/lib/supabase/queries";
import { AgentPortfolioView } from "@/components/agent/AgentPortfolioView";

export default async function AgentPortfolioPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const properties = await getAgentProperties(user.id);

	return (
		<div className="mx-auto max-w-[1400px] space-y-6">
			<div>
				<p className="text-xs font-bold uppercase tracking-widest text-slate-400">
					Portfolio
				</p>
				<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">
					Managed Properties
				</h1>
				<p className="mt-0.5 text-sm text-slate-400">
					Comprehensive overview of your property portfolio and current asset performance
				</p>
			</div>

			<AgentPortfolioView properties={properties} />
		</div>
	);
}
