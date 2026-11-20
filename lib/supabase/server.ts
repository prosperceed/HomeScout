import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

export async function createClient() {
	// Supabase auth reads the clock (Date.now()) to check session expiry.
	// With Cache Components + Partial Prefetching, cookies can be available
	// during prerender, so we explicitly opt into request-time rendering
	// before touching the auth client.
	await connection();
	const cookieStore = await cookies();

	return createServerClient<any>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options),
						);
					} catch {
						// Server component — middleware handles session refresh
					}
				},
			},
		},
	);
}
