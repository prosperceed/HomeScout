"use server";

import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function password() {
	return `Hs-${randomBytes(10).toString("base64url")}9!`;
}

export async function createAdminUserAction(input: { name: string; email: string }) {
	const supabase = await createClient();
	const { data: { user: actor } } = await supabase.auth.getUser();
	if (!actor) return { success: false, error: "Authentication required" };
	const { data: actorProfile } = await supabase.from("profiles").select("role").eq("id", actor.id).single();
	if (actorProfile?.role !== "admin") return { success: false, error: "Admin access required" };
	if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL_FROM) return { success: false, error: "Configure RESEND_API_KEY and ADMIN_EMAIL_FROM before creating admin accounts." };

	const generatedPassword = password();
	const admin = createAdminClient();
	const { data: created, error } = await admin.auth.admin.createUser({
		email: input.email.trim().toLowerCase(),
		password: generatedPassword,
		email_confirm: true,
		user_metadata: { full_name: input.name.trim(), role: "admin" },
	});
	if (error || !created.user) return { success: false, error: error?.message ?? "Unable to create admin" };

	const emailResponse = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
		body: JSON.stringify({
			from: process.env.ADMIN_EMAIL_FROM,
			to: [input.email.trim().toLowerCase()],
			subject: "Your HomeScout admin access",
			text: `Hello ${input.name.trim()},\n\nYour HomeScout admin account is ready.\nEmail: ${input.email.trim().toLowerCase()}\nTemporary password: ${generatedPassword}\n\nSign in at ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://homescout.ng"}/login and change this password immediately.`,
		}),
	});
	if (!emailResponse.ok) {
		await admin.auth.admin.deleteUser(created.user.id);
		return { success: false, error: "Admin account was not created because the access email could not be sent." };
	}
	return { success: true };
}
