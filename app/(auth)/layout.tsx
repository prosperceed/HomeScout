import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-screen overflow-hidden bg-[#f6f5f3]">
			<div className="flex h-full">
				<div className="relative hidden w-[44%] flex-col overflow-hidden lg:flex">
					<Image
						src="/assets/house2.jpeg"
						alt="HomeScout property"
						fill
						priority
						className="object-cover object-center"
						sizes="44vw"
					/>
					<div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/55 to-slate-900/70" />

					<div className="relative z-10 flex h-full flex-col items-center justify-center p-10 text-center xl:p-14">
						<Link
							href="/"
							className="flex items-center gap-3 mb-12"
							aria-label="HomeScout home"
						>
							<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-black text-white">
								H
							</span>
							<span className="text-2xl font-black tracking-[-0.04em] text-white">
								HomeScout
							</span>
						</Link>

						<div className="max-w-xs">
							<h2 className="text-3xl font-black leading-[1.15] tracking-[-0.04em] text-white xl:text-4xl">
								Your next home
								<br />
								<span className="text-sage-400">is waiting for you.</span>
							</h2>
							<p className="mt-4 text-sm leading-relaxed text-slate-300">
								Join thousands of people who found their perfect home through
								HomeScout — simple, clear, and built on trust.
							</p>
						</div>
					</div>
				</div>

				<div className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-8 sm:px-8 lg:px-12">
					<div className="w-full max-w-md">
						<div className="mb-8 flex justify-center lg:hidden">
							<Link
								href="/"
								className="flex items-center gap-2.5"
								aria-label="HomeScout home"
							>
								<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-black text-white">
									H
								</span>
								<span className="text-xl font-black tracking-[-0.04em] text-slate-900">
									HomeScout
								</span>
							</Link>
						</div>

						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
