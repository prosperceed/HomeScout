import posthog from "posthog-js";
import { createClient } from "@/lib/supabase/client";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (token && host) {
	posthog.init(token, {
		api_host: host,
		defaults: "2026-08-30",
		capture_exceptions: true,
		debug: process.env.NODE_ENV === "development",
	});

	let identifiedUserId: string | null = null;

	const identifyUser = (user: {
		id: string;
		email?: string;
		user_metadata?: Record<string, unknown>;
	}) => {
		if (identifiedUserId === user.id) return;

		if (identifiedUserId) posthog.reset();

		const properties: Record<string, string> = {};
		const fullName = user.user_metadata?.full_name;
		const role = user.user_metadata?.role;

		if (user.email) properties.email = user.email;
		if (typeof fullName === "string") properties.name = fullName;
		if (typeof role === "string") properties.role = role;

		posthog.identify(user.id, properties);
		identifiedUserId = user.id;
	};

	const supabase = createClient();

	void supabase.auth
		.getUser()
		.then(({ data: { user } }) => {
			if (user) identifyUser(user);
		})
		.catch(() => {});

	supabase.auth.onAuthStateChange((event, session) => {
		if (event === "SIGNED_OUT") {
			posthog.reset();
			identifiedUserId = null;
			return;
		}

		if (event === "SIGNED_IN" && session?.user) identifyUser(session.user);
	});
} else if (process.env.NODE_ENV === "development") {
	const missingVariable = token
		? "NEXT_PUBLIC_POSTHOG_HOST"
		: "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";

	throw new Error(
		`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
	);
}
