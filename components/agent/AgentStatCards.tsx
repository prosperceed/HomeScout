"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
	label: string;
	value: string;
	subValue: string;
	change: number;
	gradient?: boolean;
	icon: React.ReactNode;
}

function StatCard({ label, value, subValue, change, gradient, icon }: StatCardProps) {
	const isUp = change >= 0;

	return (
		<div
			className={`relative overflow-hidden rounded-2xl p-5 ${
				gradient
					? "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-[0_8px_32px_rgba(37,99,235,0.35)]"
					: "bg-white ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]"
			}`}
		>
			{gradient && (
				<>
					<div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
					<div className="pointer-events-none absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-white/5" />
				</>
			)}

			<div className="flex items-start justify-between">
				<div>
					<p className={`text-xs font-semibold uppercase tracking-widest ${gradient ? "text-blue-100" : "text-slate-400"}`}>
						{label}
					</p>
					<p className={`mt-2 text-3xl font-black tracking-[-0.04em] ${gradient ? "text-white" : "text-slate-900"}`}>
						{value}
					</p>
					<div className="mt-1.5 flex items-center gap-1.5">
						{isUp ? (
							<TrendingUp className={`h-3.5 w-3.5 ${gradient ? "text-green-300" : "text-green-500"}`} />
						) : (
							<TrendingDown className={`h-3.5 w-3.5 ${gradient ? "text-red-300" : "text-red-500"}`} />
						)}
						<span className={`text-xs font-bold ${
							isUp
								? gradient ? "text-green-300" : "text-green-600"
								: gradient ? "text-red-300" : "text-red-500"
						}`}>
							{isUp ? "+" : ""}{change}%
						</span>
						<span className={`text-xs ${gradient ? "text-blue-200" : "text-slate-400"}`}>
							vs last month
						</span>
					</div>
					<p className={`mt-2 text-xs ${gradient ? "text-blue-200" : "text-slate-400"}`}>
						Last month: {subValue}
					</p>
				</div>
				<div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
					gradient ? "bg-white/20" : "bg-slate-100"
				}`}>
					<span className={gradient ? "text-white" : "text-slate-600"}>
						{icon}
					</span>
				</div>
			</div>
		</div>
	);
}

const stats = [
	{
		label: "Total Listings",
		value: "27",
		subValue: "23",
		change: 17.4,
		gradient: true,
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
			</svg>
		),
	},
	{
		label: "Active Clients",
		value: "110",
		subValue: "89",
		change: 7.5,
		gradient: false,
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
			</svg>
		),
	},
	{
		label: "Closed Deals",
		value: "72",
		subValue: "60",
		change: -6.0,
		gradient: false,
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
			</svg>
		),
	},
	{
		label: "Total Revenue",
		value: "₦8.2M",
		subValue: "₦620k",
		change: 4.5,
		gradient: false,
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		),
	},
];

export function AgentStatCards() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{stats.map((s) => (
				<StatCard key={s.label} {...s} />
			))}
		</div>
	);
}
