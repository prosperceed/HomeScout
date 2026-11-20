"use client";

import Link from "next/link";
import {
	ArrowLeft,
	ExternalLink,
	MapPin,
	PanelRight,
	PanelRightClose,
	Phone,
	ShieldCheck,
} from "lucide-react";
import {
	formatChatPrice,
	type ChatConversation,
	type UserRole,
} from "@/lib/chat/types";

interface ChatThreadHeaderProps {
	conversation: ChatConversation;
	isOnline: boolean;
	isTyping: boolean;
	showContextPanel: boolean;
	onToggleContextPanel: () => void;
	onBackToList: () => void;
}

const roleBadgeStyles: Record<UserRole, { label: string; classes: string }> = {
	agent: {
		label: "Agent",
		classes: "bg-blue-50 text-blue-700 border border-blue-200/80",
	},
	landlord: {
		label: "Landlord",
		classes: "bg-teal-50 text-teal-700 border border-teal-200/80",
	},
	client: {
		label: "Client",
		classes: "bg-sage-50 text-sage-700 border border-sage-200/80",
	},
	admin: {
		label: "Support",
		classes: "bg-slate-100 text-slate-700 border border-slate-200",
	},
};

function getInitials(name: string): string {
	return (
		name
			.trim()
			.split(/\s+/)
			.map((part) => part[0])
			.slice(0, 2)
			.join("")
			.toUpperCase() || "HS"
	);
}

export function ChatThreadHeader({
	conversation,
	isOnline,
	isTyping,
	showContextPanel,
	onToggleContextPanel,
	onBackToList,
}: ChatThreadHeaderProps) {
	const { partner, property } = conversation;
	const roleBadge = roleBadgeStyles[partner.role] ?? roleBadgeStyles.client;

	return (
		<header className="shrink-0 border-b border-slate-200/80 bg-white">
			<div className="flex h-15 sm:h-16 items-center justify-between gap-2 px-3 sm:px-6">
				<div className="flex min-w-0 items-center gap-2 sm:gap-3">
					<button
						type="button"
						onClick={onBackToList}
						aria-label="Back to conversations"
						className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 text-slate-600 transition hover:bg-slate-50 md:hidden"
					>
						<ArrowLeft className="h-4 w-4" />
					</button>

					<div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0">
						{partner.avatar_url ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={partner.avatar_url}
								alt={partner.full_name}
								className="h-full w-full rounded-xl border border-slate-200/80 object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100 text-[11px] sm:text-xs font-black text-slate-700">
								{getInitials(partner.full_name)}
							</div>
						)}
						<span
							className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-white ${
								isOnline ? "bg-emerald-500" : "bg-slate-300"
							}`}
						/>
					</div>

					<div className="min-w-0">
						<div className="flex items-center gap-1.5 sm:gap-2">
							<h3 className="truncate max-w-[125px] xs:max-w-[170px] sm:max-w-[240px] md:max-w-none text-xs sm:text-[13px] font-bold tracking-tight text-slate-900">
								{partner.full_name}
							</h3>
							{partner.verification_status === "verified" && (
								<ShieldCheck className="h-3.5 w-3.5 shrink-0 text-sage-600" />
							)}
							<span
								className={`hidden xs:inline-flex shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${roleBadge.classes}`}
							>
								{roleBadge.label}
							</span>
						</div>

						<div className="mt-0.5 flex items-center gap-1 text-[10px] sm:text-[11px]">
							{isTyping ? (
								<span className="font-semibold text-emerald-600">
									Typing...
								</span>
							) : isOnline ? (
								<span className="font-medium text-emerald-600">
									Active now
								</span>
							) : (
								<span className="text-slate-400">
									Direct message
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
					{partner.phone && (
						<a
							href={`tel:${partner.phone}`}
							className="inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-2.5 sm:px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
							title={`Call ${partner.phone}`}
						>
							<Phone className="h-3.5 w-3.5 text-slate-500" />
							<span className="hidden sm:inline">Call</span>
						</a>
					)}

					<button
						type="button"
						onClick={onToggleContextPanel}
						aria-label={showContextPanel ? "Collapse details panel" : "Expand details panel"}
						className={`inline-flex h-8 sm:h-9 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2.5 sm:px-3 text-xs font-semibold transition ${
							showContextPanel
								? "border-slate-900 bg-slate-900 text-white"
								: "border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50"
						}`}
					>
						{showContextPanel ? (
							<PanelRightClose className="h-3.5 w-3.5" />
						) : (
							<PanelRight className="h-3.5 w-3.5" />
						)}
						<span className="hidden sm:inline">
							{showContextPanel ? "Close" : "Details"}
						</span>
					</button>
				</div>
			</div>

			{property && (
				<div className="flex items-center justify-between gap-2 sm:gap-3 border-t border-slate-100 bg-stone-50/80 px-3 py-2 sm:px-6 sm:py-2.5">
					<div className="flex min-w-0 items-center gap-2 sm:gap-3">
						<div className="h-8 w-10 sm:h-9 sm:w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={property.thumbnail}
								alt={property.title}
								className="h-full w-full object-cover"
								onError={(e) => {
									(e.target as HTMLImageElement).src = "/assets/house1.jpeg";
								}}
							/>
						</div>
						<div className="min-w-0">
							<div className="flex items-center gap-1.5 sm:gap-2">
								<span className="truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none text-[11px] sm:text-xs font-semibold text-slate-900">
									{property.title}
								</span>
								<span className="shrink-0 rounded bg-white px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-slate-800 border border-slate-200/80">
									{formatChatPrice(property.price, property.price_period)}
								</span>
							</div>
							<p className="mt-0.5 flex items-center gap-1 truncate text-[10px] sm:text-[11px] text-slate-500">
								<MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 text-slate-400" />
								<span className="truncate">
									{property.formatted_address ?? property.state ?? "Nigeria"}
								</span>
							</p>
						</div>
					</div>

					<Link
						href={`/property/${property.id}`}
						className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 sm:px-2.5 sm:py-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
					>
						<span className="hidden xs:inline">Listing</span>
						<ExternalLink className="h-3 w-3" />
					</Link>
				</div>
			)}
		</header>
	);
}
