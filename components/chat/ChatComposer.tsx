"use client";

import { useRef, useState } from "react";
import { Calendar, CheckCircle2, FileText, SendHorizontal } from "lucide-react";
import type { UserRole } from "@/lib/chat/types";

interface ChatComposerProps {
	onSend: (text: string) => Promise<boolean>;
	onTyping: () => void;
	userRole: UserRole;
	partnerName: string;
	accentVariant?: "sage" | "blue" | "teal";
}

export function ChatComposer({
	onSend,
	onTyping,
	userRole,
	partnerName,
	accentVariant = "sage",
}: ChatComposerProps) {
	const [draft, setDraft] = useState("");
	const [isSending, setIsSending] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const sendButtonClass =
		accentVariant === "blue"
			? "bg-blue-600 hover:bg-blue-700 text-white"
			: accentVariant === "teal"
				? "bg-teal-600 hover:bg-teal-700 text-white"
				: "bg-brand-700 hover:bg-brand-600 text-white";

	const quickSnippets =
		userRole === "client"
			? [
					{
						label: "Schedule Viewing",
						icon: Calendar,
						text: "I would like to schedule an inspection for this property. What dates and times are open?",
					},
					{
						label: "Verify Availability",
						icon: CheckCircle2,
						text: "Could you confirm if this unit is still available for immediate move-in?",
					},
					{
						label: "Fee Breakdown",
						icon: FileText,
						text: "Please share the full payment breakdown including caution, legal, and service fees.",
					},
				]
			: [
					{
						label: "Confirm Viewing",
						icon: Calendar,
						text: "Inspection is open this week between 10:00 AM and 4:00 PM. Let me know what time works best for you.",
					},
					{
						label: "Unit Available",
						icon: CheckCircle2,
						text: "Yes, this property is available and ready for inspection.",
					},
					{
						label: "Share Terms",
						icon: FileText,
						text: "Standard lease is annual with transparent terms and zero hidden charges. Would you like to proceed?",
					},
				];

	const adjustHeight = () => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
	};

	const handleSubmit = async () => {
		const trimmed = draft.trim();
		if (!trimmed || isSending) return;

		setIsSending(true);
		const currentDraft = draft;
		setDraft("");
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}

		const ok = await onSend(trimmed);
		if (!ok) {
			setDraft(currentDraft);
		}
		setIsSending(false);
		textareaRef.current?.focus();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const insertSnippet = (text: string) => {
		setDraft((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
		onTyping();
		setTimeout(() => {
			adjustHeight();
			textareaRef.current?.focus();
		}, 10);
	};

	return (
		<div className="shrink-0 border-t border-slate-200/80 bg-white px-3 py-2 sm:px-6 sm:py-3">
			<div className="mx-auto max-w-3xl">
				<div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
					{quickSnippets.map((item) => {
						const Icon = item.icon;
						return (
							<button
								key={item.label}
								type="button"
								onClick={() => insertSnippet(item.text)}
								className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200/90 bg-slate-50/80 px-2 py-1 sm:px-2.5 text-[10px] sm:text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
							>
								<Icon className="h-3 w-3 text-slate-400" />
								<span>{item.label}</span>
							</button>
						);
					})}
				</div>

				<div className="flex items-end gap-2 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-1.5 sm:p-2 transition focus-within:border-slate-400 focus-within:bg-white">
					<textarea
						ref={textareaRef}
						rows={1}
						maxLength={2000}
						value={draft}
						onChange={(e) => {
							setDraft(e.target.value);
							adjustHeight();
							onTyping();
						}}
						onKeyDown={handleKeyDown}
						placeholder={`Message ${partnerName.split(" ")[0]}...`}
						className="max-h-[120px] min-h-[26px] sm:min-h-[28px] flex-1 resize-none bg-transparent px-2 py-1 text-sm sm:text-[13px] font-medium leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none"
					/>

					<div className="flex shrink-0 items-center gap-1 sm:gap-2">
						{draft.length > 1600 && (
							<span className="text-[10px] font-semibold text-slate-400">
								{2000 - draft.length}
							</span>
						)}
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!draft.trim() || isSending}
							aria-label="Send message"
							className={`flex h-8 w-8 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-xl transition disabled:cursor-not-allowed disabled:opacity-40 ${sendButtonClass}`}
						>
							<SendHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
