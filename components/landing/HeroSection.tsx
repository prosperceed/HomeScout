import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import NetworkSVG from "./NetworkSVG";

export default function HeroSection() {
	return (
		<section className="relative overflow-hidden bg-[#0c1220] pt-[72px]">
			<div className="absolute inset-0">
				<Image
					src="/assets/house2.jpeg"
					alt="Nigerian property exterior"
					fill
					priority
					className="object-cover opacity-50"
					sizes="100vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/60 to-[#33a674]/40" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgb(15, 23, 42),transparent)]" />
			</div>

			<div className="relative container-shell pt-16 pb-0 lg:pt-20">
				<div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-12">
					<div className="max-w-xl pb-10 lg:pb-16">
						<h1 className="text-5xl font-black leading-[1.04] tracking-[-0.04em] text-white sm:text-6xl xl:text-[4.5rem]">
							Your home is
							<br />
							one search away.
						</h1>

						<p className="mt-6 max-w-md text-lg leading-relaxed text-slate-300">
							HomeScout connects house hunters, landlords, and agents across
							Nigeria directly, safely, and without the runaround.
						</p>

						<div className="mt-8 flex flex-wrap gap-3">
							{/* <Link
								href="/register"
								className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700"
							>
								Find your home <ArrowRight className="h-4 w-4" />
							</Link>
							<Link
								href="/explore"
								className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
							>
								Browse listings
							</Link> */}
						</div>
					</div>

					<div className="relative hidden h-[400px] lg:flex lg:items-center lg:justify-center">
						<NetworkSVG />
					</div>
				</div>

				<div
					className="relative z-50 -mb-1 rounded-md border border-slate-200/50 p-3 sm:p-4"
					style={{ background: "rgba(255,255,255,0.97)" }}
				>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
						<div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
							<label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
								State / City
							</label>
							<select
								defaultValue=""
								className="w-full appearance-none bg-transparent text-sm text-slate-700 focus:outline-none"
							>
								<option value="">Any location</option>
								<option>Lagos</option>
								<option>Abuja</option>
								<option>Port Harcourt</option>
								<option>Ibadan</option>
								<option>Kano</option>
								<option>Enugu</option>
							</select>
						</div>

						<div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
							<label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
								Property type
							</label>
							<select
								defaultValue=""
								className="w-full appearance-none bg-transparent text-sm text-slate-700 focus:outline-none"
							>
								<option value="">Any type</option>
								<option>Self-contain</option>
								<option>Flat / Apartment</option>
								<option>Duplex</option>
								<option>Bungalow</option>
								<option>Student lodge</option>
							</select>
						</div>

						<div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
							<label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
								Budget (Naira)
							</label>
							<select
								defaultValue=""
								className="w-full appearance-none bg-transparent text-sm text-slate-700 focus:outline-none"
							>
								<option value="">Any budget</option>
								<option>₦50K – ₦200K</option>
								<option>₦200K – ₦500K</option>
								<option>₦500K – ₦1M</option>
								<option>₦1M+</option>
							</select>
						</div>

						<div className="flex items-center justify-center">
							<button
								type="button"
								className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
							>
								<Search className="h-4 w-4" /> Search
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
