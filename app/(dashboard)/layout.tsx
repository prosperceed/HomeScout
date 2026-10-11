import Link from "next/link";
import {
	BarChart3,
	Building2,
	LayoutGrid,
	MessageSquare,
	ShieldCheck,
	UserRound,
	Users,
} from "lucide-react";

const navByRole = {
	admin: [
		{ href: "/admin", label: "Overview", icon: LayoutGrid },
		{ href: "/admin/users", label: "Users", icon: Users },
		{ href: "/admin/listings", label: "Listings", icon: Building2 },
		{ href: "/admin/verification", label: "Verification", icon: ShieldCheck },
	],
	landlord: [
		{ href: "/landlord", label: "Overview", icon: LayoutGrid },
		{ href: "/landlord/properties", label: "Properties", icon: Building2 },
		{ href: "/landlord/tenants", label: "Tenants", icon: Users },
	],
	client: [
		{ href: "/client", label: "Overview", icon: LayoutGrid },
		{ href: "/client/saved", label: "Saved", icon: UserRound },
		{ href: "/client/applications", label: "Applications", icon: BarChart3 },
		{ href: "/client/messages", label: "Messages", icon: MessageSquare },
	],
	agent: [
		{ href: "/agent", label: "Overview", icon: LayoutGrid },
		{ href: "/agent/listings", label: "Listings", icon: Building2 },
		{ href: "/agent/analytics", label: "Analytics", icon: BarChart3 },
		{ href: "/agent/messages", label: "Messages", icon: MessageSquare },
	],
} as const;

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const role = "client";
	const items = navByRole[role];

	return (
		<div className="min-h-screen bg-stone-50 text-slate-900">
			<aside className="fixed inset-y-0 left-0 w-[260px] border-r border-stone-200 bg-white px-5 py-6">
				<Link
					href="/"
					className="flex items-center gap-3 px-3 pb-8 text-lg font-black tracking-tight text-slate-900"
				>
					<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-300 text-white">
						H
					</span>
					HomeScout
				</Link>

				<nav className="space-y-2">
					{items.map(({ href, label, icon: Icon }) => (
						<Link
							key={href}
							href={href}
							className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
						>
							<Icon className="h-4 w-4" />
							{label}
						</Link>
					))}
				</nav>
			</aside>

			<main className="ml-[260px] p-6 md:p-8">{children}</main>
		</div>
	);
}
