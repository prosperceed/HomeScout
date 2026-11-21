"use client";

import { Activity, Building2, CircleDollarSign, LayoutDashboard, LifeBuoy, LogOut, MessageSquareWarning, Users, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export type AdminSection = "overview" | "users" | "listings" | "transactions" | "support";
const items: Array<{ id: AdminSection; label: string; icon: LucideIcon }> = [
	{ id: "overview", label: "Overview", icon: LayoutDashboard },
	{ id: "users", label: "People & roles", icon: Users },
	{ id: "listings", label: "Listings", icon: Building2 },
	{ id: "transactions", label: "Transactions", icon: CircleDollarSign },
	{ id: "support", label: "Support & complaints", icon: MessageSquareWarning },
];

export function AdminSidebar({ active, onSelect, onLogout }: { active: AdminSection; onSelect: (section: AdminSection) => void; onLogout: () => void }) {
	return <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] flex-col border-r border-slate-200 bg-white lg:flex"><div className="flex h-[82px] shrink-0 items-center border-b border-slate-100 px-6"><Logo variant="light" size="md" /></div><div className="flex-1 overflow-y-auto px-5 pt-7"><p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Operations</p><nav className="mt-3 space-y-1">{items.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onSelect(id)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active === id ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}><Icon className={`h-[17px] w-[17px] ${active === id ? "text-sage-300" : "text-slate-400 group-hover:text-slate-700"}`} />{label}</button>)}</nav></div><div className="shrink-0 border-t border-slate-100 p-5"><div className="mb-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500"><Activity className="h-4 w-4 text-sage-600" /><span>Systems operational</span></div><button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900"><LogOut className="h-4 w-4" />Sign out</button></div></aside>;
}
