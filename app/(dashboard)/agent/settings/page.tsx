"use client";

import { Settings, UserRound, Bell, Shield, CreditCard } from "lucide-react";

export default function AgentSettingsPage() {
	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div>
				<p className="text-xs font-bold uppercase tracking-widest text-slate-400">Settings</p>
				<h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">Account Settings</h1>
				<p className="mt-0.5 text-sm text-slate-400">Manage your profile and preferences</p>
			</div>

			{[
				{
					icon: <UserRound className="h-5 w-5" />,
					title: "Profile Information",
					description: "Update your name, agency details, and contact information.",
					fields: [
						{ label: "Full Name", placeholder: "Your full name" },
						{ label: "Agency Name", placeholder: "Your agency" },
						{ label: "License Number", placeholder: "Agent license #" },
						{ label: "Phone", placeholder: "+234 800 000 0000" },
					],
				},
				{
					icon: <Bell className="h-5 w-5" />,
					title: "Notifications",
					description: "Configure how and when you receive alerts.",
					fields: [],
					toggles: ["New client inquiry", "Deal status updates", "Listing views", "Weekly report"],
				},
			].map((section) => (
				<div key={section.title} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
					<div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
							{section.icon}
						</div>
						<div>
							<h2 className="text-sm font-black text-slate-900">{section.title}</h2>
							<p className="text-xs text-slate-400">{section.description}</p>
						</div>
					</div>
					<div className="px-6 py-5 space-y-4">
						{section.fields?.map((f) => (
							<div key={f.label} className="space-y-1.5">
								<label className="text-xs font-bold text-slate-700">{f.label}</label>
								<input
									placeholder={f.placeholder}
									className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
								/>
							</div>
						))}
						{section.toggles?.map((t) => (
							<div key={t} className="flex items-center justify-between">
								<span className="text-sm font-medium text-slate-700">{t}</span>
								<div className="relative h-5 w-9 cursor-pointer">
									<input type="checkbox" className="sr-only" defaultChecked />
									<div className="h-5 w-9 rounded-full bg-blue-600" />
									<div className="absolute left-4 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
								</div>
							</div>
						))}
						{(section.fields?.length ?? 0) > 0 && (
							<div className="flex justify-end pt-2">
								<button className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-5 py-2 text-sm font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
									Save Changes
								</button>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
