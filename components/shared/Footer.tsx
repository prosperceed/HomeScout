import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const columns = [
	{
		title: "Platform",
		links: [
			{ label: "Explore homes", href: "/explore" },
			{ label: "How it works", href: "/#about" },
			{ label: "Pricing", href: "/#contact" },
		],
	},
	{
		title: "For you",
		links: [
			{ label: "Tenant sign up", href: "/register?role=client" },
			{ label: "Landlord sign up", href: "/register?role=landlord" },
			{ label: "Agent sign up", href: "/register?role=agent" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About us", href: "/#about" },
			{ label: "Careers", href: "/#contact" },
			{ label: "Contact", href: "/#contact" },
		],
	},
];

export default function Footer() {
	return (
		<footer className="bg-slate-950 text-slate-300">
			<div className="container-shell py-16">
				<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
					<div>
						<Link
							href="/"
							className="flex items-center gap-2 font-black tracking-tight text-white"
						>
							<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-300 text-white shadow-lg shadow-brand-500/20">
								<MapPin className="h-4 w-4" />
							</span>
							<span className="text-xl">HomeScout</span>
						</Link>
						<p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
							Discover verified spaces, trusted landlords, and clear pricing
							from the first search to the final handover.
						</p>
						<div className="mt-6 space-y-3 text-sm text-slate-400">
							<a
								href="mailto:hello@drimhome.com"
								className="flex items-center gap-2 hover:text-white"
							>
								<Mail className="h-4 w-4" />
								hello@drimhome.com
							</a>
							<a
								href="tel:+2348012345678"
								className="flex items-center gap-2 hover:text-white"
							>
								<Phone className="h-4 w-4" />
								+234 801 234 5678
							</a>
						</div>
					</div>

					{columns.map((column) => (
						<div key={column.title}>
							<h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
								{column.title}
							</h3>
							<ul className="space-y-3 text-sm text-slate-400">
								{column.links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className="transition-colors hover:text-white"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			<div className="border-t border-slate-800">
				<div className="container-shell flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-500 md:flex-row">
					<p>© {new Date().getFullYear()} HomeScout. All rights reserved.</p>
					<p>Built for transparent property journeys across Nigeria.</p>
				</div>
			</div>
		</footer>
	);
}
