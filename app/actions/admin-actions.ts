"use server";

import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) throw new Error("Authentication required");
	const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
	if (profile?.role !== "admin") throw new Error("Admin access required");
	return { admin: createAdminClient(), user };
}

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

export async function updateAdminUserAction(input: { id: string; role: string; verification_status: string }) {
	try {
		const { admin } = await requireAdmin();
		const { error } = await admin.from("profiles").update({ role: input.role, verification_status: input.verification_status, updated_at: new Date().toISOString() }).eq("id", input.id);
		return error ? { success: false, error: error.message } : { success: true };
	} catch (error) { return { success: false, error: error instanceof Error ? error.message : "Unable to update user" }; }
}

export async function deleteAdminUserAction(id: string) {
	try {
		const { admin } = await requireAdmin();
		const { error } = await admin.auth.admin.deleteUser(id);
		return error ? { success: false, error: error.message } : { success: true };
	} catch (error) { return { success: false, error: error instanceof Error ? error.message : "Unable to delete user" }; }
}

export async function updateAdminListingAction(input: { id: string; status: string; is_verified: boolean; is_featured: boolean }) {
	try {
		const { admin } = await requireAdmin();
		const { error } = await admin.from("property_listings").update({ status: input.status, is_verified: input.is_verified, is_featured: input.is_featured, updated_at: new Date().toISOString() }).eq("id", input.id);
		return error ? { success: false, error: error.message } : { success: true };
	} catch (error) { return { success: false, error: error instanceof Error ? error.message : "Unable to update listing" }; }
}

export async function deleteAdminListingAction(id: string) {
	try {
		const { admin } = await requireAdmin();
		const { error } = await admin.from("property_listings").delete().eq("id", id);
		return error ? { success: false, error: error.message } : { success: true };
	} catch (error) { return { success: false, error: error instanceof Error ? error.message : "Unable to delete listing" }; }
}

export async function updateAdminBookingAction(input: { id: string; status: string; escrow_status: string; admin_notes: string }) {
	try {
		const { admin, user } = await requireAdmin();
		const { error } = await admin.from("bookings").update({ status: input.status, escrow_status: input.escrow_status, admin_notes: input.admin_notes || null, reviewed_by: user.id, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", input.id);
		return error ? { success: false, error: error.message } : { success: true };
	} catch (error) { return { success: false, error: error instanceof Error ? error.message : "Unable to update booking" }; }
}

export async function replyToSupportTicketAction(input: { ticketId: string; body: string; status: string }) {
	try {
		const { admin, user } = await requireAdmin();
		if (!input.body.trim()) return { success: false, error: "Reply cannot be empty" };
		const { error: messageError } = await admin.from("support_messages").insert({ ticket_id: input.ticketId, sender_id: user.id, body: input.body.trim() });
		if (messageError) return { success: false, error: messageError.message };
		const { error } = await admin.from("support_tickets").update({ status: input.status, assigned_to: user.id, updated_at: new Date().toISOString() }).eq("id", input.ticketId);
		return error ? { success: false, error: error.message } : { success: true };
	} catch (error) { return { success: false, error: error instanceof Error ? error.message : "Unable to send reply" }; }
}

export async function updateSupportTicketAction(input: { id: string; status: string; priority: string }) {
	try {
		const { admin } = await requireAdmin();
		const { error } = await admin.from("support_tickets").update({ status: input.status, priority: input.priority, updated_at: new Date().toISOString() }).eq("id", input.id);
		return error ? { success: false, error: error.message } : { success: true };
	} catch (error) { return { success: false, error: error instanceof Error ? error.message : "Unable to update support ticket" }; }
}
