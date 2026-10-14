"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
	BarChart3,
	Bell,
	Briefcase,
	Building2,
	CheckCircle2,
	HelpCircle,
	LayoutGrid,
	Menu,
	MessageSquare,
	PieChart,
	Search,
	Settings,
	Users,
	UserRound,
	X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navMain = [
	{ href: "/agent", label: "Dashboard", icon: LayoutGrid, exact: true },
	{ href: "/agent/clients", label: "Clients", icon: Users },
	{ href: "/agent/deals", label: "Deals", icon: Briefcase },
	{ href: "/agent/properties", label: "Properties", icon: Building2 },
	{ href: "/agent/messages", label: "Messages", icon: MessageSquare },
	{ href: "/agent/portfolio", label: "Portfolio", icon: PieChart },
	{ href: "/agent/closed", label: "Closed", icon: CheckCircle2 },
	{ href: "/agent/analytics", label: "Analytics", icon: BarChart3 },
];

const navBottom = [
	{ href: "/agent/settings", label: "Settings", icon: Settings },
];

function SidebarLink({
	href,
	label,
	icon: Icon,
	active,
	onClick,
}: {
	href: string;
	label: string;
	icon: React.ElementType;
	active: boolean;
	onClick?: () => void;
}) {
	return (
		<Link
			href={href}
			onClick={onClick}
			className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
				active
					? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_2px_12px_rgba(37,99,235,0.3)]"
					: "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
			}`}
		>
			<Icon
				className={`h-[18px] w-[18px] shrink-0 transition-colors ${
					active ? "text-white" : "text-slate-400 group-hover:text-slate-700"
				}`}
			/>
			<span>{label}</span>
		</Link>
	);
}

export default function AgentLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const isActive = (href: string, exact?: boolean) =>
		exact ? pathname === href : pathname.startsWith(href);

	const handleLogout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/login");
	};

	const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
		<aside
			className={
				mobile
					? "flex h-full w-72 flex-col bg-white"
					: "flex h-full flex-col bg-white"
			}
		>
			<div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 px-5">
				<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-black text-white shadow-[0_2px_10px_rgba(59,130,246,0.4)]">
					H
				</div>
				<span className="text-sm font-black tracking-tight text-slate-900">
					HomeScout
				</span>
			</div>

			<nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
				<p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
					Main
				</p>
				{navMain.map(({ href, label, icon, exact }) => (
					<SidebarLink
						key={href}
						href={href}
						label={label}
						icon={icon}
						active={isActive(href, exact)}
						onClick={() => setSidebarOpen(false)}
					/>
				))}
			</nav>

			<div className="shrink-0 border-t border-slate-100 px-3 py-4 space-y-1">
				<p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
					Account
				</p>
				{navBottom.map(({ href, label, icon }) => (
					<SidebarLink
						key={href}
						href={href}
						label={label}
						icon={icon}
						active={isActive(href)}
						onClick={() => setSidebarOpen(false)}
					/>
				))}
				<button
					onClick={handleLogout}
					className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600"
				>
					<svg className="h-[18px] w-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
					</svg>
					Logout
				</button>

				<div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white">
						<UserRound className="h-5 w-5" />
					</div>
					<div className="min-w-0">
						<p className="truncate text-sm font-bold text-slate-800">Agent</p>
						<p className="truncate text-xs text-slate-400">agent@homescout.ng</p>
					</div>
				</div>
			</div>
		</aside>
	);

	return (
		<div className="flex min-h-screen bg-slate-50">
			{/* ── Desktop Sidebar ── */}
			<div className="hidden w-60 shrink-0 lg:block">
				<div className="fixed inset-y-0 left-0 w-60 border-r border-slate-200/80 shadow-[1px_0_20px_rgba(15,23,42,0.04)]">
					<Sidebar />
				</div>
			</div>

			{/* ── Mobile Sidebar Drawer ── */}
			{sidebarOpen && (
				<div className="fixed inset-0 z-[60] lg:hidden">
					<div
						className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
						onClick={() => setSidebarOpen(false)}
					/>
					<div className="absolute inset-y-0 left-0 z-10 shadow-xl">
						<Sidebar mobile />
						<button
							onClick={() => setSidebarOpen(false)}
							className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}

			{/* ── Main Area ── */}
			<div className="flex min-w-0 flex-1 flex-col">
				{/* Top bar */}
				<header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md shadow-[0_1px_12px_rgba(15,23,42,0.04)] sm:px-6">
					<div className="flex items-center gap-3">
						{/* Mobile hamburger */}
						<button
							onClick={() => setSidebarOpen(true)}
							className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 lg:hidden"
							aria-label="Open menu"
						>
							<Menu className="h-5 w-5" />
						</button>

						{/* Page title derived from pathname */}
						<div className="hidden sm:block">
							<p className="text-xs font-semibold text-slate-400">
								{navMain.find((n) => isActive(n.href, n.exact))?.label ??
									navBottom.find((n) => isActive(n.href))?.label ??
									"Agent Dashboard"}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<button
							aria-label="Search"
							className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
						>
							<Search className="h-4 w-4" />
						</button>
						<button
							aria-label="Notifications"
							className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
						>
							<Bell className="h-4 w-4" />
							<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
						</button>
						<div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
							<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
								<UserRound className="h-4 w-4" />
							</div>
							<span className="text-sm font-semibold text-slate-700">Agent</span>
						</div>
					</div>
				</header>

				{/* Page content */}
				<main className="flex-1 overflow-x-hidden">
					<div className="mx-auto px-4 py-6 sm:px-6 sm:py-8">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
