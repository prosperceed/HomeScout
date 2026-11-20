import AgentListingsTable from "@/components/agent/AgentListingsTable";

export default function AgentListingsPage() {
	return (
		<div className="mx-auto max-w-[1400px] space-y-6">
			<div>
				<p className="text-xs font-bold uppercase tracking-widest text-slate-400">
					Listings
				</p>
				<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">
					Property Listings
				</h1>
				<p className="mt-0.5 text-sm text-slate-400">
					Manage and monitor all properties uploaded by your agency
				</p>
			</div>
			<AgentListingsTable />
		</div>
	);
}
