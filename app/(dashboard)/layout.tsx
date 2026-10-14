"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	BarChart3,
	Bell,
	Heart,
	HelpCircle,
	LayoutGrid,
	LogOut,
	MessageSquare,
	Search,
	Settings,
	UserRound,
} from "lucide-react";

const clientNav = [
	{ href: "/client", label: "Overview", icon: LayoutGrid },
	{ href: "/client/saved", label: "Saved Homes", icon: Heart },
	{ href: "/client/applications", label: "Applications", icon: BarChart3 },
	{ href: "/client/messages", label: "Messages", icon: MessageSquare },
	{ href: "/client/explore", label: "Explore", icon: Search },
];

const clientNavBottom = [
	{ href: "/client/settings", label: "Settings", icon: Settings },
	{ href: "/client/support", label: "Support", icon: HelpCircle },
];

function NavIcon({
	href,
	label,
	icon: Icon,
	active,
}: {
	href: string;
	label: string;
	icon: React.ElementType;
	active: boolean;
}) {
	return (
		<Link
			href={href}
			title={label}
			className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
				active
					? "bg-white/20 text-white shadow-[0_2px_16px_rgba(255,255,255,0.15)] ring-1 ring-white/30 backdrop-blur-md"
					: "text-slate-400 hover:bg-white/10 hover:text-white hover:backdrop-blur-sm hover:ring-1 hover:ring-white/20"
			}`}
		>
			<Icon className="h-5 w-5" />
			<span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
				{label}
			</span>
		</Link>
	);
}

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const isActive = (href: string) => {
		if (href === "/client") return pathname === "/client";
		return pathname.startsWith(href);
	};

	return (
		<div className="min-h-screen bg-[#f0ece8] text-slate-900">
			<aside className="fixed inset-y-0 left-0 z-40 flex w-[72px] flex-col items-center gap-0 bg-slate-900 py-6">
				<Link
					href="/"
					className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-coral-400 to-coral-600 text-lg font-black text-white shadow-[0_4px_20px_rgba(249,93,46,0.45)] transition-transform duration-200 hover:scale-105"
				>
					H
				</Link>

				<nav className="flex flex-1 flex-col items-center gap-2">
					{clientNav.map(({ href, label, icon }) => (
						<NavIcon
							key={href}
							href={href}
							label={label}
							icon={icon}
							active={isActive(href)}
						/>
					))}
				</nav>

				<nav className="flex flex-col items-center gap-2">
					{clientNavBottom.map(({ href, label, icon }) => (
						<NavIcon
							key={href}
							href={href}
							label={label}
							icon={icon}
							active={isActive(href)}
						/>
					))}
					<button
						title="Sign out"
						className="group relative flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-coral-400 hover:backdrop-blur-sm hover:ring-1 hover:ring-white/20"
					>
						<LogOut className="h-5 w-5" />
						<span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
							Sign out
						</span>
					</button>
				</nav>
			</aside>

			<div className="ml-[72px] flex min-h-screen flex-col">
				<header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200/50 bg-[#f0ece8]/90 px-8 backdrop-blur-sm">
					<div />
					<div className="flex items-center gap-3">
						<button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-500 shadow-sm ring-1 ring-stone-200/60 transition-colors hover:text-slate-800">
							<Search className="h-4 w-4" />
						</button>
						<button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-500 shadow-sm ring-1 ring-stone-200/60 transition-colors hover:text-slate-800">
							<Bell className="h-4 w-4" />
							<span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral-500 ring-2 ring-[#f0ece8]" />
						</button>
						<div className="flex items-center gap-2.5 rounded-xl bg-white/80 px-3 py-1.5 shadow-sm ring-1 ring-stone-200/60">
							<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-black text-white">
								<UserRound className="h-4 w-4" />
							</div>
							<span className="text-sm font-semibold text-slate-700">My Account</span>
						</div>
					</div>
				</header>

				<main className="flex-1 px-8 py-8">{children}</main>
			</div>
		</div>
	);
}
