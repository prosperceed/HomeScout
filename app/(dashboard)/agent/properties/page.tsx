"use client";

import { useState } from "react";
import { Building2, Plus } from "lucide-react";
import { NewListingModal } from "@/components/agent/NewListingModal";
import { AgentListingsTable } from "@/components/agent/AgentListingsTable";

export default function AgentPropertiesPage() {
	const [newListingOpen, setNewListingOpen] = useState(false);

	return (
		<>
			<div className="mx-auto max-w-[1400px] space-y-6">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className="text-xs font-bold uppercase tracking-widest text-slate-400">Properties</p>
						<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">Property Listings</h1>
						<p className="mt-0.5 text-sm text-slate-400">Create and manage all your property listings</p>
					</div>
					<button
						onClick={() => setNewListingOpen(true)}
						className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 text-sm font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)] transition hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)]"
					>
						<Plus className="h-4 w-4" />
						New Listing
					</button>
				</div>
				<AgentListingsTable onNewListing={() => setNewListingOpen(true)} />
			</div>
			<NewListingModal open={newListingOpen} onClose={() => setNewListingOpen(false)} />
		</>
	);
}
