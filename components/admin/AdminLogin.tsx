"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Loader2, Mail } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/toast";

export function AdminLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);
		try {
			const { data, error } = await createClient().auth.signInWithPassword({ email, password });
			if (error || !data.user) throw error ?? new Error("Unable to sign in.");
			window.location.href = "/admin_panel";
		} catch (error) {
			toast.error("Admin sign in failed", { description: error instanceof Error ? error.message : "Check your credentials and try again." });
		} finally {
			setIsSubmitting(false);
		}
	};

	return <main className="flex min-h-screen items-center justify-center bg-[#f6f5f3] px-5 py-10"><div className="w-full max-w-md"><div className="mb-8 flex justify-center"><Logo variant="light" size="lg" /></div><div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-9"><p className="text-xs font-black uppercase tracking-[0.2em] text-sage-600">Restricted access</p><h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-900">Welcome, administrator.</h1><p className="mt-3 text-sm leading-6 text-slate-500">Sign in with your HomeScout administrator account to continue to operations.</p><form onSubmit={submit} className="mt-7 space-y-5"><div><label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label><div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@homescout.ng" className="input-shell !pl-11" autoComplete="username" required /></div></div><div><label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="input-shell !pl-11 !pr-11" autoComplete="current-password" required /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div><button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in…</> : "Sign in to admin panel"}</button></form><p className="mt-6 text-center text-xs leading-5 text-slate-400">Administrator access is provisioned by the HomeScout operations team.</p></div></div></main>;
}
