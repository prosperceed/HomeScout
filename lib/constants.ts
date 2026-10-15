import type { PropertyType } from "@/types";

export const SITE_NAME = "HomeScout";
export const SITE_TAGLINE = "Find Your Space. Own Your Move.";
export const SITE_DESCRIPTION =
  "HomeScout connects tenants, landlords, and agents across Nigeria — with verified listings, GPS-precise locations, and zero broker confusion.";

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "student_lodge", label: "Student Lodge" },
  { value: "family_apartment", label: "Family Apartment" },
  { value: "shared_flat", label: "Shared Flat" },
  { value: "single_room", label: "Single Room" },
  { value: "duplex", label: "Duplex" },
  { value: "villa", label: "Villa" },
  { value: "short_let", label: "Short Let" },
];

export const PRICE_RANGES = [
  { label: "Under ₦100k/yr", min: 0, max: 100_000 },
  { label: "₦100k – ₦300k/yr", min: 100_000, max: 300_000 },
  { label: "₦300k – ₦600k/yr", min: 300_000, max: 600_000 },
  { label: "₦600k – ₦1.2M/yr", min: 600_000, max: 1_200_000 },
  { label: "₦1.2M+/yr", min: 1_200_000, max: Infinity },
];

export const DASHBOARD_ROUTES: Record<string, string> = {
  client: "/client",
  landlord: "/landlord",
  agent: "/agent",
  admin: "/admin",
};

export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
  callback: "/auth/callback",
};

export const AMENITIES = [
  "WiFi", "Parking", "Generator", "Security", "CCTV",
  "Water Supply", "Air Conditioning", "Furnished", "Kitchen",
  "Gym", "Swimming Pool", "Elevator", "Balcony", "Garden",
];

export const LISTING_TAGS: { value: string; label: string; color: string }[] = [
  { value: "for_sale",  label: "For Sale",  color: "bg-emerald-500" },
  { value: "for_rent",  label: "For Rent",  color: "bg-blue-500"    },
  { value: "shortlet",  label: "Shortlet",  color: "bg-violet-500"  },
];

export const PLATFORM_STATS = [
  { value: "12,400+", label: "Verified Listings" },
  { value: "8,200+", label: "Happy Tenants" },
  { value: "1,900+", label: "Registered Agents" },
  { value: "36", label: "States Covered" },
];
