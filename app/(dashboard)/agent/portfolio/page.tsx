"use client";

import { Building2, MapPin, Bed, Bath, TrendingUp } from "lucide-react";
import Image from "next/image";

const properties = [
	{ id: "1", title: "3-Bed Apartment, Lekki Phase 1", type: "Family Apartment", price: "₦1,200,000/yr", location: "Lekki, Lagos", bedrooms: 3, bathrooms: 2, status: "available", image: "/assets/house1.jpeg" },
	{ id: "2", title: "4-Bed Duplex, Ikoyi", type: "Duplex", price: "₦3,600,000/yr", location: "Ikoyi, Lagos", bedrooms: 4, bathrooms: 3, status: "rented", image: "/assets/house2.jpeg" },
	{ id: "3", title: "Studio Flat, Victoria Island", type: "Shared Flat", price: "₦480,000/yr", location: "VI, Lagos", bedrooms: 1, bathrooms: 1, status: "available", image: "/assets/house3.jpeg" },
	{ id: "4", title: "Villa, Banana Island", type: "Villa", price: "₦8,400,000/yr", location: "Banana Island, Lagos", bedrooms: 5, bathrooms: 4, status: "under_review", image: "/assets/house4.jpeg" },
];

const statusMap: Record<string, { label: string; classes: string }> = {
	available: { label: "Available", classes: "bg-green-500 text-white" },
	rented: { label: "Rented", classes: "bg-blue-500 text-white" },
	under_review: { label: "Under Review", classes: "bg-amber-500 text-white" },
};

export default function AgentPortfolioPage() {
	return (
		<div className="mx-auto max-w-[1400px] space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs font-bold uppercase tracking-widest text-slate-400">Portfolio</p>
					<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">My Properties</h1>
					<p className="mt-0.5 text-sm text-slate-400">All properties you are currently managing</p>
				</div>
				<button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 text-sm font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
					<Building2 className="h-4 w-4" />
					Add Property
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{[
					{ label: "Total Properties", value: "27", change: "+17.4%" },
					{ label: "Available", value: "18", change: "+5%" },
					{ label: "Portfolio Value", value: "₦42.6M", change: "+9.2%" },
				].map((s) => (
					<div key={s.label} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
						<p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{s.label}</p>
						<div className="mt-2 flex items-end justify-between">
							<span className="text-3xl font-black tracking-[-0.04em] text-slate-900">{s.value}</span>
							<span className="flex items-center gap-0.5 text-xs font-bold text-green-600">
								<TrendingUp className="h-3.5 w-3.5" />{s.change}
							</span>
						</div>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
				{properties.map((p) => {
					const s = statusMap[p.status];
					return (
						<div key={p.id} className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)] transition hover:shadow-[0_8px_32px_rgba(15,23,42,0.12)]">
							<div className="relative h-44 overflow-hidden bg-slate-100">
								<Image
									src={p.image}
									alt={p.title}
									fill
									className="object-cover transition duration-300 group-hover:scale-105"
								/>
								<span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${s.classes}`}>
									{s.label}
								</span>
							</div>
							<div className="p-4">
								<p className="text-xs font-semibold text-slate-400">{p.type}</p>
								<h3 className="mt-1 text-sm font-black text-slate-900 leading-tight">{p.title}</h3>
								<div className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
									<MapPin className="h-3 w-3" />
									{p.location}
								</div>
								<div className="mt-3 flex items-center justify-between">
									<div className="flex items-center gap-3">
										<span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
											<Bed className="h-3.5 w-3.5" />{p.bedrooms}
										</span>
										<span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
											<Bath className="h-3.5 w-3.5" />{p.bathrooms}
										</span>
									</div>
									<span className="text-sm font-black text-blue-700">{p.price}</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
