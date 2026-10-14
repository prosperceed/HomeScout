"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MoreHorizontal, TrendingUp } from "lucide-react";

const data = [
	{ name: "Closed", value: 70.8 },
	{ name: "Pending", value: 29.2 },
];

const COLORS = ["#2563eb", "#e2e8f0"];
const GRADIENT_IDS = ["dealGradA", "dealGradB"];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
	if (!active || !payload?.length) return null;
	return (
		<div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg text-xs font-semibold text-slate-700">
			{payload[0].name}: {payload[0].value}%
		</div>
	);
}

export function AgentDealGrowthChart() {
	return (
		<div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
			<div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
				<h2 className="text-base font-black tracking-[-0.03em] text-slate-900">
					Sales Overview
				</h2>
				<button
					aria-label="More options"
					className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
				>
					<MoreHorizontal className="h-4 w-4" />
				</button>
			</div>

			<div className="flex flex-col items-center px-6 py-4">
				<div className="relative h-[160px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<defs>
								<linearGradient id={GRADIENT_IDS[0]} x1="0" y1="0" x2="1" y2="1">
									<stop offset="0%" stopColor="#1d4ed8" />
									<stop offset="50%" stopColor="#2563eb" />
									<stop offset="100%" stopColor="#60a5fa" />
								</linearGradient>
								<linearGradient id={GRADIENT_IDS[1]} x1="0" y1="0" x2="1" y2="1">
									<stop offset="0%" stopColor="#e2e8f0" />
									<stop offset="100%" stopColor="#f1f5f9" />
								</linearGradient>
							</defs>
							<Pie
								data={data}
								cx="50%"
								cy="90%"
								startAngle={180}
								endAngle={0}
								innerRadius={80}
								outerRadius={110}
								paddingAngle={2}
								dataKey="value"
								stroke="none"
							>
								{data.map((_, index) => (
									<Cell
										key={index}
										fill={`url(#${GRADIENT_IDS[index]})`}
									/>
								))}
							</Pie>
							<Tooltip content={<CustomTooltip />} />
						</PieChart>
					</ResponsiveContainer>
					<div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
						<span className="text-3xl font-black tracking-[-0.05em] text-slate-900">70.8%</span>
						<span className="text-xs font-semibold text-slate-400">Sales Growth</span>
					</div>
				</div>

				<div className="mt-5 grid w-full grid-cols-2 gap-3 border-t border-slate-100 pt-4">
					<div>
						<p className="text-xs font-semibold text-slate-400">Number of Sales</p>
						<div className="mt-1 flex items-center gap-1.5">
							<span className="text-lg font-black text-slate-900">2,343</span>
							<span className="flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
								<TrendingUp className="h-3 w-3" /> 5.1%
							</span>
						</div>
					</div>
					<div>
						<p className="text-xs font-semibold text-slate-400">Total Revenue</p>
						<div className="mt-1 flex items-center gap-1.5">
							<span className="text-lg font-black text-slate-900">₦30.9k</span>
							<span className="flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
								<TrendingUp className="h-3 w-3" /> 4.5%
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
