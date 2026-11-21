import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminDashboardData } from "@/lib/admin-data";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPanelPage() {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) redirect("/login?next=/admin_panel");
	const { data: profile } = await supabase.from("profiles").select("role, full_name, email").eq("id", user.id).single();
	if (profile?.role !== "admin") redirect("/explore");
	return <AdminPanel adminName={profile.full_name} data={await getAdminDashboardData()} />;
}
