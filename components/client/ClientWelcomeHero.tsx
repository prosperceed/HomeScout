import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

interface Props {
	firstName: string;
}

export function ClientWelcomeHero({ firstName }: Props) {
	return (
		<section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 px-5 py-6 text-white sm:px-8 sm:py-8 lg:px-10">
			<Image
				src="/assets/house1.jpeg"
				alt=""
				fill
				priority
				sizes="(max-width: 1024px) 100vw, 1100px"
				className="pointer-events-none object-cover opacity-20"
			/>
			<div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/60" />

			<div className="relative max-w-xl">
				<p className="text-xs font-semibold uppercase tracking-widest text-sage-400">
					Overview
				</p>
				<h1 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl leading-snug">
					Welcome back, <span className="text-coral-300">{firstName}</span>.
				</h1>
				<p className="mt-2 sm:mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-slate-300">
					Track your applications, revisit saved listings, and contact verified
					agents directly.
				</p>

				<div className="mt-5 sm:mt-6 flex items-center gap-3">
					<Link
						href="/client/saved"
						className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
					>
						<Heart className="h-4 w-4 text-coral-500 fill-coral-500" />
						Saved homes
					</Link>
					<Link
						href="/explore"
						className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-white/10"
					>
						Explore listings
					</Link>
				</div>
			</div>
		</section>
	);
}
