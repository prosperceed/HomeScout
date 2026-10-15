"use client";

import { Calendar, Download } from "lucide-react";
import { AgentStatCards } from "@/components/agent/AgentStatCards";
import { AgentPerformanceChart } from "@/components/agent/AgentPerformanceChart";
import { AgentDealGrowthChart } from "@/components/agent/AgentDealGrowthChart";
import { AgentListingsTable } from "@/components/agent/AgentListingsTable";

export default function AgentDashboardPage() {
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
						Your current sales summary and activity
					</p>
				</div>

				<div className="flex items-center gap-2">
					<button className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
						<Calendar className="h-4 w-4 text-slate-400" />
						This Month
						<svg
							className="h-4 w-4 text-slate-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					<button className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
						<Download className="h-4 w-4 text-slate-400" />
						Export
					</button>
				</div>
			</div>

			<AgentStatCards />

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
				<AgentPerformanceChart />
				<AgentDealGrowthChart />
			</div>

			<div className="mt-4">
				<AgentListingsTable />
			</div>
		</div>
	);
}
