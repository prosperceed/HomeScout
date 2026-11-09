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
		<aside className="flex h-full w-full flex-col border-l border-slate-200/80 bg-white lg:w-80">
			<div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-5">
				<h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
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

			<div className="flex-1 overflow-y-auto p-5 space-y-6">
				<div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 text-center">
					<div className="relative mx-auto h-14 w-14">
						{partner.avatar_url ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={partner.avatar_url}
								alt={partner.full_name}
								className="h-14 w-14 rounded-2xl border border-slate-200 object-cover"
							/>
						) : (
							<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-base font-black text-slate-800">
								{getInitials(partner.full_name)}
							</div>
						)}
						<span
							className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
								isOnline ? "bg-emerald-500" : "bg-slate-300"
							}`}
						/>
					</div>

					<h4 className="mt-3 text-sm font-black tracking-[-0.02em] text-slate-900">
						{partner.full_name}
					</h4>
					<p className="mt-0.5 text-xs font-medium text-slate-500">
						{roleLabels[partner.role] ?? "HomeScout Member"}
					</p>

					{partner.verification_status === "verified" && (
						<div className="mt-2.5 inline-flex items-center gap-1 rounded-full border border-sage-200 bg-sage-50 px-2.5 py-0.5 text-[10px] font-bold text-sage-700">
							<ShieldCheck className="h-3 w-3" />
							<span>Identity Verified</span>
						</div>
					)}

					<div className="mt-4 space-y-2 border-t border-slate-200/70 pt-3 text-left text-xs">
						{partner.email && (
							<a
								href={`mailto:${partner.email}`}
								className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-slate-600 transition hover:bg-white hover:text-slate-900"
							>
								<Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
								<span className="truncate font-medium">{partner.email}</span>
							</a>
						)}
						{partner.phone && (
							<a
								href={`tel:${partner.phone}`}
								className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-slate-600 transition hover:bg-white hover:text-slate-900"
							>
								<Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
								<span className="truncate font-medium">{partner.phone}</span>
							</a>
						)}
					</div>
				</div>

				{property ? (
					<div className="space-y-3">
						<p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
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
								<span className="absolute left-2.5 top-2.5 rounded-lg bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
									{property.listing_tag.replace(/_/g, " ")}
								</span>
							</div>

							<div className="p-4">
								<p className="text-sm font-black text-slate-900">
									{formatChatPrice(property.price, property.price_period)}
								</p>
								<h5 className="mt-1 line-clamp-2 text-xs font-bold leading-snug text-slate-800">
									{property.title}
								</h5>
								<p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
									<MapPin className="h-3 w-3 shrink-0" />
									<span className="truncate">
										{property.formatted_address ?? property.state ?? "Nigeria"}
									</span>
								</p>

								{(property.bedrooms !== undefined ||
									property.bathrooms !== undefined) && (
									<div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-2.5 text-[11px] font-semibold text-slate-600">
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
									className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
								>
									<span>Open Full Listing</span>
									<ExternalLink className="h-3.5 w-3.5" />
								</Link>
							</div>
						</div>
					</div>
				) : (
					<div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center">
						<Building2 className="mx-auto h-5 w-5 text-slate-300" />
						<p className="mt-2 text-xs font-bold text-slate-700">
							General Conversation
						</p>
						<p className="mt-0.5 text-[11px] text-slate-400">
							Not tied to a specific property listing yet.
						</p>
					</div>
				)}

				<div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3.5">
					<p className="text-[11px] font-bold text-slate-700">
						HomeScout Protection
					</p>
					<p className="mt-1 text-[11px] leading-relaxed text-slate-500">
						Always inspect properties in person before authorizing any rent or deposit transfer.
					</p>
				</div>
			</div>
		</aside>
	);
}

