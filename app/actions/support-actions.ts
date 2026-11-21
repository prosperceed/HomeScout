"use server";

import { createClient } from "@/lib/supabase/server";

export async function createSupportTicketAction(input: { subject: string; body: string; category: string; priority: string }) {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return { success: false, error: "Authentication required" };
	if (!input.subject.trim() || !input.body.trim()) return { success: false, error: "Subject and message are required" };
	const { data: ticket, error } = await supabase.from("support_tickets").insert({ created_by: user.id, subject: input.subject.trim(), category: input.category, priority: input.priority }).select("id").single();
	if (error || !ticket) return { success: false, error: error?.message ?? "Unable to create support request" };
	const { error: messageError } = await supabase.from("support_messages").insert({ ticket_id: ticket.id, sender_id: user.id, body: input.body.trim() });
	return messageError ? { success: false, error: messageError.message } : { success: true, ticketId: ticket.id };
}

export async function sendSupportMessageAction(input: { ticketId: string; body: string }) {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return { success: false, error: "Authentication required" };
	if (!input.body.trim()) return { success: false, error: "Message cannot be empty" };
	const { error } = await supabase.from("support_messages").insert({ ticket_id: input.ticketId, sender_id: user.id, body: input.body.trim() });
	if (error) return { success: false, error: error.message };
	await supabase.from("support_tickets").update({ status: "open", updated_at: new Date().toISOString() }).eq("id", input.ticketId);
	return { success: true };
}
