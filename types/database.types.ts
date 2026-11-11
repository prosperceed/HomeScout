export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					email: string;
					full_name: string;
					phone: string | null;
					avatar_url: string | null;
					role: "client" | "landlord" | "agent" | "admin";
					verification_status:
						| "unverified"
						| "pending"
						| "verified"
						| "rejected";
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<
					Database["public"]["Tables"]["profiles"]["Row"],
					"created_at" | "updated_at"
				>;
				Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
			};

			client_profiles: {
				Row: {
					id: string;
					target_state: string | null;
					target_locality: string | null;
					preferred_property_types: Database["public"]["Enums"]["property_type"][];
					budget_min: number | null;
					budget_max: number | null;
					saved_properties_count: number;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<
					Database["public"]["Tables"]["client_profiles"]["Row"],
					"saved_properties_count" | "created_at" | "updated_at"
				>;
				Update: Partial<
					Database["public"]["Tables"]["client_profiles"]["Insert"]
				>;
			};

			landlord_profiles: {
				Row: {
					id: string;
					property_count_range: "1" | "2-3" | "4-9" | "10+";
					identity_verified: boolean;
					identity_verification_ready: boolean;
					nin_or_passport_ref: string | null;
					bank_details_added: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<
					Database["public"]["Tables"]["landlord_profiles"]["Row"],
					"created_at" | "updated_at"
				>;
				Update: Partial<
					Database["public"]["Tables"]["landlord_profiles"]["Insert"]
				>;
			};

			agent_profiles: {
				Row: {
					id: string;
					agency_name: string | null;
					license_number: string;
					fee_type: "percentage" | "flat";
					fee_value: number;
					verified_agent: boolean;
					managed_listings_count: number;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<
					Database["public"]["Tables"]["agent_profiles"]["Row"],
					"managed_listings_count" | "created_at" | "updated_at"
				>;
				Update: Partial<
					Database["public"]["Tables"]["agent_profiles"]["Insert"]
				>;
			};

			identity_verifications: {
				Row: {
					id: string;
					user_id: string;
					document_type:
						| "nin"
						| "international_passport"
						| "drivers_license"
						| "voters_card";
					document_url: string;
					secondary_document_url: string | null;
					status: "unverified" | "pending" | "verified" | "rejected";
					reviewed_by: string | null;
					reviewed_at: string | null;
					admin_notes: string | null;
					submitted_at: string;
					updated_at: string;
				};
				Insert: Omit<
					Database["public"]["Tables"]["identity_verifications"]["Row"],
					"submitted_at" | "updated_at"
				>;
				Update: Partial<
					Database["public"]["Tables"]["identity_verifications"]["Insert"]
				>;
			};

			property_listings: {
				Row: {
					id: string;
					title: string;
					description: string | null;
					type: Database["public"]["Enums"]["property_type"];
					status: Database["public"]["Enums"]["property_status"];
					listing_tag: Database["public"]["Enums"]["listing_tag"];
					price: number;
					price_period: Database["public"]["Enums"]["price_period"];
					bedrooms: number;
					bathrooms: number;
					images: Json;
					amenities: string[];
					lat: number | null;
					lng: number | null;
					formatted_address: string | null;
					state: string | null;
					local_government: string | null;
					city: string | null;
					is_verified: boolean;
					is_featured: boolean;
					views_count: number;
					owner_id: string;
					owner_type: "landlord" | "agent";
					agent_id: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<
					Database["public"]["Tables"]["property_listings"]["Row"],
					"views_count" | "created_at" | "updated_at"
				>;
				Update: Partial<
					Database["public"]["Tables"]["property_listings"]["Insert"]
				>;
			};

			bookings: {
				Row: {
					id: string;
					property_id: string;
					client_id: string;
					agent_id: string | null;
					status: Database["public"]["Enums"]["booking_status"];
					stage?: string;
					physical_verified?: boolean;
					physical_verified_at?: string | null;
					verification_checklist?: Record<string, boolean> | null;
					payment_status?: string;
					payment_reference?: string | null;
					payment_amount?: number | null;
					paid_at?: string | null;
					payment_method?: string | null;
					inspection_notes?: string | null;
					message: string | null;
					viewing_date: string | null;
					move_in_date: string | null;
					price_at_booking: number;
					price_period: Database["public"]["Enums"]["price_period"];
					admin_notes: string | null;
					reviewed_by: string | null;
					reviewed_at: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<
					Database["public"]["Tables"]["bookings"]["Row"],
					"created_at" | "updated_at"
				>;
				Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
			};

			saved_properties: {
				Row: {
					id: string;
					client_id: string;
					property_id: string;
					saved_at: string;
				};
				Insert: Omit<
					Database["public"]["Tables"]["saved_properties"]["Row"],
					"id" | "saved_at"
				>;
				Update: never;
			};

			messages: {
				Row: {
					id: string;
					conversation_id?: string | null;
					booking_id: string | null;
					property_id: string | null;
					sender_id: string;
					recipient_id: string;
					body: string;
					is_read: boolean;
					read_at?: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					conversation_id?: string | null;
					booking_id?: string | null;
					property_id?: string | null;
					sender_id: string;
					recipient_id: string;
					body: string;
					is_read?: boolean;
					read_at?: string | null;
					created_at?: string;
				};
				Update: Partial<
					Pick<
						Database["public"]["Tables"]["messages"]["Row"],
						"is_read" | "read_at"
					>
				>;
			};

			conversations: {
				Row: {
					id: string;
					participant_one_id: string;
					participant_two_id: string;
					property_id: string | null;
					booking_id: string | null;
					last_message_id: string | null;
					last_message_body: string | null;
					last_message_sender_id: string | null;
					last_message_at: string;
					participant_one_unread: number;
					participant_two_unread: number;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<
					Database["public"]["Tables"]["conversations"]["Row"],
					"id" | "created_at" | "updated_at"
				>;
				Update: Partial<
					Database["public"]["Tables"]["conversations"]["Insert"]
				>;
			};

			message_attachments: {
				Row: {
					id: string;
					message_id: string;
					file_url: string;
					file_name: string;
					file_type: string;
					file_size: number | null;
					created_at: string;
				};
				Insert: Omit<
					Database["public"]["Tables"]["message_attachments"]["Row"],
					"id" | "created_at"
				>;
				Update: Partial<
					Database["public"]["Tables"]["message_attachments"]["Insert"]
				>;
			};

			notifications: {
				Row: {
					id: string;
					user_id: string;
					type: Database["public"]["Enums"]["notification_type"];
					title: string;
					body: string | null;
					is_read: boolean;
					reference_id: string | null;
					reference_table: string | null;
					created_at: string;
				};
				Insert: Omit<
					Database["public"]["Tables"]["notifications"]["Row"],
					"id" | "is_read" | "created_at"
				>;
				Update: Partial<
					Pick<Database["public"]["Tables"]["notifications"]["Row"], "is_read">
				>;
			};
		};

		Enums: {
			user_role: "client" | "landlord" | "agent" | "admin";
			verification_status: "unverified" | "pending" | "verified" | "rejected";
			property_type:
				| "student_lodge"
				| "family_apartment"
				| "shared_flat"
				| "single_room"
				| "duplex"
				| "villa"
				| "short_let";
			property_status: "available" | "rented" | "under_review" | "inactive";
			fee_type: "percentage" | "flat";
			price_period: "per_month" | "per_year" | "per_night";
			id_document_type:
				| "nin"
				| "international_passport"
				| "drivers_license"
				| "voters_card";
			listing_tag: "for_sale" | "for_rent" | "shortlet";
			booking_status:
				| "pending"
				| "approved"
				| "viewing"
				| "rejected"
				| "cancelled"
				| "completed";
			booking_stage: "inquiry" | "inspection" | "verified" | "completed";
			payment_status: "unpaid" | "paid";
			notification_type:
				| "booking_request"
				| "booking_approved"
				| "booking_rejected"
				| "booking_cancelled"
				| "new_message"
				| "listing_verified"
				| "listing_flagged";
		};

		Functions: {
			is_admin: { Args: Record<never, never>; Returns: boolean };
		};
	};
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
	Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
	Database["public"]["Enums"][T];
