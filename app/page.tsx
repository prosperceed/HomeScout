"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustSection from "@/components/landing/TrustSection";
import PropertyCardsSection from "@/components/landing/PropertyCardsSection";
import EcosystemSection from "@/components/landing/EcosystemSection";
import CtaBanner from "@/components/landing/CtaBanner";

export default function HomePage() {
	const [year, setYear] = useState(2026);

	useEffect(() => {
		setYear(new Date().getFullYear());
	}, []);

	return (
		<div className="min-h-screen bg-[#f6f5f3] text-slate-900">
			<Navbar />

			<main>
				<HeroSection />
				{/* <div className="bg-[#f6f5f3] pt-16" /> */}
				<TrustSection />
				<PropertyCardsSection />
				<EcosystemSection />
				<CtaBanner />
			</main>

			<footer
				id="contact"
				className="border-t border-white/5 bg-slate-950 text-slate-400"
			>
				<div className="container-shell py-12">
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr]">
						<div>
							<Link href="/" className="flex items-center gap-2.5">
								<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-black text-white">
									H
								</span>
								<span className="text-lg font-extrabold tracking-tight text-white">
									HomeScout
								</span>
							</Link>
							<p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
								Verified homes. Direct connections. No exploitation. HomeScout
								makes finding a home in Nigeria simple and safe.
							</p>
						</div>

						<div>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
								Platform
							</h3>
							<ul className="space-y-3 text-sm">
								<li>
									<Link href="/explore" className="transition hover:text-white">
										Properties
									</Link>
								</li>
								<li>
									<Link href="/#about" className="transition hover:text-white">
										Why us
									</Link>
								</li>
								<li>
									<Link
										href="/register"
										className="transition hover:text-white"
									>
										Create account
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
								For you
							</h3>
							<ul className="space-y-3 text-sm">
								<li>
									<Link
										href="/register?role=client"
										className="transition hover:text-white"
									>
										Find a home
									</Link>
								</li>
								<li>
									<Link
										href="/register?role=landlord"
										className="transition hover:text-white"
									>
										List a property
									</Link>
								</li>
								<li>
									<Link
										href="/register?role=agent"
										className="transition hover:text-white"
									>
										Join as agent
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
								Contact
							</h3>
							<ul className="space-y-3 text-sm">
								<li>
									<a
										href="mailto:hello@homescout.com"
										className="transition hover:text-white"
									>
										hello@homescout.com
									</a>
								</li>
								<li>
									<a
										href="tel:+2348012345678"
										className="transition hover:text-white"
									>
										+234 801 234 5678
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-slate-600">
						© {year} HomeScout. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}
