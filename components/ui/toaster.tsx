"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
	CheckCircle2,
	Info,
	AlertTriangle,
	XCircle,
	Loader2,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme="light"
			position="top-center"
			duration={4000}
			gap={7}
			offset="16px"
			icons={{
				success: (
					<CheckCircle2
						style={{ width: 16, height: 16, color: "#10b981", flexShrink: 0 }}
					/>
				),
				info: (
					<Info
						style={{ width: 16, height: 16, color: "#0ea5e9", flexShrink: 0 }}
					/>
				),
				warning: (
					<AlertTriangle
						style={{ width: 16, height: 16, color: "#f59e0b", flexShrink: 0 }}
					/>
				),
				error: (
					<XCircle
						style={{ width: 16, height: 16, color: "#f43f5e", flexShrink: 0 }}
					/>
				),
				loading: (
					<Loader2
						style={{ width: 16, height: 16, color: "#94a3b8", flexShrink: 0 }}
						className="animate-spin"
					/>
				),
			}}
			toastOptions={{
				classNames: {
					toast:
						"!bg-[#f3f4f6] !border-0 !rounded-2xl !shadow-[0_2px_12px_rgba(0,0,0,0.07)] !px-4 !py-2 !gap-2.5 !items-center !min-w-[220px] !max-w-[400px] !w-auto",
					title:
						"!text-[13px] !font-semibold !text-slate-800 !leading-none !m-0",
					description:
						"!text-[11.5px] !text-slate-500 !mt-1 !font-normal !leading-snug",
					icon: "!m-0 !p-0 !w-4 !h-4 !self-center !shrink-0",
					closeButton: "!hidden",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
