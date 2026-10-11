export default function AdminDashboardPage() {
	return (
		<div className="space-y-6">
			<header>
				<p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
					Control center
				</p>
				<h1 className="mt-2 text-4xl font-black tracking-[-0.06em] text-slate-900">
					Administration overview
				</h1>
			</header>
			<div className="grid gap-4 md:grid-cols-3">
				{[
					{ label: "Total users", value: "1,240" },
					{ label: "Listings under review", value: "37" },
					{ label: "Verification queue", value: "14" },
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
