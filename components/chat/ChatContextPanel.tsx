"use client";

import Link from "next/link";
import {
	Bath,
	Bed,
	Building2,
	ExternalLink,
	Mail,
	MapPin,
	Phone,
	ShieldCheck,
	X,
} from "lucide-react";
import {
	formatChatPrice,
	type ChatConversation,
	type UserRole,
} from "@/lib/chat/types";

interface ChatContextPanelProps {
	conversation: ChatConversation;
	isOnline: boolean;
	onClose: () => void;
}

const roleLabels: Record<UserRole, string> = {
	agent: "Licensed Property Agent",
	landlord: "Verified Property Owner",
	client: "Prospective Tenant / Buyer",
	admin: "HomeScout Support",
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

export function ChatContextPanel({
	conversation,
	isOnline,
	onClose,
}: ChatContextPanelProps) {
	const { partner, property } = conversation;

	return (
		<aside className="flex h-full w-full flex-col bg-white">
			<div className="flex h-15 sm:h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4 sm:px-5">
				<h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
					Conversation Context
				</h3>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close context panel"
					className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
				>
					<X className="h-4 w-4" />
				</button>
			</div>

			<div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
				<div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 text-center">
					<div className="relative mx-auto h-12 w-12 sm:h-13 sm:w-13">
						{partner.avatar_url ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={partner.avatar_url}
								alt={partner.full_name}
								className="h-full w-full rounded-2xl border border-slate-200 object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-800">
								{getInitials(partner.full_name)}
							</div>
						)}
						<span
							className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 border-white ${
								isOnline ? "bg-emerald-500" : "bg-slate-300"
							}`}
						/>
					</div>

					<h4 className="mt-2.5 text-[13px] font-bold tracking-tight text-slate-900">
						{partner.full_name}
					</h4>
					<p className="mt-0.5 text-[11px] font-medium text-slate-500">
						{roleLabels[partner.role] ?? "HomeScout Member"}
					</p>

					{partner.verification_status === "verified" && (
						<div className="mt-2 inline-flex items-center gap-1 rounded-full border border-sage-200 bg-sage-50 px-2 py-0.5 text-[9.5px] font-semibold text-sage-700">
							<ShieldCheck className="h-3 w-3" />
							<span>Identity Verified</span>
						</div>
					)}

					<div className="mt-3.5 space-y-1 border-t border-slate-200/70 pt-2.5 text-left text-xs">
						{partner.email && (
							<a
								href={`mailto:${partner.email}`}
								className="flex items-center gap-2 rounded-xl px-2 py-1 text-slate-600 transition hover:bg-white hover:text-slate-900"
							>
								<Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
								<span className="truncate text-[11.5px] font-medium">{partner.email}</span>
							</a>
						)}
						{partner.phone && (
							<a
								href={`tel:${partner.phone}`}
								className="flex items-center gap-2 rounded-xl px-2 py-1 text-slate-600 transition hover:bg-white hover:text-slate-900"
							>
								<Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
								<span className="truncate text-[11.5px] font-medium">{partner.phone}</span>
							</a>
						)}
					</div>
				</div>

				{property ? (
					<div className="space-y-2">
						<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
							Referenced Property
						</p>
						<div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
							<div className="relative aspect-[16/10] w-full bg-slate-100">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={property.thumbnail}
									alt={property.title}
									className="h-full w-full object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src = "/assets/house1.jpeg";
									}}
								/>
								<span className="absolute left-2.5 top-2.5 rounded-lg bg-slate-900/80 px-2 py-0.5 text-[9.5px] font-bold uppercase text-white backdrop-blur-sm">
									{property.listing_tag.replace(/_/g, " ")}
								</span>
							</div>

							<div className="p-3 sm:p-3.5">
								<p className="text-[13px] font-bold text-slate-900">
									{formatChatPrice(property.price, property.price_period)}
								</p>
								<h5 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-slate-800">
									{property.title}
								</h5>
								<p className="mt-1 flex items-center gap-1 text-[10.5px] text-slate-500">
									<MapPin className="h-3 w-3 shrink-0 text-slate-400" />
									<span className="truncate">
										{property.formatted_address ?? property.state ?? "Nigeria"}
									</span>
								</p>

								{(property.bedrooms !== undefined ||
									property.bathrooms !== undefined) && (
									<div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-2 text-[10.5px] font-medium text-slate-600">
										<span className="inline-flex items-center gap-1">
											<Bed className="h-3.5 w-3.5 text-slate-400" />
											{property.bedrooms ?? 0} bed
										</span>
										<span className="inline-flex items-center gap-1">
											<Bath className="h-3.5 w-3.5 text-slate-400" />
											{property.bathrooms ?? 0} bath
										</span>
									</div>
								)}

								<Link
									href={`/property/${property.id}`}
									className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
								>
									<span>Open Full Listing</span>
									<ExternalLink className="h-3.5 w-3.5" />
								</Link>

								<Link
									href="/client/applications"
									className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-700 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600 shadow-2xs"
								>
									<span>Track Application / Book</span>
								</Link>
							</div>
						</div>
					</div>
				) : (
					<div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center">
						<Building2 className="mx-auto h-5 w-5 text-slate-300" />
						<p className="mt-2 text-xs font-semibold text-slate-700">
							Direct Conversation
						</p>
						<p className="mt-0.5 text-[11px] text-slate-400">
							Not attached to a specific property listing.
						</p>
					</div>
				)}

				<div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3 sm:p-3.5">
					<p className="text-[11px] font-semibold text-slate-700">
						HomeScout Security
					</p>
					<p className="mt-0.5 text-[10.5px] leading-relaxed text-slate-500">
						Always verify property identity in person before making any financial commitment.
					</p>
				</div>
			</div>
		</aside>
	);
}
