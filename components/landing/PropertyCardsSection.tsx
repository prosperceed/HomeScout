import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const cards = [
	{
		title: "Cedar Grove Residence",
		location: "Lekki Phase 1, Lagos",
		price: "₦1.8M / yr",
		type: "Villa",
		tag: "for_sale",
		image: "/assets/house1.jpeg",
	},
	{
		title: "Harbor Point Lodge",
		location: "Wuse, Abuja",
		price: "₦420K / yr",
		type: "Apartment",
		tag: "for_rent",
		image: "/assets/house2.jpeg",
	},
	{
		title: "Summit Terrace",
		location: "GRA, Port Harcourt",
		price: "₦2.4M / yr",
		type: "Luxury Villa",
		tag: "shortlet",
		image: "/assets/house3.jpeg",
	},
];

const tagConfig: Record<string, { label: string; dot: string; pill: string }> = {
	for_sale: {
		label: "For Sale",
		dot:  "bg-emerald-500",
		pill: "bg-emerald-500/90 text-white",
	},
	for_rent: {
		label: "For Rent",
		dot:  "bg-blue-500",
		pill: "bg-blue-500/90 text-white",
	},
	shortlet: {
		label: "Shortlet",
		dot:  "bg-violet-500",
		pill: "bg-violet-500/90 text-white",
	},
};

const tabs = ["All", "Apartment", "Duplex", "Self-contain", "Lodge"];

export default function PropertyCardsSection() {
	return (
		<section id="properties" className="bg-[#f6f5f3] py-20 md:py-28">
			<div className="container-shell">
				<div className="mx-auto mb-10 max-w-2xl text-center">
					<p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage-500">
						Featured listings
					</p>
					<h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-900 md:text-5xl">
						Homes <span className="text-sage-500">worth moving into.</span>
					</h2>
					<p className="mt-4 text-base leading-relaxed text-slate-500 md:text-lg">
						Verified properties across Nigeria. Every listing is
						owner-confirmed, priced honestly, and ready to view.
					</p>
				</div>

				<div className="mb-8 flex flex-wrap justify-center gap-2">
					{tabs.map((tab, i) => (
						<button
							key={tab}
							type="button"
							className={
								i === 0
									? "rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
									: "rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
							}
						>
							{tab}
						</button>
					))}
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{cards.map((card) => {
						const tag = tagConfig[card.tag];
						return (
							<Link
								key={card.title}
								href="/explore"
								className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.09)]"
							>
								<div className="relative h-60 overflow-hidden">
									<Image
										src={card.image}
										alt={card.title}
										fill
										className="object-cover transition duration-500 group-hover:scale-105"
										sizes="(max-width: 768px) 100vw, 33vw"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

									{/* property type badge */}
									<span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-800">
										{card.type}
									</span>

									{/* listing tag badge */}
									{tag && (
										<span
											className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${tag.pill}`}
										>
											<span className={`h-1.5 w-1.5 rounded-full bg-white/80`} />
											{tag.label}
										</span>
									)}
								</div>

								<div className="p-5">
									<div className="flex items-start justify-between gap-3">
										<h3 className="text-lg font-bold text-slate-900">
											{card.title}
										</h3>
										<span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
											Verified
										</span>
									</div>
									<div className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
										<MapPin className="h-3.5 w-3.5" />
										{card.location}
									</div>
									<div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
										<div>
											<p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
												Per year
											</p>
											<p className="mt-1 text-2xl font-black tracking-tight text-slate-900">
												{card.price}
											</p>
										</div>
										<span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
											View <ArrowRight className="h-3.5 w-3.5" />
										</span>
									</div>
								</div>
							</Link>
						);
					})}
				</div>

				<div className="mt-10 text-center">
					<Link
						href="/explore"
						className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
					>
						View all listings <ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</div>
		</section>
	);
}
