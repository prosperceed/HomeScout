import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export type PropertyRow = Tables<"property_listings">;
export type BookingRow = Tables<"bookings">;
export type ProfileRow = Tables<"profiles">;
export type AgentProfileRow = Tables<"agent_profiles">;
export type MessageRow = Tables<"messages">;
export type NotificationRow = Tables<"notifications">;

export type PropertyWithOwner = PropertyRow & {
  owner: Pick<ProfileRow, "id" | "full_name" | "avatar_url"> | null;
  agent: Pick<AgentProfileRow, "id" | "agency_name" | "verified_agent"> | null;
};

export type BookingWithProperty = BookingRow & {
  property: Pick<PropertyRow, "id" | "title" | "formatted_address" | "state" | "images" | "type" | "price" | "price_period"> | null;
  agent_profile: Pick<ProfileRow, "id" | "full_name" | "avatar_url"> | null;
  client_profile: Pick<ProfileRow, "id" | "full_name" | "avatar_url" | "phone" | "email"> | null;
};

export type PropertyFilter = {
  state?: string;
  listing_tag?: string;
  type?: string;
  price_min?: number;
  price_max?: number;
  bedrooms_min?: number;
  is_featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
};

export async function getProperties(filter: PropertyFilter = {}): Promise<PropertyWithOwner[]> {
  const supabase = await createClient();
  let query = supabase
    .from("property_listings")
    .select(`
      *,
      owner:profiles!property_listings_owner_id_fkey ( id, full_name, avatar_url ),
      agent:agent_profiles!property_listings_agent_id_fkey ( id, agency_name, verified_agent )
    `)
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (filter.state)        query = query.eq("state", filter.state);
  if (filter.listing_tag)  query = query.eq("listing_tag", filter.listing_tag as never);
  if (filter.type)         query = query.eq("type", filter.type as never);
  if (filter.price_min)    query = query.gte("price", filter.price_min);
  if (filter.price_max)    query = query.lte("price", filter.price_max);
  if (filter.bedrooms_min) query = query.gte("bedrooms", filter.bedrooms_min);
  if (filter.is_featured)  query = query.eq("is_featured", true);
  if (filter.search) {
    query = query.or(`title.ilike.%${filter.search}%,formatted_address.ilike.%${filter.search}%,state.ilike.%${filter.search}%`);
  }
  if (filter.limit)  query = query.limit(filter.limit);
  if (filter.offset) query = query.range(filter.offset, filter.offset + (filter.limit ?? 20) - 1);

  const { data, error } = await query;
  if (error) { console.error("getProperties:", error.message); return []; }
  return (data ?? []) as unknown as PropertyWithOwner[];
}

export async function getPropertyById(id: string): Promise<PropertyWithOwner | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_listings")
    .select(`
      *,
      owner:profiles!property_listings_owner_id_fkey ( id, full_name, avatar_url ),
      agent:agent_profiles!property_listings_agent_id_fkey ( id, agency_name, verified_agent )
    `)
    .eq("id", id)
    .single();

  if (error) { console.error("getPropertyById:", error.message); return null; }
  return data as unknown as PropertyWithOwner;
}

export async function getAgentProperties(agentId: string): Promise<PropertyRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_listings")
    .select("*")
    .or(`owner_id.eq.${agentId},agent_id.eq.${agentId}`)
    .order("created_at", { ascending: false });

  if (error) { console.error("getAgentProperties:", error.message); return []; }
  return data ?? [];
}

export async function getLandlordProperties(landlordId: string): Promise<PropertyRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_listings")
    .select("*")
    .eq("owner_id", landlordId)
    .order("created_at", { ascending: false });

  if (error) { console.error("getLandlordProperties:", error.message); return []; }
  return data ?? [];
}

export async function getAgentStats(agentId: string) {
  const supabase = await createClient();

  const [listingsRes, bookingsRes, agentRes] = await Promise.all([
    supabase
      .from("property_listings")
      .select("id, status")
      .or(`owner_id.eq.${agentId},agent_id.eq.${agentId}`),
    supabase
      .from("bookings")
      .select("id, status, price_at_booking, created_at")
      .eq("agent_id", agentId),
    supabase
      .from("agent_profiles")
      .select("managed_listings_count, agency_name, verified_agent")
      .eq("id", agentId)
      .single(),
  ]);

  const listings = listingsRes.data ?? [];
  const bookings = bookingsRes.data ?? [];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  const thisMonthBookings = bookings.filter((b) => b.created_at >= monthStart);
  const lastMonthBookings = bookings.filter((b) => b.created_at >= prevMonthStart && b.created_at < monthStart);

  const completedBookings = bookings.filter((b) => b.status === "completed");
  const revenue = completedBookings.reduce((sum, b) => sum + (b.price_at_booking ?? 0), 0);
  const activeClients = new Set(bookings.filter((b) => ["pending", "approved", "viewing"].includes(b.status)).map((b) => b.id)).size;

  return {
    totalListings: listings.length,
    activeListings: listings.filter((l) => l.status === "available").length,
    closedDeals: completedBookings.length,
    totalRevenue: revenue,
    activeClients,
    thisMonthBookings: thisMonthBookings.length,
    lastMonthBookings: lastMonthBookings.length,
    agentInfo: agentRes.data,
  };
}

export async function getAgentBookings(agentId: string, limit?: number): Promise<BookingWithProperty[]> {
  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select(`
      *,
      property:property_listings ( id, title, formatted_address, state, images, type, price, price_period ),
      agent_profile:profiles!bookings_agent_id_fkey ( id, full_name, avatar_url ),
      client_profile:profiles!bookings_client_id_fkey ( id, full_name, avatar_url, phone, email )
    `)
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) { console.error("getAgentBookings:", error.message); return []; }
  return (data ?? []) as unknown as BookingWithProperty[];
}

export async function getClientBookings(clientId: string): Promise<BookingWithProperty[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      property:property_listings ( id, title, formatted_address, state, images, type, price, price_period ),
      agent_profile:profiles!bookings_agent_id_fkey ( id, full_name, avatar_url ),
      client_profile:profiles!bookings_client_id_fkey ( id, full_name, avatar_url )
    `)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) { console.error("getClientBookings:", error.message); return []; }
  return (data ?? []) as unknown as BookingWithProperty[];
}

export async function getClientStats(clientId: string) {
  const supabase = await createClient();

  const [savedRes, bookingsRes, messagesRes] = await Promise.all([
    supabase.from("saved_properties").select("id").eq("client_id", clientId),
    supabase.from("bookings").select("id, status").eq("client_id", clientId),
    supabase.from("messages").select("id, is_read").eq("recipient_id", clientId),
  ]);

  const bookings = bookingsRes.data ?? [];
  const messages = messagesRes.data ?? [];

  return {
    savedCount: (savedRes.data ?? []).length,
    applicationsCount: bookings.length,
    shortlistedCount: bookings.filter((b) => b.status === "approved").length,
    unreadMessages: messages.filter((m) => !m.is_read).length,
    totalMessages: messages.length,
  };
}

export async function getLandlordTenants(landlordId: string): Promise<BookingWithProperty[]> {
  const supabase = await createClient();
  const { data: props } = await supabase
    .from("property_listings")
    .select("id")
    .eq("owner_id", landlordId);

  const propIds = props?.map((p) => p.id) ?? [];
  if (propIds.length === 0) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      property:property_listings ( id, title, formatted_address, state, images, type, price, price_period ),
      agent_profile:profiles!bookings_agent_id_fkey ( id, full_name, avatar_url ),
      client_profile:profiles!bookings_client_id_fkey ( id, full_name, avatar_url, phone, email )
    `)
    .in("property_id", propIds)
    .order("created_at", { ascending: false });

  if (error) { console.error("getLandlordTenants:", error.message); return []; }
  return (data ?? []) as unknown as BookingWithProperty[];
}

export async function getLandlordStats(landlordId: string) {
  const supabase = await createClient();

  const [listingsRes, bookingsRes] = await Promise.all([
    supabase.from("property_listings").select("id, status").eq("owner_id", landlordId),
    supabase.from("bookings")
      .select("id, status, property_id")
      .in(
        "property_id",
        (await supabase.from("property_listings").select("id").eq("owner_id", landlordId)).data?.map((p) => p.id) ?? []
      ),
  ]);

  const listings = listingsRes.data ?? [];
  const bookings = bookingsRes.data ?? [];

  return {
    totalListings: listings.length,
    activeListings: listings.filter((l) => l.status === "available").length,
    rentedUnits: listings.filter((l) => l.status === "rented").length,
    pendingRequests: bookings.filter((b) => b.status === "pending").length,
  };
}

export async function getSavedProperties(clientId: string): Promise<PropertyRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_properties")
    .select("property:property_listings(*)")
    .eq("client_id", clientId)
    .order("saved_at", { ascending: false });

  if (error) { console.error("getSavedProperties:", error.message); return []; }
  return (data ?? []).map((row: unknown) => (row as { property: PropertyRow }).property).filter(Boolean);
}

export async function toggleSaveProperty(clientId: string, propertyId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("saved_properties")
    .select("id")
    .eq("client_id", clientId)
    .eq("property_id", propertyId)
    .maybeSingle();

  if (existing) {
    await supabase.from("saved_properties").delete().eq("id", existing.id);
    return false;
  } else {
    await supabase.from("saved_properties").insert({ client_id: clientId, property_id: propertyId });
    return true;
  }
}

export async function createBooking(payload: {
  property_id: string;
  client_id: string;
  agent_id: string | null;
  message?: string;
  price_at_booking: number;
  price_period: string;
}): Promise<BookingRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      property_id: payload.property_id,
      client_id: payload.client_id,
      agent_id: payload.agent_id,
      message: payload.message ?? null,
      price_at_booking: payload.price_at_booking,
      price_period: payload.price_period as never,
    })
    .select()
    .single();

  if (error) { console.error("createBooking:", error.message); return null; }
  return data;
}

export async function updateBookingStatus(
  bookingId: string,
  status: Tables<"bookings">["status"]
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  if (error) { console.error("updateBookingStatus:", error.message); return false; }
  return true;
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) return 0;
  return count ?? 0;
}
