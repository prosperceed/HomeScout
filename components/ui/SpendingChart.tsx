"use client";

import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SpendingEntry {
	month: string;
	amount: number;
	cumulative: number;
}

// ─── Sample spend data (mocked, replace with real Supabase query) ─────────────

const spendingData: SpendingEntry[] = [
	{ month: "May",  amount: 180_000,  cumulative: 180_000  },
	{ month: "Jun",  amount: 280_000,  cumulative: 460_000  },
	{ month: "Jul",  amount: 0,        cumulative: 460_000  },
	{ month: "Aug",  amount: 550_000,  cumulative: 1_010_000},
	{ month: "Sep",  amount: 8_400_000,cumulative: 9_410_000},
	{ month: "Oct",  amount: 1_800_000,cumulative: 11_210_000},
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shortNaira(n: number) {
	if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000)     return `₦${(n / 1_000).toFixed(0)}k`;
	return `₦${n}`;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
	active,
	payload,
	label,
	mode,
}: {
	active?: boolean;
	payload?: { value: number }[];
	label?: string;
	mode: "bar" | "area";
}) {
	if (!active || !payload?.length) return null;

	const value = payload[0].value;
	const formatted = new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: 0,
	}).format(value);

	return (
		<div className="rounded-2xl border border-stone-200/60 bg-white/95 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur-md">
			<p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
				{label}
			</p>
			<p className="mt-0.5 text-lg font-black tracking-tight text-slate-900">
				{formatted}
			</p>
			<p className="text-[11px] font-semibold text-slate-400">
				{mode === "bar" ? "Spent this period" : "Total cumulative"}
			</p>
		</div>
	);
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

function TabBtn({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			onClick={onClick}
			className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
				active
					? "bg-slate-900 text-white shadow-sm"
					: "text-slate-400 hover:text-slate-700"
			}`}
		>
			{children}
		</button>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SpendingChart() {
	const [mode, setMode] = useState<"bar" | "area">("bar");

	const totalSpent = spendingData[spendingData.length - 1]?.cumulative ?? 0;
	const lastPeriodSpend = spendingData[spendingData.length - 1]?.amount ?? 0;

	return (
		<div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/70 shadow-[0_2px_16px_-6px_rgba(15,23,42,0.08)]">
			{/* ── Header ── */}
			<div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 px-5 py-5 sm:px-6">
				<div>
					<h2 className="text-lg font-black tracking-[-0.03em] text-slate-900">
						Spending Analytics
					</h2>
					<p className="mt-0.5 text-sm text-slate-500">
						Your property spend over time
					</p>
				</div>

				{/* KPI pills */}
				<div className="flex flex-wrap items-center gap-3">
					<div className="flex flex-col rounded-2xl bg-[#fff4f0] px-4 py-2">
						<span className="text-[10px] font-bold uppercase tracking-widest text-coral-500">
							Total Spent
						</span>
						<span className="text-lg font-black tracking-tight text-slate-900">
							{shortNaira(totalSpent)}
						</span>
					</div>
					<div className="flex flex-col rounded-2xl bg-[#edf8f3] px-4 py-2">
						<span className="text-[10px] font-bold uppercase tracking-widest text-sage-600">
							Last Period
						</span>
						<span className="text-lg font-black tracking-tight text-slate-900">
							{shortNaira(lastPeriodSpend)}
						</span>
					</div>
				</div>
			</div>

			{/* ── Chart Toggle & Chart ── */}
			<div className="flex-1 px-3 pb-5 pt-5 sm:px-6 sm:pb-6">
				<div className="mb-5 ml-2 flex w-fit items-center gap-1 rounded-2xl bg-stone-100/80 p-1 sm:ml-0">
					<TabBtn active={mode === "bar"} onClick={() => setMode("bar")}>
						Per Period
					</TabBtn>
					<TabBtn active={mode === "area"} onClick={() => setMode("area")}>
						Cumulative
					</TabBtn>
				</div>

				<ResponsiveContainer width="100%" height={240}>
					{mode === "bar" ? (
						<BarChart
							data={spendingData}
							maxBarSize={36}
							margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#f95d2e" stopOpacity={0.95} />
									<stop offset="100%" stopColor="#ff9d7a" stopOpacity={0.7} />
								</linearGradient>
							</defs>
							<CartesianGrid
								vertical={false}
								stroke="#e7e5e4"
								strokeDasharray="3 3"
							/>
							<XAxis
								dataKey="month"
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
								dy={8}
							/>
							<YAxis
								tickFormatter={shortNaira}
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
								width={52}
							/>
							<Tooltip
								content={
									<CustomTooltip mode="bar" />
								}
								cursor={{ fill: "rgba(15,23,42,0.04)", radius: 8 }}
							/>
							<Bar
								dataKey="amount"
								fill="url(#barGradient)"
								radius={[8, 8, 0, 0]}
							/>
						</BarChart>
					) : (
						<AreaChart
							data={spendingData}
							margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%"   stopColor="#33a674" stopOpacity={0.3} />
									<stop offset="100%" stopColor="#33a674" stopOpacity={0.02} />
								</linearGradient>
							</defs>
							<CartesianGrid
								vertical={false}
								stroke="#e7e5e4"
								strokeDasharray="3 3"
							/>
							<XAxis
								dataKey="month"
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
								dy={8}
							/>
							<YAxis
								tickFormatter={shortNaira}
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
								width={52}
							/>
							<Tooltip
								content={
									<CustomTooltip mode="area" />
								}
								cursor={{ stroke: "#334155", strokeWidth: 1.5 }}
							/>
							<Area
								type="monotone"
								dataKey="cumulative"
								stroke="#33a674"
								strokeWidth={2.5}
								fill="url(#areaGradient)"
								dot={{ fill: "#33a674", r: 4, strokeWidth: 2, stroke: "#fff" }}
								activeDot={{ r: 6, fill: "#33a674", stroke: "#fff", strokeWidth: 2 }}
							/>
						</AreaChart>
					)}
				</ResponsiveContainer>
			</div>
		</div>
	);
}
