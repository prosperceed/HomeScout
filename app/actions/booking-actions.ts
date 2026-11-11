"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ScheduleInspectionParams {
	bookingId: string;
	viewingDate: string;
	notes?: string;
}

export interface ConfirmPhysicalVerificationParams {
	bookingId: string;
	checklist: {
		visitedInPerson: boolean;
		utilitiesAndConditionChecked: boolean;
		representativeAndTermsVerified: boolean;
		risksAcknowledged: boolean;
	};
	notes?: string;
}

export interface CompleteBookingPaymentParams {
	bookingId: string;
	paymentMethod?: string;
}

export interface ReferencePropertyInquiryParams {
	propertyId: string;
	partnerId?: string | null;
}

export async function referencePropertyInquiryAction({
	propertyId,
	partnerId,
}: ReferencePropertyInquiryParams) {
	try {
		const authClient = await createClient();
		const {
			data: { user },
		} = await authClient.auth.getUser();

		if (!user) {
			return { success: false, error: "Authentication required" };
		}

		const admin = createAdminClient();

		// 1. Fetch property details
		const { data: prop, error: propErr } = await admin
			.from("property_listings")
			.select("id, title, price, price_period, agent_id, owner_id, status")
			.eq("id", propertyId)
			.single();

		if (propErr || !prop) {
			console.error("referencePropertyInquiryAction: property not found", propErr);
			return { success: false, error: "Property listing not found" };
		}

		// 2. Update property status to under_review if it is currently available
		if (prop.status === "available") {
			const { error: updatePropErr } = await admin
				.from("property_listings")
				.update({ status: "under_review" })
				.eq("id", propertyId);

			if (updatePropErr) {
				console.error("referencePropertyInquiryAction: failed to update status to under_review", updatePropErr);
			}
		}

		// 3. Determine client ID and agent/landlord ID
		const { data: myProfile } = await admin
			.from("profiles")
			.select("role")
			.eq("id", user.id)
			.single();

		const isClient = myProfile?.role === "client";
		const clientId = isClient ? user.id : partnerId || user.id;
		const targetAgentId = isClient
			? partnerId || prop.agent_id || prop.owner_id
			: user.id;

		// 4. Check if an active booking already exists for this client & property
		const { data: existingBooking } = await admin
			.from("bookings")
			.select("id, status, stage")
			.eq("property_id", propertyId)
			.eq("client_id", clientId)
			.not("status", "in", '("rejected","cancelled","completed")')
			.maybeSingle();

		if (existingBooking) {
			revalidatePath("/client/applications");
			revalidatePath("/client");
			revalidatePath("/agent/properties");
			revalidatePath("/agent/deals");
			revalidatePath("/landlord/properties");
			revalidatePath("/landlord/tenants");
			return { success: true, bookingId: existingBooking.id, status: existingBooking.status };
		}

		// 5. Create new booking record with status pending and stage inquiry
		const { data: newBooking, error: insertErr } = await admin
			.from("bookings")
			.insert({
				property_id: propertyId,
				client_id: clientId,
				agent_id: targetAgentId || prop.owner_id,
				status: "pending",
				price_at_booking: Number(prop.price) || 0,
				price_period: prop.price_period,
				stage: "inquiry",
			})
			.select("id")
			.single();

		if (insertErr) {
			console.error("referencePropertyInquiryAction: failed to insert booking", insertErr);
			return { success: false, error: insertErr.message };
		}

		// 6. Revalidate all relevant dashboards
		revalidatePath("/client/applications");
		revalidatePath("/client");
		revalidatePath("/agent/properties");
		revalidatePath("/agent/deals");
		revalidatePath("/landlord/properties");
		revalidatePath("/landlord/tenants");

		return { success: true, bookingId: newBooking?.id, status: "pending" };
	} catch (err) {
		console.error("referencePropertyInquiryAction error:", err);
		return { success: false, error: "Failed to reference property inquiry" };
	}
}

export async function scheduleInspectionAction({
	bookingId,
	viewingDate,
	notes,
}: ScheduleInspectionParams) {
	try {
		const authClient = await createClient();
		const {
			data: { user },
		} = await authClient.auth.getUser();

		if (!user) {
			return { success: false, error: "Authentication required" };
		}

		const admin = createAdminClient();

		const { error } = await admin
			.from("bookings")
			.update({
				status: "viewing",
				stage: "inspection",
				viewing_date: viewingDate,
				inspection_notes: notes || null,
			})
			.eq("id", bookingId);

		if (error) {
			console.error("scheduleInspectionAction error:", error);
			return { success: false, error: error.message };
		}

		revalidatePath("/client/applications");
		revalidatePath(`/client/applications/${bookingId}`);
		revalidatePath("/client");
		revalidatePath("/agent/deals");
		revalidatePath("/landlord/tenants");
		return { success: true };
	} catch (err) {
		console.error("scheduleInspectionAction error:", err);
		return { success: false, error: "Failed to schedule inspection" };
	}
}

export async function confirmPhysicalVerificationAction({
	bookingId,
	checklist,
	notes,
}: ConfirmPhysicalVerificationParams) {
	try {
		const authClient = await createClient();
		const {
			data: { user },
		} = await authClient.auth.getUser();

		if (!user) {
			return { success: false, error: "Authentication required" };
		}

		const allConfirmed =
			checklist.visitedInPerson &&
			checklist.utilitiesAndConditionChecked &&
			checklist.representativeAndTermsVerified &&
			checklist.risksAcknowledged;

		if (!allConfirmed) {
			return {
				success: false,
				error: "All physical verification checkboxes must be confirmed before proceeding.",
			};
		}

		const admin = createAdminClient();

		const { error } = await admin
			.from("bookings")
			.update({
				status: "approved",
				stage: "verified",
				physical_verified: true,
				physical_verified_at: new Date().toISOString(),
				verification_checklist: checklist,
				inspection_notes: notes || null,
			})
			.eq("id", bookingId);

		if (error) {
			console.error("confirmPhysicalVerificationAction error:", error);
			return { success: false, error: error.message };
		}

		revalidatePath("/client/applications");
		revalidatePath(`/client/applications/${bookingId}`);
		revalidatePath("/client");
		revalidatePath("/agent/deals");
		revalidatePath("/landlord/tenants");
		return { success: true };
	} catch (err) {
		console.error("confirmPhysicalVerificationAction error:", err);
		return { success: false, error: "Failed to confirm physical verification" };
	}
}

export async function completeBookingPaymentAction({
	bookingId,
	paymentMethod = "card",
}: CompleteBookingPaymentParams) {
	try {
		const authClient = await createClient();
		const {
			data: { user },
		} = await authClient.auth.getUser();

		if (!user) {
			return { success: false, error: "Authentication required" };
		}

		const admin = createAdminClient();

		const { data: booking, error: fetchErr } = await admin
			.from("bookings")
			.select("id, property_id, client_id, price_at_booking, physical_verified")
			.eq("id", bookingId)
			.single();

		if (fetchErr || !booking) {
			return { success: false, error: "Booking record not found" };
		}

		if (!booking.physical_verified) {
			return {
				success: false,
				error: "Physical inspection verification is strictly required before making payment.",
			};
		}

		const paymentRef = `HS-PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

		const { error: bookingUpdateErr } = await admin
			.from("bookings")
			.update({
				status: "completed",
				stage: "completed",
				payment_status: "paid",
				payment_reference: paymentRef,
				payment_amount: booking.price_at_booking,
				paid_at: new Date().toISOString(),
				payment_method: paymentMethod,
			})
			.eq("id", bookingId);

		if (bookingUpdateErr) {
			console.error("completeBookingPaymentAction booking error:", bookingUpdateErr);
			return { success: false, error: bookingUpdateErr.message };
		}

		// Update property listing to rented
		await admin
			.from("property_listings")
			.update({ status: "rented" })
			.eq("id", booking.property_id);

		revalidatePath("/client/applications");
		revalidatePath(`/client/applications/${bookingId}`);
		revalidatePath("/client");
		revalidatePath("/agent/properties");
		revalidatePath("/agent/deals");
		revalidatePath("/landlord/properties");
		revalidatePath("/landlord/tenants");
		return { success: true, paymentReference: paymentRef };
	} catch (err) {
		console.error("completeBookingPaymentAction error:", err);
		return { success: false, error: "Failed to complete payment" };
	}
}
