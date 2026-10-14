import { Compass, Home, MapPin, ShieldCheck } from "lucide-react";

const cards = [
	{
		title: "Stop getting scammed",
		body: "Every listing is owner-verified. You see the real address, real photos, and chat directly before you pay anything.",
		icon: ShieldCheck,
		accent: "bg-teal-400",
	},
	{
		title: "List in minutes",
		body: "Landlords list existing properties directly. No third-party skimming fees. List at your terms.",
		icon: Home,
		accent: "bg-coral-500",
	},
	{
		title: "Find from anywhere",
		body: "Students, workers, families, search verified rentals across Nigeria from your phone.",
		icon: MapPin,
		accent: "bg-sage-400",
	},
	{
		title: "Agents built in",
		body: "Licensed agents manage multiple listings with full analytics, custom fees, and client messaging in one dashboard.",
		icon: Compass,
		accent: "bg-teal-400",
	},
];

export default function TrustSection() {
	return (
		<section id="about" className="bg-white py-20 md:py-28">
			<div className="container-shell">
				<div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
					<div>
						<p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-500">
							Why HomeScout
						</p>
						<h2 className="text-4xl font-black leading-[1.08] tracking-[-0.04em] text-slate-900 md:text-5xl">
							Built to end the
							<br />
							<span className="text-teal-500">housing stress.</span>
						</h2>
					</div>
					<p className="max-w-lg text-base leading-relaxed text-slate-500 lg:text-lg">
						Finding an apartment shouldn&apos;t feel like a gamble. We built
						HomeScout to take the risk, the middlemen, and the confusion out of
						every transaction.
					</p>
				</div>

				<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
					{cards.map(({ title, body, icon: Icon, accent }) => (
						<div
							key={title}
							className="group rounded-2xl border border-slate-100 bg-slate-50 p-6 transition hover:border-slate-200 hover:shadow-[0_8px_28px_rgba(15,23,42,0.06)]"
						>
							<div
								className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${accent} text-white`}
							>
								<Icon className="h-5 w-5" />
							</div>
							<h3 className="text-lg font-bold text-slate-900">{title}</h3>
							<p className="mt-3 text-sm leading-relaxed text-slate-500">
								{body}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
