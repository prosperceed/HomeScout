import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DASHBOARD_ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types";

/**
 * Supabase auth callback handler.
 *
 * Supabase redirects here after:
 *  - Email confirmation on sign-up
 *  - Magic-link login
 *  - OAuth provider redirects
 *
 * The URL contains either:
 *  - `?code=<pkce_code>`  → exchange for a session
 *  - `?error=...`         → surface the error
 *
 * After a successful exchange we read the user's role from their
 * metadata and redirect them to the appropriate dashboard.
 */
export async function GET(request: NextRequest) {
	const { searchParams, origin } = new URL(request.url);

	const code = searchParams.get("code");
	const error = searchParams.get("error");
	const errorDescription = searchParams.get("error_description");

	// Surface Supabase errors back to the login page
	if (error) {
		const params = new URLSearchParams({
			error,
			...(errorDescription ? { error_description: errorDescription } : {}),
		});
		return NextResponse.redirect(`${origin}/login?${params.toString()}`);
	}

	if (!code) {
		// No code and no error — likely a direct navigation; send home
		return NextResponse.redirect(`${origin}/`);
	}

	const supabase = await createClient();

	const { data, error: exchangeError } =
		await supabase.auth.exchangeCodeForSession(code);

	if (exchangeError || !data.session) {
		const params = new URLSearchParams({
			error: "auth_callback_failed",
			error_description:
				exchangeError?.message ??
				"Could not complete sign-in. Please try again.",
		});
		return NextResponse.redirect(`${origin}/login?${params.toString()}`);
	}

	// Determine the destination from the user's role metadata
	const role = data.session.user.user_metadata?.role as UserRole | undefined;
	const destination =
		role && DASHBOARD_ROUTES[role] ? DASHBOARD_ROUTES[role] : "/"; // Fallback to home if role is missing

	return NextResponse.redirect(`${origin}${destination}`);
}
