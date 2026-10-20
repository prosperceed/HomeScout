"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const publicNavLinks = [
	{ label: "Home", href: "/" },
	{ label: "Properties", href: "/explore" },
	{ label: "Agent Finder", href: "/#agents" },
	{ label: "Contact", href: "/#contact" },
];

const roleNavLinks: Record<string, { label: string; href: string }[]> = {
	client: [
		{ label: "Overview", href: "/client" },
		{ label: "Saved Homes", href: "/client/saved" },
		{ label: "Applications", href: "/client/applications" },
		{ label: "Messages", href: "/client/messages" },
		{ label: "Explore", href: "/client/explore" },
	],
	landlord: [
		{ label: "Overview", href: "/landlord" },
		{ label: "Properties", href: "/landlord/properties" },
		{ label: "Tenants", href: "/landlord/tenants" },
		{ label: "Bookings", href: "/landlord/bookings" },
	],
	agent: [
		{ label: "Dashboard", href: "/agent" },
		{ label: "Clients", href: "/agent/clients" },
		{ label: "Deals", href: "/agent/deals" },
		{ label: "Properties", href: "/agent/properties" },
		{ label: "Portfolio", href: "/agent/portfolio" },
	],
	admin: [
		{ label: "Overview", href: "/admin" },
		{ label: "Users", href: "/admin/users" },
		{ label: "Listings", href: "/admin/listings" },
	],
};

const roleDashboardMap: Record<string, string> = {
	client: "/client",
	landlord: "/landlord",
	agent: "/agent",
	admin: "/admin",
};

function getRoleFromUser(user: any): string | null {
	const role =
		user?.user_metadata?.role ?? user?.app_metadata?.role ?? user?.role ?? null;
	return typeof role === "string" ? role : null;
}

function NavbarInner() {
	const pathname = usePathname();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [userRole, setUserRole] = useState<string | null>(null);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	useEffect(() => {
		const supabase = createClient();

		let mounted = true;
		const syncUser = async () => {
			const { data } = await supabase.auth.getUser();
			if (!mounted) return;
			setUserRole(getRoleFromUser(data.user));
		};

		syncUser();

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				if (!mounted) return;
				setUserRole(getRoleFromUser(session?.user));
			},
		);

		return () => {
			mounted = false;
			authListener.subscription.unsubscribe();
		};
	}, []);

	const navLinks = userRole ? (roleNavLinks[userRole] ?? []) : publicNavLinks;
	const homeHref = userRole ? (roleDashboardMap[userRole] ?? "/") : "/";

	const handleLogout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/");
	};

	return (
		<>
			<header
				className={`fixed inset-x-0 top-0 z-100 transition-all duration-300 ${
					scrolled
						? "border-b border-slate-100 bg-white/95 backdrop-blur-md"
						: "bg-transparent"
				}`}
			>
				<div className="container-shell flex items-center justify-between gap-4 py-4">
					<Link
						href={homeHref}
						className="flex shrink-0 items-center gap-2.5"
						aria-label="HomeScout home"
					>
						<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-black text-white">
							H
						</span>
						<span
							className={`text-lg font-extrabold tracking-tight transition-colors ${
								scrolled ? "text-slate-900" : "text-white"
							}`}
						>
							HomeScout
						</span>
					</Link>

					<nav
						className="hidden items-center gap-1 md:flex"
						aria-label="Main navigation"
					>
						{navLinks.map((item) => {
							const isActive =
								pathname === item.href ||
								(item.href !== "/" && pathname.startsWith(item.href));
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
										isActive
											? scrolled
												? "bg-slate-100 text-slate-900"
												: "bg-white/15 text-white"
											: scrolled
												? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
												: "text-white/80 hover:bg-white/10 hover:text-white"
									}`}
								>
									{item.label}
								</Link>
							);
						})}
					</nav>

					<div className="hidden items-center gap-2 md:flex">
						{userRole ? (
							<>
								<Link
									href={homeHref}
									className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
										scrolled
											? "bg-brand-700 text-white hover:bg-brand-600"
											: "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
									}`}
								>
									Dashboard
								</Link>
								<button
									type="button"
									onClick={handleLogout}
									className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
										scrolled
											? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
											: "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
									}`}
								>
									Sign out
								</button>
							</>
						) : (
							<Link
								href="/login"
								className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
									scrolled
										? "bg-brand-700 text-white hover:bg-brand-600"
										: "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
								}`}
							>
								Sign in
							</Link>
						)}
					</div>

					<button
						type="button"
						className={`inline-flex h-10 w-10 items-center justify-center rounded-full border md:hidden transition-colors ${
							scrolled
								? "border-slate-200 bg-white text-slate-800"
								: "border-white/25 bg-white/5 text-white"
						}`}
						aria-label={open ? "Close menu" : "Open menu"}
						onClick={() => setOpen((v) => !v)}
					>
						{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
					</button>
				</div>
			</header>

			{open && (
				<div className="fixed inset-x-0 top-18 z-40 border-t border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur-xl md:hidden">
					<nav className="flex flex-col gap-1" aria-label="Mobile navigation">
						{navLinks.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
							>
								{item.label}
							</Link>
						))}
					</nav>
					<div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
						{userRole ? (
							<>
								<Link
									href={homeHref}
									className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
								>
									Dashboard
								</Link>
								<button
									type="button"
									onClick={handleLogout}
									className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
								>
									Sign out
								</button>
							</>
						) : (
							<Link
								href="/login"
								className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
							>
								Sign in
							</Link>
						)}
					</div>
				</div>
			)}
		</>
	);
}

export default function Navbar() {
	return (
		<Suspense>
			<NavbarInner />
		</Suspense>
	);
}
