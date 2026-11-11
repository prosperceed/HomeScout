"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	AlertTriangle,
	ArrowLeft,
	ArrowRight,
	Calendar,
	Check,
	CheckCircle2,
	Clock,
	Download,
	Home,
	Lock,
	Mail,
	MapPin,
	MessageSquare,
	Phone,
	ShieldAlert,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import type { BookingWithProperty } from "@/lib/supabase/queries";
import {
	scheduleInspectionAction,
	confirmPhysicalVerificationAction,
	completeBookingPaymentAction,
} from "@/app/actions/booking-actions";

interface ClientApplicationStageFlowProps {
	booking: BookingWithProperty;
	onBack?: () => void;
	isModal?: boolean;
}

function formatPrice(n: number, period?: string | null) {
	const val = `₦${Number(n || 0).toLocaleString("en-NG")}`;
	const p =
		period === "per_year"
			? "/ year"
			: period === "per_month"
				? "/ month"
				: period === "per_night"
					? "/ night"
					: "";
	return `${val} ${p}`;
}

function getThumbnail(images: unknown): string {
	if (Array.isArray(images) && images.length > 0) {
		const first = images[0];
		if (typeof first === "string" && first.trim()) return first;
		if (
			first &&
			typeof first === "object" &&
			"url" in first &&
			typeof (first as { url?: string }).url === "string"
		) {
			return (first as { url: string }).url;
		}
	}
	return "/assets/house1.jpeg";
}

export function ClientApplicationStageFlow({
	booking,
	onBack,
	isModal = false,
}: ClientApplicationStageFlowProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Inspection Form State
	const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
	const [selectedDate, setSelectedDate] = useState<string>(
		booking.viewing_date ? booking.viewing_date.split("T")[0] : tomorrowStr,
	);
	const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("10:00 AM");
	const [inspectionNotes, setInspectionNotes] = useState<string>(
		booking.inspection_notes ?? "",
	);

	// Verification Checklist State
	const existingChecklist = (booking.verification_checklist as Record<string, boolean>) || {};
	const [checklist, setChecklist] = useState({
		visitedInPerson: Boolean(existingChecklist.visitedInPerson || booking.physical_verified),
		utilitiesAndConditionChecked: Boolean(
			existingChecklist.utilitiesAndConditionChecked || booking.physical_verified,
		),
		representativeAndTermsVerified: Boolean(
			existingChecklist.representativeAndTermsVerified || booking.physical_verified,
		),
		risksAcknowledged: Boolean(existingChecklist.risksAcknowledged || booking.physical_verified),
	});

	// Payment State
	const [paymentMethod, setPaymentMethod] = useState<string>("card");
	const [paidReference, setPaidReference] = useState<string | null>(
		booking.payment_reference ?? null,
	);

	const allChecklistConfirmed =
		checklist.visitedInPerson &&
		checklist.utilitiesAndConditionChecked &&
		checklist.representativeAndTermsVerified &&
		checklist.risksAcknowledged;

	// Determine active step index: 0 = Inquiry, 1 = Inspection, 2 = Verification, 3 = Payment, 4 = Completed
	const isPaid = booking.status === "completed" || Boolean(paidReference);
	const isVerified = Boolean(booking.physical_verified || booking.status === "approved") || isPaid;
	const isInspectionScheduled = Boolean(booking.status === "viewing" || booking.viewing_date) || isVerified;

	const [activeStepTab, setActiveStepTab] = useState<"inspection" | "verification" | "payment" | "completed">(
		isPaid
			? "completed"
			: isVerified
				? "payment"
				: isInspectionScheduled
					? "verification"
					: "inspection",
	);

	const propPrice = Number(booking.price_at_booking || 0);
	const cautionDeposit = Math.round(propPrice * 0.1);
	const legalFee = Math.round(propPrice * 0.05);
	const serviceFee = 25000;
	const totalDue = propPrice + cautionDeposit + legalFee + serviceFee;

	const handleScheduleInspection = () => {
		setErrorMessage(null);
		if (!selectedDate) {
			setErrorMessage("Please select an inspection date.");
			return;
		}

		startTransition(async () => {
			const viewingIso = new Date(`${selectedDate}T${selectedTimeSlot.includes("PM") ? "14:00:00" : "10:00:00"}`).toISOString();
			const res = await scheduleInspectionAction({
				bookingId: booking.id,
				viewingDate: viewingIso,
				notes: inspectionNotes,
			});

			if (!res.success) {
				setErrorMessage(res.error || "Failed to schedule inspection");
				return;
			}

			setActiveStepTab("verification");
			router.refresh();
		});
	};

	const handleConfirmVerification = () => {
		setErrorMessage(null);
		if (!allChecklistConfirmed) {
			setErrorMessage("All four verification criteria must be confirmed before proceeding to payment.");
			return;
		}

		startTransition(async () => {
			const res = await confirmPhysicalVerificationAction({
				bookingId: booking.id,
				checklist,
				notes: inspectionNotes,
			});

			if (!res.success) {
				setErrorMessage(res.error || "Failed to submit verification");
				return;
			}

			setActiveStepTab("payment");
			router.refresh();
		});
	};

	const handleCompletePayment = () => {
		setErrorMessage(null);
		startTransition(async () => {
			const res = await completeBookingPaymentAction({
				bookingId: booking.id,
				paymentMethod,
			});

			if (!res.success) {
				setErrorMessage(res.error || "Failed to process payment");
				return;
			}

			setPaidReference(res.paymentReference || "HS-CONFIRMED");
			setActiveStepTab("completed");
			router.refresh();
		});
	};

	const agentProfile = booking.agent_profile;
	const partnerChatUrl = `/client/messages?recipient=${booking.agent_id || ""}&property=${booking.property_id}`;

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			{/* Top Bar Navigation */}
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
				<div className="flex items-center gap-2.5">
					{onBack && (
						<button
							type="button"
							onClick={onBack}
							className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
						>
							<ArrowLeft className="h-4 w-4" />
						</button>
					)}
					<div>
						<p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
							Booking & Housing Journey
						</p>
						<h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
							{booking.property?.title ?? "Property Application"}
						</h1>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Link
						href={partnerChatUrl}
						className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
					>
						<MessageSquare className="h-3.5 w-3.5 text-slate-400" />
						<span>Chat with Agent</span>
					</Link>
				</div>
			</div>

			{/* Property Snapshot Banner */}
			<div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-3 sm:gap-4">
						<div className="h-16 w-20 sm:h-20 sm:w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={getThumbnail(booking.property?.images)}
								alt={booking.property?.title ?? "Property"}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
									{booking.property?.type?.replace(/_/g, " ") ?? "Apartment"}
								</span>
								<span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full ring-1 ring-amber-200">
									Status: {booking.property?.status === "rented" ? "Rented" : "Under Review"}
								</span>
							</div>
							<h3 className="mt-1 truncate text-sm sm:text-base font-bold text-slate-900">
								{booking.property?.title}
							</h3>
							<p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
								<MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
								<span className="truncate">
									{booking.property?.formatted_address ?? booking.property?.state ?? "Nigeria"}
								</span>
							</p>
						</div>
					</div>

					<div className="border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0 sm:text-right">
						<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
							Asking Rent
						</p>
						<p className="text-base sm:text-lg font-bold text-slate-900">
							{formatPrice(booking.price_at_booking, booking.price_period)}
						</p>
						<p className="text-xs text-slate-500">
							Assigned Agent: <strong className="text-slate-800">{agentProfile?.full_name ?? "Verified Partner"}</strong>
						</p>
					</div>
				</div>
			</div>

			{/* Progress Stepper Tabs */}
			<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
				<button
					type="button"
					onClick={() => setActiveStepTab("inspection")}
					className={`flex flex-col rounded-xl border p-3 text-left transition ${
						activeStepTab === "inspection"
							? "border-slate-900 bg-slate-900 text-white"
							: isInspectionScheduled
								? "border-emerald-200 bg-emerald-50/60 text-slate-800"
								: "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
					}`}
				>
					<div className="flex items-center justify-between text-xs font-semibold">
						<span>Step 1</span>
						{isInspectionScheduled && <Check className="h-3.5 w-3.5 text-emerald-600" />}
					</div>
					<span className="mt-1 text-xs font-bold">1. Schedule Viewing</span>
					<span className={`text-[10px] ${activeStepTab === "inspection" ? "text-slate-300" : "text-slate-400"}`}>
						{booking.viewing_date ? "Inspection Set" : "Physical Booking"}
					</span>
				</button>

				<button
					type="button"
					onClick={() => setActiveStepTab("verification")}
					disabled={!isInspectionScheduled}
					className={`flex flex-col rounded-xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
						activeStepTab === "verification"
							? "border-slate-900 bg-slate-900 text-white"
							: isVerified
								? "border-emerald-200 bg-emerald-50/60 text-slate-800"
								: "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
					}`}
				>
					<div className="flex items-center justify-between text-xs font-semibold">
						<span>Step 2</span>
						{isVerified && <Check className="h-3.5 w-3.5 text-emerald-600" />}
					</div>
					<span className="mt-1 text-xs font-bold">2. House Inspection</span>
					<span className={`text-[10px] ${activeStepTab === "verification" ? "text-slate-300" : "text-slate-400"}`}>
						{booking.physical_verified ? "Verified In Person" : "Mandatory Check"}
					</span>
				</button>

				<button
					type="button"
					onClick={() => setActiveStepTab("payment")}
					disabled={!isVerified}
					className={`flex flex-col rounded-xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
						activeStepTab === "payment"
							? "border-slate-900 bg-slate-900 text-white"
							: isPaid
								? "border-emerald-200 bg-emerald-50/60 text-slate-800"
								: "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
					}`}
				>
					<div className="flex items-center justify-between text-xs font-semibold">
						<span>Step 3</span>
						{isPaid && <Check className="h-3.5 w-3.5 text-emerald-600" />}
					</div>
					<span className="mt-1 text-xs font-bold">3. Secure Payment</span>
					<span className={`text-[10px] ${activeStepTab === "payment" ? "text-slate-300" : "text-slate-400"}`}>
						{isPaid ? "Paid in Full" : "Escrow Settlement"}
					</span>
				</button>

				<button
					type="button"
					onClick={() => setActiveStepTab("completed")}
					disabled={!isPaid}
					className={`flex flex-col rounded-xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
						activeStepTab === "completed"
							? "border-emerald-700 bg-emerald-700 text-white"
							: isPaid
								? "border-emerald-200 bg-emerald-50 text-emerald-800"
								: "border-slate-200 bg-white text-slate-600"
					}`}
				>
					<div className="flex items-center justify-between text-xs font-semibold">
						<span>Step 4</span>
						{isPaid && <CheckCircle2 className="h-3.5 w-3.5" />}
					</div>
					<span className="mt-1 text-xs font-bold">4. Tenancy Active</span>
					<span className={`text-[10px] ${activeStepTab === "completed" ? "text-emerald-100" : "text-slate-400"}`}>
						Agreement & Keys
					</span>
				</button>
			</div>

			{errorMessage && (
				<div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
					<AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
					<span>{errorMessage}</span>
				</div>
			)}

			{/* ================= STEP 1: SCHEDULE VIEWING ================= */}
			{activeStepTab === "inspection" && (
				<div className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
					<div>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
							<Calendar className="h-3.5 w-3.5" />
							Stage 1: Schedule House Inspection
						</span>
						<h2 className="mt-2 text-base sm:text-lg font-bold text-slate-900">
							Book Your Physical Inspection
						</h2>
						<p className="mt-1 text-xs sm:text-sm text-slate-500">
							Before any payments or legal commitment, HomeScout requires all tenants to inspect the property in person with the verified representative.
						</p>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label className="block text-xs font-bold text-slate-700">
								Select Preferred Inspection Date
							</label>
							<input
								type="date"
								min={tomorrowStr}
								value={selectedDate}
								onChange={(e) => setSelectedDate(e.target.value)}
								className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-slate-400 focus:bg-white focus:outline-none"
							/>
							<p className="mt-1 text-[11px] text-slate-400">
								Inspections are open Mondays through Saturdays.
							</p>
						</div>

						<div>
							<label className="block text-xs font-bold text-slate-700">
								Preferred Time Window
							</label>
							<div className="mt-1.5 grid grid-cols-3 gap-2">
								{["10:00 AM", "01:30 PM", "04:30 PM"].map((slot) => (
									<button
										key={slot}
										type="button"
										onClick={() => setSelectedTimeSlot(slot)}
										className={`cursor-pointer rounded-xl border py-2 text-center text-xs font-semibold transition ${
											selectedTimeSlot === slot
												? "border-slate-900 bg-slate-900 text-white"
												: "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
										}`}
									>
										{slot}
									</button>
								))}
							</div>
						</div>
					</div>

					<div>
						<label className="block text-xs font-bold text-slate-700">
							Special Instructions or Questions for Agent (Optional)
						</label>
						<textarea
							rows={3}
							value={inspectionNotes}
							onChange={(e) => setInspectionNotes(e.target.value)}
							placeholder="e.g. I will be coming with my spouse; please ensure the master bedroom and water supply can be demonstrated."
							className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
						/>
					</div>

					<div className="flex items-center justify-between border-t border-slate-100 pt-4">
						<Link
							href={partnerChatUrl}
							className="text-xs font-semibold text-slate-500 hover:text-slate-800"
						>
							Need to discuss custom timing? Message Agent
						</Link>

						<button
							type="button"
							onClick={handleScheduleInspection}
							disabled={isPending}
							className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-brand-600 disabled:opacity-50"
						>
							<span>{booking.viewing_date ? "Update Inspection Date" : "Confirm Inspection Date"}</span>
							<ArrowRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}

			{/* ================= STEP 2: PHYSICAL INSPECTION & MANDATORY SAFETY VERIFICATION ================= */}
			{activeStepTab === "verification" && (
				<div className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
					<div>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
							<ShieldAlert className="h-3.5 w-3.5" />
							Stage 2: Physical Inspection & Safety Verification
						</span>
						<h2 className="mt-2 text-base sm:text-lg font-bold text-slate-900">
							Inspect the House Before Payment
						</h2>
						<p className="mt-1 text-xs sm:text-sm text-slate-500">
							Inspection scheduled for:{" "}
							<strong className="text-slate-900">
								{booking.viewing_date
									? new Date(booking.viewing_date).toLocaleDateString("en-NG", {
											weekday: "long",
											year: "numeric",
											month: "short",
											day: "numeric",
										})
									: selectedDate}
							</strong>
						</p>
					</div>

					{/* ── CRUCIAL NOTICE MESSAGE BOX ── */}
					<div className="rounded-2xl border-2 border-rose-300 bg-rose-50/70 p-4 sm:p-5">
						<div className="flex items-start gap-3">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
								<AlertTriangle className="h-5 w-5" />
							</div>
							<div className="space-y-1.5">
								<h3 className="text-xs sm:text-sm font-bold tracking-tight text-rose-950">
									CRITICAL SAFETY NOTICE: IMPLICATION OF NOT TAKING PHYSICAL VERIFICATION BEFORE PAYMENT
								</h3>
								<p className="text-xs leading-relaxed text-rose-900">
									Paying for any residential or commercial property before physically inspecting the unit in person carries extreme financial and legal risks.
								</p>
								<ul className="list-disc pl-4 space-y-1 text-[11.5px] leading-relaxed text-rose-800 font-medium">
									<li>
										<strong>Phantom Listings & Fraud:</strong> Scammers may advertise vacant properties they do not own or possess legal rights to rent.
									</li>
									<li>
										<strong>Hidden Structural Defects:</strong> Water pressure issues, faulty electrical wiring, leaking ceilings, pest infestation, and severe dampness cannot be assessed through photographs alone.
									</li>
									<li>
										<strong>Neighborhood Realities:</strong> Access road conditions, noise levels, security guard presence, and flood vulnerability must be verified on-site.
									</li>
									<li>
										<strong>Protection Policy:</strong> HomeScout strictly requires physical confirmation. Making payments prior to on-site physical inspection will waive mediation claims for preexisting defects.
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* ── MANDATORY CHECKLIST ── */}
					<div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
						<div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
							<p className="text-xs font-bold text-slate-900">
								Mandatory Confirmation Checklist
							</p>
							<span className="text-[11px] font-semibold text-slate-500">
								{Object.values(checklist).filter(Boolean).length} of 4 Confirmed
							</span>
						</div>

						<label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 border border-slate-200/80 transition hover:border-slate-300">
							<input
								type="checkbox"
								checked={checklist.visitedInPerson}
								onChange={(e) =>
									setChecklist((prev) => ({
										...prev,
										visitedInPerson: e.target.checked,
									}))
								}
								className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
							/>
							<div className="text-xs">
								<span className="font-bold text-slate-800">
									1. On-Site Physical Inspection Conducted
								</span>
								<p className="mt-0.5 text-slate-500 leading-relaxed">
									I confirm that I have physically visited and inspected the property in person (or conducted an authorized live real-time video inspection with the verified agent).
								</p>
							</div>
						</label>

						<label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 border border-slate-200/80 transition hover:border-slate-300">
							<input
								type="checkbox"
								checked={checklist.utilitiesAndConditionChecked}
								onChange={(e) =>
									setChecklist((prev) => ({
										...prev,
										utilitiesAndConditionChecked: e.target.checked,
									}))
								}
								className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
							/>
							<div className="text-xs">
								<span className="font-bold text-slate-800">
									2. Interior Condition, Water, & Utilities Verified
								</span>
								<p className="mt-0.5 text-slate-500 leading-relaxed">
									I have tested the water flow, electrical points, ceiling, toilet fittings, locks, and room dimensions, and I am satisfied with their functional condition.
								</p>
							</div>
						</label>

						<label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 border border-slate-200/80 transition hover:border-slate-300">
							<input
								type="checkbox"
								checked={checklist.representativeAndTermsVerified}
								onChange={(e) =>
									setChecklist((prev) => ({
										...prev,
										representativeAndTermsVerified: e.target.checked,
									}))
								}
								className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
							/>
							<div className="text-xs">
								<span className="font-bold text-slate-800">
									3. Agent Authorization & Tenancy Terms Agreed
								</span>
								<p className="mt-0.5 text-slate-500 leading-relaxed">
									I have verified that the agent/landlord possesses legitimate authority to lease this unit, and I agree to the stated rent, caution deposit, and agreement terms.
								</p>
							</div>
						</label>

						<label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 border border-slate-200/80 transition hover:border-slate-300">
							<input
								type="checkbox"
								checked={checklist.risksAcknowledged}
								onChange={(e) =>
									setChecklist((prev) => ({
										...prev,
										risksAcknowledged: e.target.checked,
									}))
								}
								className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
							/>
							<div className="text-xs">
								<span className="font-bold text-slate-800">
									4. Risk Acknowledgment & Consent to Unlock Payment
								</span>
								<p className="mt-0.5 text-slate-500 leading-relaxed">
									I have read the critical safety notice, understand the implications of non-inspection, and confirm that I have verified everything before unlocking payment.
								</p>
							</div>
						</label>
					</div>

					{/* ── ACTION FOOTER ── */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 pt-4">
						<div className="flex items-center gap-2 text-xs text-slate-500">
							{allChecklistConfirmed ? (
								<span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
									<CheckCircle2 className="h-4 w-4 text-emerald-600" />
									All confirmations verified. Payment unlocked.
								</span>
							) : (
								<span className="inline-flex items-center gap-1 text-slate-400">
									<Lock className="h-3.5 w-3.5" />
									Confirm all 4 checklist points above to unlock payment.
								</span>
							)}
						</div>

						<button
							type="button"
							onClick={handleConfirmVerification}
							disabled={!allChecklistConfirmed || isPending}
							className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
								allChecklistConfirmed
									? "bg-brand-700 text-white hover:bg-brand-600 shadow-xs"
									: "cursor-not-allowed bg-slate-200 text-slate-400"
							}`}
						>
							<Lock className={`h-3.5 w-3.5 ${allChecklistConfirmed ? "hidden" : "inline"}`} />
							<span>{booking.physical_verified ? "Continue to Payment" : "Confirm Verification & Unlock Payment"}</span>
							<ArrowRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}

			{/* ================= STEP 3: SECURE PAYMENT ================= */}
			{activeStepTab === "payment" && (
				<div className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
					<div>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
							<ShieldCheck className="h-3.5 w-3.5" />
							Stage 3: Secure Tenancy Escrow Payment
						</span>
						<h2 className="mt-2 text-base sm:text-lg font-bold text-slate-900">
							Finalize Your Payment & Lease
						</h2>
						<p className="mt-1 text-xs sm:text-sm text-slate-500">
							Physical inspection confirmed on{" "}
							{booking.physical_verified_at
								? new Date(booking.physical_verified_at).toLocaleDateString("en-NG", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})
								: "today"}
							. Funds are held in verified escrow until move-in keys are handed over.
						</p>
					</div>

					{/* Cost Breakdown */}
					<div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
						<h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
							Payment Summary
						</h3>

						<div className="mt-3 space-y-2.5 divide-y divide-slate-200/70 text-xs text-slate-600">
							<div className="flex justify-between pt-1">
								<span>Base Rent ({booking.price_period?.replace(/_/g, " ")})</span>
								<span className="font-bold text-slate-900">₦{propPrice.toLocaleString()}</span>
							</div>
							<div className="flex justify-between pt-2">
								<div>
									<span>Caution Deposit (10%)</span>
									<p className="text-[10px] text-slate-400">100% Refundable upon move-out inspection</p>
								</div>
								<span className="font-bold text-slate-900">₦{cautionDeposit.toLocaleString()}</span>
							</div>
							<div className="flex justify-between pt-2">
								<div>
									<span>Legal & Tenancy Agreement (5%)</span>
									<p className="text-[10px] text-slate-400">Official notarized lease documentation</p>
								</div>
								<span className="font-bold text-slate-900">₦{legalFee.toLocaleString()}</span>
							</div>
							<div className="flex justify-between pt-2">
								<div>
									<span>HomeScout Service & Verification Fee</span>
									<p className="text-[10px] text-slate-400">Covers escrow mediation & verified badge</p>
								</div>
								<span className="font-bold text-slate-900">₦{serviceFee.toLocaleString()}</span>
							</div>
							<div className="flex justify-between pt-3 text-sm font-bold text-slate-900">
								<span>Total Move-in Commitment</span>
								<span className="text-base text-brand-700">₦{totalDue.toLocaleString()}</span>
							</div>
						</div>
					</div>

					{/* Payment Method Selector */}
					<div>
						<label className="block text-xs font-bold text-slate-700 mb-2">
							Choose Payment Channel
						</label>
						<div className="grid gap-2.5 sm:grid-cols-3">
							{[
								{ id: "card", label: "Debit / Credit Card", sub: "Mastercard, Visa, Verve" },
								{ id: "bank_transfer", label: "Instant Bank Transfer", sub: "Dedicated Escrow Virtual Account" },
								{ id: "paystack", label: "Paystack Checkout", sub: "USSD, QR, Bank App" },
							].map((pm) => (
								<button
									key={pm.id}
									type="button"
									onClick={() => setPaymentMethod(pm.id)}
									className={`cursor-pointer rounded-xl border p-3 text-left transition ${
										paymentMethod === pm.id
											? "border-slate-900 bg-slate-900 text-white"
											: "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
									}`}
								>
									<p className="text-xs font-bold">{pm.label}</p>
									<p className={`mt-0.5 text-[10px] ${paymentMethod === pm.id ? "text-slate-300" : "text-slate-400"}`}>
										{pm.sub}
									</p>
								</button>
							))}
						</div>
					</div>

					<div className="flex items-center justify-between border-t border-slate-100 pt-4">
						<button
							type="button"
							onClick={() => setActiveStepTab("verification")}
							className="text-xs font-semibold text-slate-500 hover:text-slate-800"
						>
							← Back to Verification
						</button>

						<button
							type="button"
							onClick={handleCompletePayment}
							disabled={isPending}
							className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-700 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-brand-600 shadow-xs disabled:opacity-50"
						>
							{isPending ? (
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
							) : (
								<ShieldCheck className="h-4 w-4" />
							)}
							<span>Pay ₦{totalDue.toLocaleString()} (Escrow Secured)</span>
						</button>
					</div>
				</div>
			)}

			{/* ================= STEP 4: TENANCY COMPLETED ================= */}
			{activeStepTab === "completed" && (
				<div className="space-y-5 rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8 text-center shadow-xs">
					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
						<CheckCircle2 className="h-8 w-8" />
					</div>

					<div>
						<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
							Tenancy Secured & Active
						</span>
						<h2 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
							Congratulations! Your Home is Booked
						</h2>
						<p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
							Payment confirmed and property status updated to <strong className="text-slate-900">Rented</strong>. Your verified agreement has been registered.
						</p>
					</div>

					<div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-left text-xs space-y-2">
						<div className="flex justify-between border-b border-slate-200/70 pb-2">
							<span className="text-slate-500">Transaction Reference:</span>
							<span className="font-mono font-bold text-slate-800">{paidReference || booking.payment_reference || "HS-CONFIRMED"}</span>
						</div>
						<div className="flex justify-between border-b border-slate-200/70 pb-2">
							<span className="text-slate-500">Property:</span>
							<span className="font-bold text-slate-800">{booking.property?.title}</span>
						</div>
						<div className="flex justify-between border-b border-slate-200/70 pb-2">
							<span className="text-slate-500">Physical Inspection:</span>
							<span className="font-semibold text-emerald-700">Verified & Approved</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500">Listing Status:</span>
							<span className="font-bold text-blue-700">Rented (Closed)</span>
						</div>
					</div>

					<div className="flex flex-wrap items-center justify-center gap-3 pt-2">
						<Link
							href={partnerChatUrl}
							className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
						>
							<MessageSquare className="h-4 w-4" />
							<span>Message Landlord / Agent</span>
						</Link>

						<Link
							href="/client/applications"
							className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
						>
							<Home className="h-4 w-4" />
							<span>View All Applications</span>
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}

