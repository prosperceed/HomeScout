"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
	BarChart3,
	Bell,
	Heart,
	HelpCircle,
	LayoutGrid,
	Menu,
	MessageSquare,
	Search,
	Settings,
	UserRound,
	X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/shared/Logo";

const clientNav = [
	{ href: "/client", label: "Overview", icon: LayoutGrid, exact: true },
	{ href: "/client/saved", label: "Saved Homes", icon: Heart },
	{ href: "/client/applications", label: "Applications", icon: BarChart3 },
	{ href: "/client/messages", label: "Messages", icon: MessageSquare },
	{ href: "/client/explore", label: "Explore", icon: Search },
];

const clientNavBottom = [
	{ href: "/client/settings", label: "Settings", icon: Settings },
	{ href: "/client/support", label: "Support", icon: HelpCircle },
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
					? "bg-gradient-to-r from-coral-400 to-coral-500 text-white shadow-[0_2px_12px_rgba(249,93,46,0.3)]"
					: "text-slate-400 hover:bg-white/10 hover:text-white"
			}`}
		>
			<Icon
				className={`h-[18px] w-[18px] shrink-0 ${
					active ? "text-white" : "text-slate-500 group-hover:text-slate-300"
				}`}
			/>
			<span>{label}</span>
		</Link>
	);
}

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
			className={`flex bg-slate-900 ${mobile ? "h-full w-72 flex-col" : "h-full flex-col"}`}
		>
			<div className="flex h-16 shrink-0 items-center justify-center border-b border-white/10 px-5">
				<Link
					href="/client"
					onClick={() => setSidebarOpen(false)}
					className="inline-flex items-center transition-transform hover:scale-105"
					aria-label="HomeScout home"
				>
					<Logo variant="dark" size="sm" />
				</Link>
			</div>

			<nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
				<p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
					Menu
				</p>
				{clientNav.map(({ href, label, icon, exact }) => (
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

			<div className="shrink-0 border-t border-white/10 px-3 py-4 space-y-1">
				{clientNavBottom.map(({ href, label, icon }) => (
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
					className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
				>
					<svg
						className="h-[18px] w-[18px] shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
						/>
					</svg>
					Logout
				</button>
			</div>
		</aside>
	);

	return (
		<div className="flex min-h-screen bg-[#f0ece8]">
			{/* Desktop sidebar */}
			<div className="hidden w-[220px] shrink-0 lg:block">
				<div className="fixed inset-y-0 left-0 w-[220px]">
					<Sidebar />
				</div>
			</div>

			{/* Mobile drawer */}
			{sidebarOpen && (
				<div className="fixed inset-0 z-[60] lg:hidden">
					<div
						className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
						onClick={() => setSidebarOpen(false)}
					/>
					<div className="absolute inset-y-0 left-0 z-10 shadow-xl">
						<Sidebar mobile />
						<button
							onClick={() => setSidebarOpen(false)}
							className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}

			{/* Main */}
			<div className="flex min-w-0 flex-1 flex-col">
				<header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-stone-200/50 bg-[#f0ece8]/90 px-4 backdrop-blur-sm sm:px-8">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setSidebarOpen(true)}
							className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/60 lg:hidden"
							aria-label="Open menu"
						>
							<Menu className="h-5 w-5" />
						</button>
						<p className="hidden text-xs font-semibold text-slate-400 sm:block">
							{clientNav.find((n) => isActive(n.href, n.exact))?.label ??
								clientNavBottom.find((n) => isActive(n.href))?.label ??
								"Dashboard"}
						</p>
					</div>

					<div className="flex items-center gap-2.5">
						<button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-500 ring-1 ring-stone-200/60 transition hover:text-slate-800">
							<Search className="h-4 w-4" />
						</button>
						<button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-500 ring-1 ring-stone-200/60 transition hover:text-slate-800">
							<Bell className="h-4 w-4" />
							<span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral-500 ring-2 ring-[#f0ece8]" />
						</button>
						<div className="hidden items-center gap-2.5 rounded-xl bg-white/80 px-3 py-1.5 ring-1 ring-stone-200/60 sm:flex">
							<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
								<UserRound className="h-4 w-4" />
							</div>
							<span className="text-sm font-semibold text-slate-700">
								My Account
							</span>
						</div>
					</div>
				</header>

				<main className="flex-1 overflow-x-hidden">
					<div className="px-4 py-6 sm:px-8 sm:py-8">{children}</div>
				</main>
			</div>
		</div>
	);
}
