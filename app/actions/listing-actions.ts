"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface UpdateListingPayload {
  id: string;
  title?: string;
  description?: string | null;
  type?: string;
  price?: number;
  price_period?: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  formatted_address?: string | null;
  lat?: number | null;
  lng?: number | null;
  state?: string | null;
  local_government?: string | null;
  city?: string | null;
  listing_tag?: string;
}

/** Delete a property listing owned by the current user. Blocked when status = under_review. */
export async function deleteListingAction(listingId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) return { success: false, error: "Not authenticated." };

  // Fetch listing to verify ownership and status
  const { data: listing, error: fetchError } = await supabase
    .from("property_listings")
    .select("id, status, owner_id, agent_id")
    .eq("id", listingId)
    .single();

  if (fetchError || !listing) return { success: false, error: "Listing not found." };
  if (listing.owner_id !== userId && listing.agent_id !== userId) {
    return { success: false, error: "You do not have permission to delete this listing." };
  }
  if (listing.status === "under_review") {
    return { success: false, error: "This listing is under review and cannot be deleted." };
  }

  const { error: deleteError } = await supabase
    .from("property_listings")
    .delete()
    .eq("id", listingId);

  if (deleteError) return { success: false, error: deleteError.message };

  revalidatePath("/agent/properties");
  revalidatePath("/landlord/properties");
  return { success: true };
}

/** Update a property listing owned by the current user. Blocked when status = under_review. */
export async function updateListingAction(
  payload: UpdateListingPayload
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) return { success: false, error: "Not authenticated." };

  // Fetch listing to verify ownership and status
  const { data: listing, error: fetchError } = await supabase
    .from("property_listings")
    .select("id, status, owner_id, agent_id")
    .eq("id", payload.id)
    .single();

  if (fetchError || !listing) return { success: false, error: "Listing not found." };
  if (listing.owner_id !== userId && listing.agent_id !== userId) {
    return { success: false, error: "You do not have permission to edit this listing." };
  }
  if (listing.status === "under_review") {
    return { success: false, error: "This listing is under review and cannot be edited." };
  }

  const { id, ...fields } = payload;
  const { error: updateError } = await supabase
    .from("property_listings")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) return { success: false, error: updateError.message };

  revalidatePath("/agent/properties");
  revalidatePath("/landlord/properties");
  return { success: true };
}
