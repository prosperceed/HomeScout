import Link from "next/link";
import { Plus } from "lucide-react";
import AgentListingsTable from "@/components/agent/AgentListingsTable";

export default function AgentPropertiesPage() {
	return (
		<div className="mx-auto max-w-[1400px] space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs font-bold uppercase tracking-widest text-slate-400">
						Properties
					</p>
					<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">
						Property Listings
					</h1>
					<p className="mt-0.5 text-sm text-slate-400">
						Create and manage all your property listings
					</p>
				</div>
			</div>
			<AgentListingsTable />
		</div>
	);
}
