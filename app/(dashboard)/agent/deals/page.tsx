import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAgentBookings } from "@/lib/supabase/queries";
import { AgentDealsView } from "@/components/agent/AgentDealsView";

export default async function AgentDealsPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const bookings = await getAgentBookings(user.id);

	return (
		<div className="mx-auto max-w-[1400px] space-y-6">
			<div>
				<p className="text-xs font-bold uppercase tracking-widest text-slate-400">
					Deals
				</p>
				<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">
					Deal Pipeline
				</h1>
				<p className="mt-0.5 text-sm text-slate-400">
					Track active proposals, negotiations, and closed agreements
				</p>
			</div>

			<AgentDealsView bookings={bookings} />
		</div>
	);
}
