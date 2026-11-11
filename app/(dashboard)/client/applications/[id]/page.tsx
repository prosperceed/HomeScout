import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBookingById } from "@/lib/supabase/queries";
import { ClientApplicationStageFlow } from "@/components/client/ClientApplicationStageFlow";

interface ClientApplicationDetailPageProps {
	params: Promise<{ id: string }>;
}

async function ApplicationDetailContent({ id }: { id: string }) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const booking = await getBookingById(id);
	if (!booking) {
		notFound();
	}

	// Security check: client must own this booking (or admin)
	if (booking.client_id !== user.id) {
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", user.id)
			.single();

		if (profile?.role !== "admin") {
			notFound();
		}
	}

	return <ClientApplicationStageFlow booking={booking} />;
}

export default async function ClientApplicationDetailPage({
	params,
}: ClientApplicationDetailPageProps) {
	const { id } = await params;

	return (
		<div className="mx-auto max-w-[1400px]">
			<Suspense
				fallback={
					<div className="space-y-4">
						<div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200" />
						<div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
						<div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
					</div>
				}
			>
				<ApplicationDetailContent id={id} />
			</Suspense>
		</div>
	);
}

