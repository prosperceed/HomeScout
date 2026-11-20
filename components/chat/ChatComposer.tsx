"use client";

import { useRef, useState } from "react";
import {
	Calendar,
	CheckCircle2,
	FileText,
	SendHorizontal,
	X,
} from "lucide-react";
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
	const [showSnippets, setShowSnippets] = useState(true);
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
		el.style.height = `${Math.min(el.scrollHeight, 130)}px`;
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
		<div className="shrink-0 border-t border-slate-200/80 bg-white px-3 py-2.5 sm:px-6 sm:py-3">
			<div className="mx-auto max-w-3xl">
				{showSnippets && (
					<div className="mb-2 flex items-center justify-between gap-2 overflow-x-auto pb-0.5 no-scrollbar">
						<div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
							<span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
								Prompts:
							</span>
							{quickSnippets.map((item) => {
								const Icon = item.icon;
								return (
									<button
										key={item.label}
										type="button"
										onClick={() => insertSnippet(item.text)}
										className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-slate-200/80 bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
									>
										<Icon className="h-2.5 w-2.5 text-slate-400" />
										<span>{item.label}</span>
									</button>
								);
							})}
						</div>

						<button
							type="button"
							onClick={() => setShowSnippets(false)}
							title="Hide quick prompts"
							aria-label="Hide quick prompts"
							className="shrink-0 cursor-pointer rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
						>
							<X className="h-3 w-3" />
						</button>
					</div>
				)}

				<div className="relative rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xs transition focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-900/5">
					<div className="flex items-end gap-2">
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
							placeholder={`Write a message to ${partnerName.split(" ")[0]}...`}
							className="max-h-[130px] min-h-[36px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[13px] leading-5 text-slate-900 placeholder:text-slate-400 focus:outline-none"
						/>

						<div className="flex shrink-0 items-center gap-1.5 pb-0.5">
							{draft.length > 1600 && (
								<span className="text-[10px] font-medium text-slate-400 tabular-nums">
									{2000 - draft.length}
								</span>
							)}
							<button
								type="button"
								onClick={handleSubmit}
								disabled={!draft.trim() || isSending}
								aria-label="Send message"
								className={`flex h-8 w-8 sm:h-8.5 sm:w-8.5 cursor-pointer items-center justify-center rounded-xl transition disabled:cursor-not-allowed disabled:opacity-35 ${sendButtonClass}`}
							>
								<SendHorizontal className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>

				<div className="mt-1 hidden sm:flex items-center justify-between px-2 text-[10.5px] text-slate-400">
					<span>Return to send, Shift + Return for new line</span>
					{!showSnippets && (
						<button
							type="button"
							onClick={() => setShowSnippets(true)}
							className="cursor-pointer transition hover:text-slate-600 hover:underline underline-offset-2"
						>
							Show suggestions
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
