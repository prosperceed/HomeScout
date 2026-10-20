import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

interface Props {
	firstName: string;
}

export function ClientWelcomeHero({ firstName }: Props) {
	return (
		<section className="relative isolate overflow-hidden rounded-[2rem] bg-slate-900 px-5 py-7 text-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.65)] sm:px-8 sm:py-9 lg:px-10">
			{/* Background imagery + glows */}
			<Image
				src="/assets/house1.jpeg"
				alt=""
				fill
				priority
				sizes="(max-width: 1024px) 100vw, 1100px"
				className="-z-20 object-cover opacity-25"
			/>
			<div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40" />
			<div className="pointer-events-none absolute -left-16 -top-24 -z-10 h-64 w-64 rounded-full bg-coral-500/30 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-28 right-10 -z-10 h-72 w-72 rounded-full bg-sage-500/25 blur-3xl" />

			<div className="max-w-xl">
				<h1 className="text-3xl font-black leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-[2.75rem]">
					Welcome back, <span className="text-coral-300">{firstName}</span>.
					<br className="hidden sm:block" /> Let&apos;s find your next home.
				</h1>
				<p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
					Track applications, revisit homes you love and chat with verified
					agents, all in one place.
				</p>

				<div className="mt-6 flex flex-col gap-3 sm:flex-row">
					<Link
						href="/client/saved"
						className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
					>
						<Heart className="h-4 w-4" /> Saved homes
					</Link>
				</div>
			</div>
		</section>
	);
}
