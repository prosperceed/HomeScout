export default function ClientDashboardPage() {
	return (
		<div className="space-y-6">
			<header className="flex items-end justify-between gap-4">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
						Dashboard
					</p>
					<h1 className="mt-2 text-4xl font-black tracking-[-0.06em] text-slate-900">
						Client overview
					</h1>
				</div>
			</header>

			<div className="grid gap-4 md:grid-cols-3">
				{[
					{ label: "Saved homes", value: "18" },
					{ label: "Applications", value: "06" },
					{ label: "Shortlisted", value: "04" },
				].map((item) => (
					<div
						key={item.label}
						className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm"
					>
						<p className="text-sm text-slate-500">{item.label}</p>
						<p className="mt-3 text-3xl font-black tracking-[-0.06em] text-slate-900">
							{item.value}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
