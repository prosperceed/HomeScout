export type UserRole = "client" | "landlord" | "agent" | "admin";

export type PropertyType =
	| "student_lodge"
	| "family_apartment"
	| "shared_flat"
	| "single_room"
	| "duplex"
	| "villa"
	| "short_let";

export type ListingTag = "for_sale" | "for_rent" | "shortlet";

export type PropertyStatus =
	| "available"
	| "rented"
	| "under_review"
	| "inactive";
export type VerificationStatus =
	| "unverified"
	| "pending"
	| "verified"
	| "rejected";
export type FeeType = "percentage" | "flat";

// ─── User Profiles ────────────────────────────────────────────────────────────

export interface BaseUser {
	id: string;
	email: string;
	full_name: string;
	phone?: string;
	avatar_url?: string;
	role: UserRole;
	verification_status: VerificationStatus;
	created_at: string;
	updated_at: string;
}

export interface ClientProfile extends BaseUser {
	role: "client";
	target_state?: string;
	target_locality?: string;
	preferred_property_types: PropertyType[];
	budget_min?: number;
	budget_max?: number;
	saved_properties: string[];
}

export interface LandlordProfile extends BaseUser {
	role: "landlord";
	property_count: number;
	identity_verified: boolean;
	bank_details_added: boolean;
	nin_or_passport?: string;
}

export interface AgentProfile extends BaseUser {
	role: "agent";
	agency_name?: string;
	license_number: string;
	fee_type: FeeType;
	fee_value: number; // percentage (e.g. 10) or flat (e.g. 50000)
	managed_listings: string[];
	verified_agent: boolean;
}

export interface AdminProfile extends BaseUser {
	role: "admin";
	permissions: AdminPermission[];
}

export type AdminPermission =
	| "manage_users"
	| "manage_listings"
	| "handle_disputes"
	| "verify_identities"
	| "view_analytics";

export type AnyUserProfile =
	| ClientProfile
	| LandlordProfile
	| AgentProfile
	| AdminProfile;

// ─── Property Listings ────────────────────────────────────────────────────────

export interface GeoLocation {
	lat: number;
	lng: number;
	formatted_address: string;
	state: string;
	local_government: string;
	city?: string;
}

export interface PropertyImage {
	id: string;
	url: string;
	alt: string;
	is_cover: boolean;
}

export interface PropertyListing {
	id: string;
	title: string;
	description: string;
	type: PropertyType;
	status: PropertyStatus;
	price: number;
	price_period: "per_month" | "per_year" | "per_night";
	listing_tag: ListingTag;
	bedrooms: number;
	bathrooms: number;
	area_sqft?: number;
	images: PropertyImage[];
	location: GeoLocation;
	amenities: string[];
	is_verified: boolean;
	is_featured: boolean;
	owner_id: string;
	owner_type: "landlord" | "agent";
	agent_id?: string;
	views_count: number;
	created_at: string;
	updated_at: string;
}

// ─── Search & Filter ──────────────────────────────────────────────────────────

export interface PropertySearchFilters {
	query?: string;
	state?: string;
	locality?: string;
	type?: PropertyType;
	price_min?: number;
	price_max?: number;
	bedrooms?: number;
	is_verified?: boolean;
}

// ─── Registration Flow ────────────────────────────────────────────────────────

export interface RegistrationStep1 {
	role: UserRole;
}

export interface ClientRegistrationData {
	target_state: string;
	target_locality: string;
	preferred_property_types: PropertyType[];
	budget_max: number;
}

export interface LandlordRegistrationData {
	property_count: number;
	identity_verification_ready: boolean;
}

export interface AgentRegistrationData {
	agency_name: string;
	license_number: string;
	fee_type: FeeType;
	fee_value: number;
}

export interface RegistrationCredentials {
	full_name: string;
	email: string;
	password: string;
	phone: string;
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export interface NavItem {
	label: string;
	href: string;
	icon?: string;
}

export interface StatItem {
	value: string;
	label: string;
}
