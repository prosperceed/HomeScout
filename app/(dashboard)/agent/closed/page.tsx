import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAgentBookings } from "@/lib/supabase/queries";
import { AgentClosedView } from "@/components/agent/AgentClosedView";

async function AgentClosedContent() {
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
					Closed
				</p>
				<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">
					Closed Transactions
				</h1>
				<p className="mt-0.5 text-sm text-slate-400">
					Record of all successfully closed contracts, leases, and commissions
				</p>
			</div>

			<AgentClosedView bookings={bookings} />
		</div>
	);
}

export default function AgentClosedPage() {
	return (
		<Suspense>
			<AgentClosedContent />
		</Suspense>
	);
}
