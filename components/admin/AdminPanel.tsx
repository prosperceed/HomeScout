"use client";

import { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminSidebar, type AdminSection } from "@/components/admin/AdminSidebar";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";
import { AdminListingsManager } from "@/components/admin/AdminListingsManager";
import { AdminTransactionsManager } from "@/components/admin/AdminTransactionsManager";
import { AdminSupportManager } from "@/components/admin/AdminSupportManager";
import type { AdminDashboardData } from "@/lib/admin-data";

const labels: Record<AdminSection, string> = { overview: "Overview", users: "People & roles", listings: "Listings", transactions: "Transactions", support: "Support & complaints" };

export function AdminPanel({ adminName, data }: { adminName: string; data: AdminDashboardData }) {
	const [section, setSection] = useState<AdminSection>("overview");
	const [mobileOpen, setMobileOpen] = useState(false);
	const router = useRouter();
	const logout = async () => { await createClient().auth.signOut(); router.push("/login"); };
	return <div className="min-h-screen bg-[radial-gradient(circle_at_85%_0%,rgba(74,186,138,0.12),transparent_28%),radial-gradient(circle_at_15%_35%,rgba(91,184,207,0.08),transparent_24%),#f1f2f8] text-slate-900"><AdminSidebar active={section} onSelect={(value) => { setSection(value); setMobileOpen(false); }} onLogout={logout} /><div className="lg:pl-[264px]"><header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f1f2f8]/90 px-5 py-5 backdrop-blur sm:px-8"><div className="mx-auto flex max-w-[1460px] items-center justify-between"><button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl border border-slate-200 bg-white p-2 lg:hidden"><Menu className="h-5 w-5" /></button><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">HomeScout operations</p><h1 className="mt-1 text-xl font-black tracking-tight">{labels[section]}</h1></div><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-xs font-bold text-slate-800">{adminName}</p><p className="text-[10px] text-slate-400">Admin account</p></div><button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 lg:hidden"><LogOut className="h-3.5 w-3.5" /> Exit</button></div></div></header>{mobileOpen && <div className="border-b border-slate-200 bg-white p-3 lg:hidden"><div className="grid gap-1">{(Object.keys(labels) as AdminSection[]).map((key) => <button key={key} onClick={() => { setSection(key); setMobileOpen(false); }} className={`rounded-xl px-3 py-2 text-left text-sm font-bold ${section === key ? "bg-slate-950 text-white" : "text-slate-600"}`}>{labels[key]}</button>)}</div></div>}<main className="mx-auto max-w-[1460px] space-y-8 px-5 py-7 leading-relaxed sm:px-8">{section === "overview" && <AdminOverview data={data} />}{section === "users" && <AdminUsersManager users={data.usersList} />}{section === "listings" && <AdminListingsManager listings={data.listingsList} />}{section === "transactions" && <AdminTransactionsManager bookings={data.bookings} />}{section === "support" && <AdminSupportManager tickets={data.tickets} messages={data.messages} />}</main></div></div>;
}
