import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientBookings } from "@/lib/supabase/queries";
import { ClientApplicationsView } from "@/components/client/ClientApplicationsView";

async function ClientApplicationsContent() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const bookings = await getClientBookings(user.id);

	return <ClientApplicationsView bookings={bookings} />;
}

export default function ClientApplicationsPage() {
	return (
		<div className="mx-auto max-w-[1400px]">
			<Suspense
				fallback={
					<div className="space-y-4">
						<div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200" />
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
							))}
						</div>
						<div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
					</div>
				}
			>
				<ClientApplicationsContent />
			</Suspense>
		</div>
	);
}
