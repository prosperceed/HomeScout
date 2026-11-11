"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
	ArrowRight,
	Building2,
	Calendar,
	CheckCircle2,
	Clock,
	Compass,
	Eye,
	Filter,
	Home,
	Lock,
	MapPin,
	MessageSquare,
	Phone,
	Search,
	ShieldAlert,
	ShieldCheck,
	X,
} from "lucide-react";
import type { BookingWithProperty } from "@/lib/supabase/queries";
import { ClientApplicationStageFlow } from "./ClientApplicationStageFlow";

interface ClientApplicationsViewProps {
	bookings: BookingWithProperty[];
}

function formatPrice(n: number, period?: string | null) {
	const val = `₦${Number(n || 0).toLocaleString("en-NG")}`;
	const p =
		period === "per_year"
			? "/yr"
			: period === "per_month"
				? "/mo"
				: period === "per_night"
					? "/night"
					: "";
	return `${val}${p}`;
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

export function ClientApplicationsView({ bookings }: ClientApplicationsViewProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "viewing" | "approved" | "completed">("all");
	const [activeBookingForFlow, setActiveBookingForFlow] = useState<BookingWithProperty | null>(null);

	const counts = useMemo(() => {
		return {
			all: bookings.length,
			pending: bookings.filter((b) => b.status === "pending").length,
			viewing: bookings.filter((b) => b.status === "viewing").length,
			approved: bookings.filter((b) => b.status === "approved" || b.physical_verified).length,
			completed: bookings.filter((b) => b.status === "completed").length,
		};
	}, [bookings]);

	const filteredBookings = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return bookings.filter((b) => {
			if (statusFilter !== "all" && b.status !== statusFilter) {
				return false;
			}
			if (!q) return true;
			const title = b.property?.title?.toLowerCase() ?? "";
			const addr = b.property?.formatted_address?.toLowerCase() ?? "";
			const agent = b.agent_profile?.full_name?.toLowerCase() ?? "";
			return title.includes(q) || addr.includes(q) || agent.includes(q);
		});
	}, [bookings, searchQuery, statusFilter]);

	return (
		<div className="space-y-6">
			{/* Flow Modal overlay if an active application is selected for inline flow */}
			{activeBookingForFlow && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
					<div className="relative w-full max-w-4xl my-auto rounded-3xl bg-white p-4 sm:p-6 shadow-2xl">
						<button
							type="button"
							onClick={() => setActiveBookingForFlow(null)}
							aria-label="Close flow"
							className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
						>
							<X className="h-4 w-4" />
						</button>
						<ClientApplicationStageFlow
							booking={activeBookingForFlow}
							onBack={() => setActiveBookingForFlow(null)}
							isModal
						/>
					</div>
				</div>
			)}

			{/* Top Header */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs font-bold uppercase tracking-wider text-slate-400">
						Client Dashboard
					</p>
					<h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-[-0.04em] text-slate-900">
						Applications & Booking Journey
					</h1>
					<p className="mt-0.5 text-xs sm:text-sm text-slate-500">
						Track your housing requests from chat inquiry through physical verification to move-in.
					</p>
				</div>

				<Link
					href="/explore"
					className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 shadow-xs"
				>
					<Compass className="h-4 w-4" />
					<span>Explore More Properties</span>
				</Link>
			</div>

			{/* Metric Badges */}
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<div className="rounded-2xl border border-slate-200/90 bg-white p-4">
					<div className="flex items-center justify-between text-xs font-semibold text-slate-400">
						<span>Total Requests</span>
						<Building2 className="h-4 w-4 text-slate-400" />
					</div>
					<p className="mt-2 text-2xl font-black text-slate-900">{counts.all}</p>
					<p className="mt-0.5 text-[11px] text-slate-400">Referenced properties</p>
				</div>

				<div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
					<div className="flex items-center justify-between text-xs font-semibold text-amber-700">
						<span>Under Review</span>
						<Clock className="h-4 w-4 text-amber-500" />
					</div>
					<p className="mt-2 text-2xl font-black text-amber-900">{counts.pending}</p>
					<p className="mt-0.5 text-[11px] text-amber-700">Awaiting booking</p>
				</div>

				<div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4">
					<div className="flex items-center justify-between text-xs font-semibold text-teal-700">
						<span>Inspection Set</span>
						<Calendar className="h-4 w-4 text-teal-500" />
					</div>
					<p className="mt-2 text-2xl font-black text-teal-900">{counts.viewing}</p>
					<p className="mt-0.5 text-[11px] text-teal-700">Physical viewing</p>
				</div>

				<div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
					<div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
						<span>Secured / Paid</span>
						<ShieldCheck className="h-4 w-4 text-emerald-500" />
					</div>
					<p className="mt-2 text-2xl font-black text-emerald-900">{counts.completed}</p>
					<p className="mt-0.5 text-[11px] text-emerald-700">Tenancies finalized</p>
				</div>
			</div>

			{/* Filter & Search Bar */}
			<div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between shadow-xs">
				<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
					{[
						{ id: "all", label: `All (${counts.all})` },
						{ id: "pending", label: `Under Review (${counts.pending})` },
						{ id: "viewing", label: `Viewing Set (${counts.viewing})` },
						{ id: "approved", label: `Verified (${counts.approved})` },
						{ id: "completed", label: `Completed (${counts.completed})` },
					].map((tab) => {
						const active = statusFilter === tab.id;
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
								className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition ${
									active
										? "bg-slate-900 text-white"
										: "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
								}`}
							>
								{tab.label}
							</button>
						);
					})}
				</div>

				<div className="relative sm:w-64">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search applications..."
						className="h-8.5 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
					/>
				</div>
			</div>

			{/* Applications List */}
			{filteredBookings.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
						<Building2 className="h-6 w-6" />
					</div>
					<h3 className="mt-3 text-sm sm:text-base font-bold text-slate-900">
						{bookings.length === 0
							? "No active property applications yet"
							: "No applications match your filter"}
					</h3>
					<p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
						{bookings.length === 0
							? "Start a chat on any verified listing to reference the property and unlock physical inspection booking."
							: "Try switching filter tabs or clearing your search term."}
					</p>
					{bookings.length === 0 && (
						<Link
							href="/explore"
							className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-600"
						>
							<Compass className="h-4 w-4" />
							<span>Find Homes to Book</span>
						</Link>
					)}
				</div>
			) : (
				<div className="space-y-4">
					{filteredBookings.map((b) => {
						const isPaid = b.status === "completed";
						const isVerified = Boolean(b.physical_verified || b.status === "approved") && !isPaid;
						const isViewing = b.status === "viewing" && !isVerified && !isPaid;
						const isPending = b.status === "pending" && !isViewing && !isVerified && !isPaid;

						const partnerChatUrl = `/client/messages?recipient=${b.agent_id || ""}&property=${b.property_id}`;

						return (
							<div
								key={b.id}
								className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 transition hover:border-slate-300 shadow-xs"
							>
								<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
									{/* Property Core Info */}
									<div className="flex items-start gap-3 sm:gap-4 min-w-0">
										<div className="h-20 w-24 sm:h-24 sm:w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={getThumbnail(b.property?.images)}
												alt={b.property?.title ?? "Home"}
												className="h-full w-full object-cover"
											/>
										</div>

										<div className="min-w-0">
											<div className="flex flex-wrap items-center gap-2">
												<span className="rounded-md bg-stone-100 px-2 py-0.5 text-[9.5px] font-bold uppercase text-slate-700">
													{b.property?.type?.replace(/_/g, " ") ?? "Apartment"}
												</span>

												{isPending && (
													<span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-200">
														Under Review
													</span>
												)}
												{isViewing && (
													<span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-800 ring-1 ring-teal-200">
														Inspection Scheduled
													</span>
												)}
												{isVerified && (
													<span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 ring-1 ring-blue-200">
														Physical Inspection Verified
													</span>
												)}
												{isPaid && (
													<span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 ring-1 ring-emerald-200">
														Tenancy Active (Rented)
													</span>
												)}
											</div>

											<h3 className="mt-1 truncate text-sm sm:text-base font-bold text-slate-900">
												{b.property?.title}
											</h3>

											<p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
												<MapPin className="h-3 w-3 shrink-0 text-slate-400" />
												<span className="truncate">
													{b.property?.formatted_address ?? b.property?.state ?? "Nigeria"}
												</span>
											</p>

											<div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
												<span>
													Rent: <strong className="font-bold text-slate-900">{formatPrice(b.price_at_booking, b.price_period)}</strong>
												</span>
												<span className="text-slate-300">•</span>
												<span>
													Agent: <strong className="font-semibold text-slate-800">{b.agent_profile?.full_name ?? "Assigned Representative"}</strong>
												</span>
												{b.viewing_date && (
													<>
														<span className="text-slate-300">•</span>
														<span className="text-teal-700 font-semibold flex items-center gap-1">
															<Calendar className="h-3 w-3" />
															{new Date(b.viewing_date).toLocaleDateString("en-NG", {
																month: "short",
																day: "numeric",
															})}
														</span>
													</>
												)}
											</div>
										</div>
									</div>

									{/* Stage Tracking & Action Buttons */}
									<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
										<Link
											href={partnerChatUrl}
											className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
										>
											<MessageSquare className="h-3.5 w-3.5 text-slate-400" />
											<span>Message Agent</span>
										</Link>

										{/* Primary Dynamic Action Button */}
										{isPending && (
											<button
												type="button"
												onClick={() => setActiveBookingForFlow(b)}
												className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-600 shadow-xs"
											>
												<span>Book this</span>
												<ArrowRight className="h-3.5 w-3.5" />
											</button>
										)}

										{isViewing && (
											<button
												type="button"
												onClick={() => setActiveBookingForFlow(b)}
												className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-600 shadow-xs"
											>
												<ShieldAlert className="h-3.5 w-3.5" />
												<span>Verify Physical Inspection</span>
											</button>
										)}

										{isVerified && (
											<button
												type="button"
												onClick={() => setActiveBookingForFlow(b)}
												className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-600 shadow-xs"
											>
												<ShieldCheck className="h-3.5 w-3.5" />
												<span>Proceed to Payment</span>
											</button>
										)}

										{isPaid && (
											<button
												type="button"
												onClick={() => setActiveBookingForFlow(b)}
												className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
											>
												<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
												<span>View Receipt</span>
											</button>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

