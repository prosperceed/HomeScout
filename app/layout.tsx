import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
	title: {
		default: `${SITE_NAME}. Find Your Space. Own Your Move.`,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	metadataBase: new URL("https://homescout.example"),
	keywords: [
		"rent",
		"property",
		"Nigeria",
		"landlord",
		"agent",
		"apartment",
		"lodge",
		"tenant",
	],
	openGraph: {
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		type: "website",
		locale: "en_NG",
	},
	twitter: {
		card: "summary_large_image",
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#0f172a",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
				/>
			</head>
			<body>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
