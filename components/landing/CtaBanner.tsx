import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
	return (
		<section
			className="py-20 md:py-24"
			style={{
				background:
					"linear-gradient(135deg, #0f172a 0%, #1a0f3a 50%, #0c1220 100%)",
			}}
		>
			<div className="container-shell text-center">
				<h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-white md:text-5xl">
					Stop searching.
					<br />
					<span
						style={{
							background:
								"linear-gradient(135deg, #b49dff 0%, #7c5cf6 60%, #f95d2e 100%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
						}}
					>
						Start moving.
					</span>
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
					Join HomeScout — where every listing is real, every owner is
					reachable, and finding a home doesn&apos;t have to cost you your peace
					of mind.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<Link
						href="/register"
						className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
					>
						Create free account <ArrowRight className="h-4 w-4" />
					</Link>
					<Link
						href="/explore"
						className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
					>
						Browse listings
					</Link>
				</div>
			</div>
		</section>
	);
}
