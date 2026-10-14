import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_HOME: Record<string, string> = {
	client: "/client",
	landlord: "/landlord",
	agent: "/agent",
	admin: "/admin",
};

const PROTECTED_PREFIXES: Record<string, string> = {
	"/agent": "agent",
	"/admin": "admin",
	"/landlord": "landlord",
	"/client": "client",
};

export async function middleware(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value)
					);
					supabaseResponse = NextResponse.next({ request });
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					);
				},
			},
		}
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { pathname } = request.nextUrl;

	const matchedPrefix = Object.keys(PROTECTED_PREFIXES).find((prefix) =>
		pathname.startsWith(prefix)
	);

	if (!matchedPrefix) {
		return supabaseResponse;
	}

	if (!user) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("next", pathname);
		return NextResponse.redirect(loginUrl);
	}

	const userRole =
		(user.user_metadata?.role as string | undefined) ??
		(user.app_metadata?.role as string | undefined) ??
		"client";

	const requiredRole = PROTECTED_PREFIXES[matchedPrefix];

	if (userRole !== requiredRole) {
		const correctHome = ROLE_HOME[userRole] ?? "/login";
		return NextResponse.redirect(new URL(correctHome, request.url));
	}

	return supabaseResponse;
}

export const config = {
	matcher: [
		"/client/:path*",
		"/landlord/:path*",
		"/agent/:path*",
		"/admin/:path*",
	],
};
