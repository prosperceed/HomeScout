import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSavedProperties } from "@/lib/supabase/queries";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Heart, Search } from "lucide-react";

async function SavedHomesContent() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login?next=/client/saved");

	const properties = await getSavedProperties(user.id);

	return (
		<div className="space-y-6">
			<header>
				<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
					Shortlist
				</p>
				<h1 className="mt-1.5 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-4xl">
					Saved Homes
				</h1>
				<p className="mt-1 text-sm text-slate-500">
					Keep track of homes you love and compare them before booking viewings.
				</p>
			</header>

			{properties.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-20 text-center shadow-sm">
					<div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-coral-50 text-coral-500 ring-1 ring-coral-100">
						<Heart className="h-7 w-7" />
					</div>
					<h2 className="text-lg font-bold text-slate-900">
						No saved properties yet
					</h2>
					<p className="mt-1 max-w-sm text-sm text-slate-500">
						When exploring homes, click the bookmark icon to save them to your
						personal wishlist.
					</p>
					<Link
						href="/explore"
						className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700"
					>
						<Search className="h-4 w-4" />
						Explore listings
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{properties.map((p) => (
						<PropertyCard key={p.id} {...p} isBookmarked={true} />
					))}
				</div>
			)}
		</div>
	);
}

export default function ClientSavedPage() {
	return (
		<Suspense
			fallback={
				<div className="space-y-6">
					<div className="h-20 w-64 animate-pulse rounded-2xl bg-white/70" />
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="h-80 animate-pulse rounded-2xl bg-white/70 ring-1 ring-stone-200/60"
							/>
						))}
					</div>
				</div>
			}
		>
			<SavedHomesContent />
		</Suspense>
	);
}
