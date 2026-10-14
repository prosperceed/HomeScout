"use client";

import { useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";
import { ChevronDown } from "lucide-react";

const weekData = [
	{ month: "May", sales: 12, revenue: 1_200_000 },
	{ month: "Jun", sales: 18, revenue: 1_800_000 },
	{ month: "Jul", sales: 9, revenue: 900_000 },
	{ month: "Aug", sales: 30, revenue: 4_500_000 },
	{ month: "Sep", sales: 14, revenue: 1_400_000 },
	{ month: "Oct", sales: 22, revenue: 2_600_000 },
	{ month: "Nov", sales: 8, revenue: 800_000 },
	{ month: "Dec", sales: 16, revenue: 1_900_000 },
];

const monthData = [
	{ month: "Jan", sales: 8, revenue: 700_000 },
	{ month: "Feb", sales: 15, revenue: 1_300_000 },
	{ month: "Mar", sales: 20, revenue: 2_100_000 },
	{ month: "Apr", sales: 11, revenue: 1_050_000 },
	{ month: "May", sales: 24, revenue: 2_800_000 },
	{ month: "Jun", sales: 30, revenue: 4_500_000 },
	{ month: "Jul", sales: 18, revenue: 2_000_000 },
	{ month: "Aug", sales: 27, revenue: 3_200_000 },
	{ month: "Sep", sales: 14, revenue: 1_500_000 },
	{ month: "Oct", sales: 35, revenue: 5_100_000 },
	{ month: "Nov", sales: 22, revenue: 2_700_000 },
	{ month: "Dec", sales: 29, revenue: 3_800_000 },
];

function shortNum(n: number) {
	if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
	return `₦${n}`;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
	if (!active || !payload?.length) return null;
	const sales = payload.find((p) => p.dataKey === "sales");
	const revenue = payload.find((p) => p.dataKey === "revenue");
	return (
		<div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-900/10">
			<p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
			{sales && (
				<div className="flex items-center gap-2">
					<div className="h-2 w-2 rounded-full bg-blue-400" />
					<span className="text-xs text-slate-500">Total Sales</span>
					<span className="ml-auto text-xs font-bold text-slate-900">{sales.value}</span>
				</div>
			)}
			{revenue && (
				<div className="mt-1 flex items-center gap-2">
					<div className="h-2 w-2 rounded-full bg-blue-600" />
					<span className="text-xs text-slate-500">Total Revenue</span>
					<span className="ml-auto text-xs font-bold text-slate-900">{shortNum(revenue.value)}</span>
				</div>
			)}
		</div>
	);
}

export function AgentPerformanceChart() {
	const [period, setPeriod] = useState<"week" | "month">("week");
	const data = period === "week" ? weekData : monthData;
	const activeIndex = period === "week" ? 3 : 9;

	return (
		<div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
			<div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
				<div>
					<h2 className="text-base font-black tracking-[-0.03em] text-slate-900">
						Performance Overview
					</h2>
					<p className="mt-0.5 text-xs text-slate-400">Sales and revenue trends</p>
				</div>
				<button
					onClick={() => setPeriod(period === "week" ? "month" : "week")}
					className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
				>
					{period === "week" ? "This Week" : "This Month"}
					<ChevronDown className="h-3.5 w-3.5" />
				</button>
			</div>

			<div className="px-4 pb-6 pt-5">
				<ResponsiveContainer width="100%" height={220}>
					<BarChart data={data} barSize={28} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
						<defs>
							<linearGradient id="perfBarActive" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
								<stop offset="100%" stopColor="#60a5fa" stopOpacity={0.85} />
							</linearGradient>
							<linearGradient id="perfBarIdle" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#e2e8f0" stopOpacity={1} />
								<stop offset="100%" stopColor="#f1f5f9" stopOpacity={1} />
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
						<XAxis
							dataKey="month"
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
							dy={8}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
							width={36}
						/>
						<Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(15,23,42,0.03)", radius: 6 }} />
						<Bar dataKey="sales" radius={[6, 6, 0, 0]}>
							{data.map((_, index) => (
								<Cell
									key={index}
									fill={index === activeIndex ? "url(#perfBarActive)" : "url(#perfBarIdle)"}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
