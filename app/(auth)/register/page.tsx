"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
	Users,
	Building2,
	Briefcase,
	ArrowRight,
	ArrowLeft,
	Check,
	Eye,
	EyeOff,
	Loader2,
	MapPin,
	DollarSign,
	BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
	NIGERIAN_STATES,
	PROPERTY_TYPES,
	DASHBOARD_ROUTES,
} from "@/lib/constants";
import type { UserRole, PropertyType, FeeType } from "@/types";
import { toast } from "@/lib/toast";

const credentialsSchema = z
	.object({
		full_name: z.string().min(2, "Enter your full name"),
		email: z.string().email("Enter a valid email address"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Must contain at least one uppercase letter")
			.regex(/[0-9]/, "Must contain at least one number"),
		confirm_password: z.string().min(1, "Please confirm your password"),
		phone: z
			.string()
			.min(10, "Enter a valid phone number")
			.regex(/^\+?[\d\s-]{10,}$/, "Enter a valid phone number"),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});

type CredentialsForm = z.infer<typeof credentialsSchema>;

// ── Step 1: Role Selection ───────────────────────────────────────────────────

const ROLES: {
	id: UserRole;
	icon: typeof Users;
	color: string;
	bg: string;
	border: string;
	activeBorder: string;
	label: string;
	tagline: string;
	features: string[];
}[] = [
	{
		id: "client",
		icon: Users,
		color: "#4f6af5",
		bg: "#eef2ff",
		border: "#dfe6ff",
		activeBorder: "#4f6af5",
		label: "Tenant / Client",
		tagline: "Find verified rentals across Nigeria",
		features: [
			"GPS map before any payment",
			"Filter by budget & location",
			"Direct chat with owners",
		],
	},
	{
		id: "landlord",
		icon: Building2,
		color: "#10b981",
		bg: "#ecfdf5",
		border: "#d1fae5",
		activeBorder: "#10b981",
		label: "Landlord",
		tagline: "List direct — zero broker friction",
		features: [
			"Full control of your property",
			"Direct tenant management",
			"Identity-verified badge",
		],
	},
	{
		id: "agent",
		icon: Briefcase,
		color: "#f59e0b",
		bg: "#fff7ed",
		border: "#fde68a",
		activeBorder: "#f59e0b",
		label: "Agent / Broker",
		tagline: "Scale listings, set custom commissions",
		features: [
			"Manage multiple listings",
			"Set % or flat commission fees",
			"Agency license profile",
		],
	},
];

// ── Step 2 forms per role ────────────────────────────────────────────────────

interface ClientRoleData {
	target_state: string;
	target_locality: string;
	preferred_types: PropertyType[];
	budget_max: string;
}

interface LandlordRoleData {
	property_count: string;
	identity_ready: boolean;
}

interface AgentRoleData {
	agency_name: string;
	license_number: string;
	fee_type: FeeType;
	fee_value: string;
}

//Step Indicator
function StepIndicator({ current, total }: { current: number; total: number }) {
	return (
		<div
			className="mb-8 flex items-center gap-2"
			role="progressbar"
			aria-valuenow={current}
			aria-valuemin={1}
			aria-valuemax={total}
			aria-label={`Step ${current} of ${total}`}
		>
			{Array.from({ length: total }).map((_, i) => (
				<div key={i} className="flex items-center gap-2">
					<div
						className={cn(
							"flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
							i + 1 < current
								? "bg-emerald-500 text-white"
								: i + 1 === current
									? "bg-brand-500 text-white"
									: "bg-slate-200 text-slate-400",
						)}
					>
						{i + 1 < current ? <Check size={12} /> : i + 1}
					</div>
					{i < total - 1 && (
						<div
							className={cn(
								"h-0.5 w-8 rounded-full transition-all duration-300",
								i + 1 < current ? "bg-emerald-500" : "bg-slate-200",
							)}
						/>
					)}
				</div>
			))}
			<span className="ml-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
				Step {current} of {total}
			</span>
		</div>
	);
}

//Input component
function Field({
	label,
	id,
	error,
	children,
}: {
	label: string;
	id: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-1.5">
			<label
				htmlFor={id}
				className="block text-sm font-semibold text-slate-700"
			>
				{label}
			</label>
			{children}
			{error ? (
				<p className="text-xs text-rose-500" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}

const inputClass =
	"w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all";

const errorInputClass =
	"w-full rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300/25 transition-all";

// Main Register Page
const easeCurve = [0.22, 1, 0.36, 1] as const;

const SLIDE = {
	enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
	center: { x: 0, opacity: 1, transition: { duration: 0.38, ease: easeCurve } },
	exit: (dir: number) => ({
		x: dir > 0 ? -60 : 60,
		opacity: 0,
		transition: { duration: 0.25, ease: easeCurve },
	}),
};

function RegisterPageInner() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialRole = (searchParams.get("role") as UserRole) || null;

	const [step, setStep] = useState(1);
	const [dir, setDir] = useState(1);
	const [selectedRole, setSelectedRole] = useState<UserRole | null>(
		initialRole,
	);
	const [clientData, setClientData] = useState<ClientRoleData>({
		target_state: "",
		target_locality: "",
		preferred_types: [],
		budget_max: "",
	});
	const [landlordData, setLandlordData] = useState<LandlordRoleData>({
		property_count: "1",
		identity_ready: false,
	});
	const [agentData, setAgentData] = useState<AgentRoleData>({
		agency_name: "",
		license_number: "",
		fee_type: "percentage",
		fee_value: "10",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CredentialsForm>({ resolver: zodResolver(credentialsSchema) });

	function goNext() {
		setDir(1);
		setStep((s) => s + 1);
	}

	function goBack() {
		setDir(-1);
		setStep((s) => s - 1);
	}

	// Step 1 submit
	function handleRoleSelect(role: UserRole) {
		setSelectedRole(role);
	}

	function handleStep1Continue() {
		if (!selectedRole) return;
		goNext();
	}

	// Step 2 submit
	function handleStep2Continue() {
		goNext();
	}

	// Step 3 submit — Supabase registration
	const onSubmit = (data: CredentialsForm) => {
		if (!selectedRole) return;
		setServerError(null);

		startTransition(async () => {
			const supabase = createClient();

			// Build role-specific metadata
			let roleMetadata: Record<string, unknown> = {};
			if (selectedRole === "client") {
				roleMetadata = {
					target_state: clientData.target_state,
					target_locality: clientData.target_locality,
					preferred_property_types: clientData.preferred_types,
					budget_max: Number(clientData.budget_max) || null,
				};
			} else if (selectedRole === "landlord") {
				roleMetadata = {
					property_count: Number(landlordData.property_count) || 1,
					identity_verification_ready: landlordData.identity_ready,
				};
			} else if (selectedRole === "agent") {
				roleMetadata = {
					agency_name: agentData.agency_name,
					license_number: agentData.license_number,
					fee_type: agentData.fee_type,
					fee_value: Number(agentData.fee_value) || 0,
				};
			}

			const { error } = await supabase.auth.signUp({
				email: data.email,
				password: data.password,
				options: {
					data: {
						full_name: data.full_name,
						phone: data.phone,
						role: selectedRole,
						...roleMetadata,
					},
				},
			});

			if (error) {
				toast.error("Registration failed", { description: error.message });
				setServerError(error.message);
				return;
			}

			toast.success("Account created!", {
				description: "Taking you to your dashboard…",
			});
			router.push(DASHBOARD_ROUTES[selectedRole] ?? "/");
		});
	};

	return (
		<div className="w-full my-6">
			<div className="w-full max-w-lg">
				<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] md:p-7">
					{/* Header */}
					<div className="mb-7 text-left">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-500">
							Get started
						</p>
						<h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">
							{step === 1 && (
								<>
									<span className="text-sage-500">Join</span> HomeScout
								</>
							)}
							{step === 2 && "Tell us about yourself"}
							{step === 3 && "Create your account"}
						</h1>
						<p className="mt-2 text-sm text-slate-500">
							{step === 1 && "Choose the role that fits your journey."}
							{step === 2 && "Help us personalise your experience."}
							{step === 3 && "Finish with your secure login details."}
						</p>
					</div>

					<StepIndicator current={step} total={3} />

					<AnimatePresence mode="wait" custom={dir}>
						{/* ── Step 1: Role Selection ─────────────────────────────────── */}
						{step === 1 && (
							<motion.div
								key="step1"
								custom={dir}
								variants={SLIDE}
								initial="enter"
								animate="center"
								exit="exit"
								className="space-y-4"
							>
								{ROLES.map((role) => {
									const Icon = role.icon;
									const selected = selectedRole === role.id;
									return (
										<button
											key={role.id}
											type="button"
											onClick={() => handleRoleSelect(role.id)}
											className="w-full rounded-[1.5rem] border p-5 text-left transition-all duration-200"
											style={{
												background: selected
													? role.bg
													: "rgba(255,255,255,0.88)",
												borderColor: selected ? role.activeBorder : "#e2e8f0",
												boxShadow: selected
													? `0 0 0 4px ${role.color}18`
													: "0 8px 24px rgba(15, 23, 42, 0.03)",
											}}
											aria-pressed={selected}
										>
											<div className="flex items-start gap-4">
												<div
													className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
													style={{
														background: selected
															? `${role.color}1f`
															: "#f5f5f4",
														color: selected ? role.color : "#94a3b8",
													}}
												>
													<Icon size={20} />
												</div>
												<div className="min-w-0 flex-1">
													<div className="flex items-center justify-between gap-2">
														<p className="text-base font-bold text-slate-900">
															{role.label}
														</p>
														{selected ? (
															<div
																className="flex h-5 w-5 items-center justify-center rounded-full"
																style={{ background: role.color }}
															>
																<Check size={11} className="text-white" />
															</div>
														) : null}
													</div>
													<p className="mt-1 text-xs text-slate-500">
														{role.tagline}
													</p>
													<ul className="mt-3 space-y-1.5" role="list">
														{role.features.map((feature) => (
															<li
																key={feature}
																className="flex items-center gap-2 text-xs text-slate-600"
															>
																<span
																	className="h-1.5 w-1.5 shrink-0 rounded-full"
																	style={{ background: role.color }}
																/>
																{feature}
															</li>
														))}
													</ul>
												</div>
											</div>
										</button>
									);
								})}

								<button
									type="button"
									onClick={handleStep1Continue}
									disabled={!selectedRole}
									className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Continue <ArrowRight size={15} />
								</button>

								<p className="text-center text-sm text-slate-500">
									Already have an account?{" "}
									<Link
										href="/login"
										className="font-semibold text-slate-900 underline underline-offset-2 hover:text-slate-600 transition-colors"
									>
										Sign in
									</Link>
								</p>
							</motion.div>
						)}

						{/* ── Step 2: Role-specific Data ─────────────────────────────── */}
						{step === 2 && selectedRole && (
							<motion.div
								key="step2"
								custom={dir}
								variants={SLIDE}
								initial="enter"
								animate="center"
								exit="exit"
								className="space-y-5"
							>
								{/* Selected role badge */}
								<div className="flex items-center gap-2 mb-2">
									{(() => {
										const r = ROLES.find((x) => x.id === selectedRole)!;
										const Icon = r.icon;
										return (
											<span
												className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full"
												style={{
													background: r.bg,
													color: r.color,
													border: `1px solid ${r.border}`,
												}}
											>
												<Icon size={12} />
												{r.label}
											</span>
										);
									})()}
								</div>

								{/* CLIENT form */}
								{selectedRole === "client" && (
									<div className="space-y-4">
										<Field label="Target State" id="target_state">
											<div className="relative">
												<MapPin
													size={14}
													className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8494b8]"
												/>
												<select
													id="target_state"
													value={clientData.target_state}
													onChange={(e) =>
														setClientData((d) => ({
															...d,
															target_state: e.target.value,
														}))
													}
													className={cn(
														inputClass,
														"pl-9 appearance-none cursor-pointer",
													)}
												>
													<option value="">Select your target state</option>
													{NIGERIAN_STATES.map((s) => (
														<option key={s} value={s}>
															{s}
														</option>
													))}
												</select>
											</div>
										</Field>
										<Field
											label="Locality / Area (optional)"
											id="target_locality"
										>
											<input
												id="target_locality"
												type="text"
												placeholder="e.g. Lekki, Bwari, Bodija"
												value={clientData.target_locality}
												onChange={(e) =>
													setClientData((d) => ({
														...d,
														target_locality: e.target.value,
													}))
												}
												className={inputClass}
											/>
										</Field>
										<Field label="Max Annual Budget (₦)" id="budget_max">
											<div className="relative">
												<DollarSign
													size={14}
													className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8494b8]"
												/>
												<input
													id="budget_max"
													type="number"
													placeholder="e.g. 500000"
													value={clientData.budget_max}
													onChange={(e) =>
														setClientData((d) => ({
															...d,
															budget_max: e.target.value,
														}))
													}
													className={cn(inputClass, "pl-9")}
												/>
											</div>
										</Field>
										<div>
											<p className="text-sm font-semibold text-[#3e4668] mb-3">
												Preferred property types
											</p>
											<div className="flex flex-wrap gap-2">
												{PROPERTY_TYPES.map(({ value, label }) => {
													const active =
														clientData.preferred_types.includes(value);
													return (
														<button
															key={value}
															type="button"
															onClick={() =>
																setClientData((d) => ({
																	...d,
																	preferred_types: active
																		? d.preferred_types.filter(
																				(t) => t !== value,
																			)
																		: [...d.preferred_types, value],
																}))
															}
															className={cn(
																"px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
																active
																	? "bg-slate-900 text-white border-slate-900"
																	: "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900",
															)}
															aria-pressed={active}
														>
															{label}
														</button>
													);
												})}
											</div>
										</div>
									</div>
								)}

								{/* LANDLORD form */}
								{selectedRole === "landlord" && (
									<div className="space-y-4">
										<Field
											label="How many properties do you own?"
											id="property_count"
										>
											<div className="grid grid-cols-4 gap-2">
												{["1", "2-3", "4-9", "10+"].map((val) => (
													<button
														key={val}
														type="button"
														onClick={() =>
															setLandlordData((d) => ({
																...d,
																property_count: val,
															}))
														}
														className={cn(
															"py-3 text-sm font-semibold rounded-xl border transition-all",
															landlordData.property_count === val
																? "bg-[#10b981] text-white border-[#10b981]"
																: "bg-white text-[#637099] border-[#d5dae9] hover:border-[#a7f3d0] hover:text-[#10b981]",
														)}
														aria-pressed={landlordData.property_count === val}
													>
														{val}
													</button>
												))}
											</div>
										</Field>
										<button
											type="button"
											onClick={() =>
												setLandlordData((d) => ({
													...d,
													identity_ready: !d.identity_ready,
												}))
											}
											className={cn(
												"w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
												landlordData.identity_ready
													? "bg-[#f0fdf4] border-[#10b981] text-[#166534]"
													: "bg-white border-[#d5dae9] text-[#637099] hover:border-[#a7f3d0]",
											)}
											aria-pressed={landlordData.identity_ready}
										>
											<BadgeCheck
												size={18}
												className={
													landlordData.identity_ready
														? "text-[#10b981]"
														: "text-[#a8a89e]"
												}
											/>
											<div>
												<p className="text-sm font-semibold text-[#1c2038]">
													I&apos;m ready for identity verification
												</p>
												<p className="text-xs text-[#637099] mt-0.5">
													NIN or International Passport — required for verified
													listing badge.
												</p>
											</div>
										</button>
									</div>
								)}

								{/* AGENT form */}
								{selectedRole === "agent" && (
									<div className="space-y-4">
										<Field label="Agency Name" id="agency_name">
											<input
												id="agency_name"
												type="text"
												placeholder="e.g. Apex Properties Ltd"
												value={agentData.agency_name}
												onChange={(e) =>
													setAgentData((d) => ({
														...d,
														agency_name: e.target.value,
													}))
												}
												className={inputClass}
											/>
										</Field>
										<Field
											label="License / Registration Number"
											id="license_number"
										>
											<input
												id="license_number"
												type="text"
												placeholder="e.g. NIESV/2024/001234"
												value={agentData.license_number}
												onChange={(e) =>
													setAgentData((d) => ({
														...d,
														license_number: e.target.value,
													}))
												}
												className={inputClass}
											/>
										</Field>
										<div>
											<p className="text-sm font-semibold text-[#3e4668] mb-3">
												Commission fee model
											</p>
											<div className="grid grid-cols-2 gap-3">
												{(["percentage", "flat"] as FeeType[]).map((type) => (
													<button
														key={type}
														type="button"
														onClick={() =>
															setAgentData((d) => ({ ...d, fee_type: type }))
														}
														className={cn(
															"py-3 px-4 text-sm font-semibold rounded-xl border transition-all",
															agentData.fee_type === type
																? "bg-[#f59e0b] text-white border-[#f59e0b]"
																: "bg-white text-[#637099] border-[#d5dae9] hover:border-[#fde68a] hover:text-[#d97706]",
														)}
														aria-pressed={agentData.fee_type === type}
													>
														{type === "percentage"
															? "% Percentage"
															: "₦ Flat Fee"}
													</button>
												))}
											</div>
										</div>
										<Field
											label={
												agentData.fee_type === "percentage"
													? "Commission percentage (%)"
													: "Flat fee per deal (₦)"
											}
											id="fee_value"
										>
											<input
												id="fee_value"
												type="number"
												placeholder={
													agentData.fee_type === "percentage"
														? "e.g. 10"
														: "e.g. 50000"
												}
												value={agentData.fee_value}
												onChange={(e) =>
													setAgentData((d) => ({
														...d,
														fee_value: e.target.value,
													}))
												}
												className={inputClass}
											/>
										</Field>
									</div>
								)}

								<div className="flex gap-3 pt-2">
									<button
										type="button"
										onClick={goBack}
										className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:text-slate-900 transition-all"
									>
										<ArrowLeft size={14} />
										Back
									</button>
									<button
										type="button"
										onClick={handleStep2Continue}
										className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
										style={{
											background:
												"linear-gradient(135deg, #4f6af5 0%, #3650e8 100%)",
										}}
									>
										Continue
										<ArrowRight size={14} />
									</button>
								</div>
							</motion.div>
						)}

						{/* ── Step 3: Credentials ────────────────────────────────────── */}
						{step === 3 && (
							<motion.div
								key="step3"
								custom={dir}
								variants={SLIDE}
								initial="enter"
								animate="center"
								exit="exit"
							>
								<form
									onSubmit={handleSubmit(onSubmit, () => {
										toast.error("Please fix the errors below", {
											description: "Check the highlighted fields and try again.",
										});
									})}
									noValidate
									className="space-y-4"
								>
									<Field
										label="Full Name"
										id="full_name"
										error={errors.full_name?.message}
									>
										<input
											id="full_name"
											type="text"
											autoComplete="name"
											placeholder="Adaeze Okonkwo"
											{...register("full_name")}
											className={
												errors.full_name ? errorInputClass : inputClass
											}
										/>
									</Field>

									<Field
										label="Email Address"
										id="email"
										error={errors.email?.message}
									>
										<input
											id="email"
											type="email"
											autoComplete="email"
											placeholder="adaeze@email.com"
											{...register("email")}
											className={errors.email ? errorInputClass : inputClass}
										/>
									</Field>

									<Field
										label="Phone Number"
										id="phone"
										error={errors.phone?.message}
									>
										<input
											id="phone"
											type="tel"
											autoComplete="tel"
											placeholder="+234 801 234 5678"
											{...register("phone")}
											className={errors.phone ? errorInputClass : inputClass}
										/>
									</Field>

									<Field
										label="Password"
										id="password"
										error={errors.password?.message}
									>
										<div className="relative">
											<input
												id="password"
												type={showPassword ? "text" : "password"}
												autoComplete="new-password"
												placeholder="Min. 8 chars, 1 uppercase, 1 number"
												{...register("password")}
												className={cn(
													errors.password ? errorInputClass : inputClass,
													"pr-11",
												)}
											/>
											<button
												type="button"
												onClick={() => setShowPassword((v) => !v)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8494b8] hover:text-[#637099] transition-colors"
												aria-label={
													showPassword ? "Hide password" : "Show password"
												}
											>
												{showPassword ? (
													<EyeOff size={16} />
												) : (
													<Eye size={16} />
												)}
											</button>
										</div>
									</Field>

									<Field
										label="Confirm Password"
										id="confirm_password"
										error={errors.confirm_password?.message}
									>
										<div className="relative">
											<input
												id="confirm_password"
												type={showConfirmPassword ? "text" : "password"}
												autoComplete="new-password"
												placeholder="Re-enter your password"
												{...register("confirm_password")}
												className={cn(
													errors.confirm_password ? errorInputClass : inputClass,
													"pr-11",
												)}
											/>
											<button
												type="button"
												onClick={() => setShowConfirmPassword((v) => !v)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8494b8] hover:text-[#637099] transition-colors"
												aria-label={
													showConfirmPassword
														? "Hide password confirmation"
														: "Show password confirmation"
												}
											>
												{showConfirmPassword ? (
													<EyeOff size={16} />
												) : (
													<Eye size={16} />
												)}
											</button>
										</div>
									</Field>

									{serverError && (
										<div
											className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600"
											role="alert"
										>
											{serverError}
										</div>
									)}

									<div className="flex gap-3 pt-2">
										<button
											type="button"
											onClick={goBack}
											disabled={isPending}
											className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:text-slate-900 transition-all disabled:opacity-40"
										>
											<ArrowLeft size={14} />
											Back
										</button>
										<button
											type="submit"
											disabled={isPending}
											className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
											style={{
												background:
													"linear-gradient(135deg, #4f6af5 0%, #3650e8 100%)",
											}}
										>
											{isPending ? (
												<>
													<Loader2 size={15} className="animate-spin" />
													Creating account…
												</>
											) : (
												<>
													Create account
													<ArrowRight size={15} />
												</>
											)}
										</button>
									</div>

									<p className="text-center text-xs text-slate-400">
										By creating an account you agree to our{" "}
										<Link
											href="/terms"
											className="underline hover:text-slate-900"
										>
											Terms
										</Link>{" "}
										and{" "}
										<Link
											href="/privacy"
											className="underline hover:text-slate-900"
										>
											Privacy Policy
										</Link>
										.
									</p>
								</form>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}

export default function RegisterPage() {
	return (
		<Suspense>
			<RegisterPageInner />
		</Suspense>
	);
}
