"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/toast";

function LoginPageInner() {
	const searchParams = useSearchParams();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setIsSubmitting(true);

		try {
			const supabase = createClient();
			const { data, error: signInError } =
				await supabase.auth.signInWithPassword({ email, password });

			if (signInError || !data.user)
				throw signInError ?? new Error("Unable to sign in.");

			toast.success("Logged in", { description: "Redirecting…" });

			const role = String(data.user.user_metadata?.role ?? "client");
			const next =
				searchParams.get("next") ??
				searchParams.get("redirect") ??
				{
					client: "/client",
					landlord: "/landlord",
					agent: "/agent",
					admin: "/admin",
				}[role] ??
				"/explore";

			// Hard redirect so the browser sends fresh auth cookies to the middleware
			// on the next request — avoids the race where router.push navigates before
			// Supabase cookies are visible server-side, causing a login bounce loop.
			window.location.href = next;
		} catch (err) {
			toast.error("Sign in failed", {
				description:
					err instanceof Error ? err.message : "Unable to sign in right now.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full">
			<div className="mb-8">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-500">
					Welcome back
				</p>
				<h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">
					Sign in to <span className="text-sage-500">HomeScout</span>
				</h1>
				<p className="mt-2 text-sm text-slate-500">
					Good to have you back. Enter your details to continue.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)]"
			>
				<div className="space-y-5">
					<div>
						<label
							htmlFor="email"
							className="mb-2 block text-sm font-semibold text-slate-700"
						>
							Email address
						</label>
						<div className="relative">
							<Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="input-shell pl-10"
								required
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="password"
							className="mb-2 block text-sm font-semibold text-slate-700"
						>
							Password
						</label>
						<div className="relative">
							<LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								className="input-shell pl-10 pr-10"
								required
							/>
							<button
								type="button"
								aria-label={showPassword ? "Hide password" : "Show password"}
								onClick={() => setShowPassword((v) => !v)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Signing in…
							</>
						) : (
							"Sign in"
						)}
					</button>
				</div>

				<div className="mt-5 flex items-center justify-between text-sm">
					<span className="text-slate-500">
						No account?{" "}
						<Link
							href="/register"
							className="font-semibold text-slate-900 underline underline-offset-2 hover:text-slate-600 transition-colors"
						>
							Sign up
						</Link>
					</span>
					<Link
						href="/"
						className="text-slate-400 hover:text-slate-600 transition-colors"
					>
						Back to home
					</Link>
				</div>
			</form>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense>
			<LoginPageInner />
		</Suspense>
	);
}
