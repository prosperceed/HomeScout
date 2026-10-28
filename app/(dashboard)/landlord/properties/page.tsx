import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLandlordProperties } from "@/lib/supabase/queries";
import { LandlordListingsTable } from "@/components/landlord/LandlordListingsTable";

async function LandlordPropertiesContent() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const properties = await getLandlordProperties(user.id);

	return (
		<div className="space-y-6">
			<div>
				<p className="text-xs font-bold uppercase tracking-widest text-slate-400">
					Properties
				</p>
				<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">
					Property Listings
				</h1>
				<p className="mt-0.5 text-sm text-slate-500">
					Manage and monitor all properties registered to your account
				</p>
			</div>

			<LandlordListingsTable properties={properties} />
		</div>
	);
}

export default function LandlordPropertiesPage() {
	return (
		<Suspense>
			<LandlordPropertiesContent />
		</Suspense>
	);
}
