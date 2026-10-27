import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLandlordTenants } from "@/lib/supabase/queries";
import { LandlordTenantsTable } from "@/components/landlord/LandlordTenantsTable";

export default async function LandlordTenantsPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const tenants = await getLandlordTenants(user.id);

	return (
		<div className="space-y-6">
			<div>
				<p className="text-xs font-bold uppercase tracking-widest text-slate-400">
					Tenants
				</p>
				<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">
					Tenants & Leases
				</h1>
				<p className="mt-0.5 text-sm text-slate-500">
					Review active tenants, tenant inquiries, and lease agreements
				</p>
			</div>

			<LandlordTenantsTable tenants={tenants} />
		</div>
	);
}
