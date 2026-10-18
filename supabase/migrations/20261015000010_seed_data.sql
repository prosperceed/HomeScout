DO $$
DECLARE
  v_agent1_id    uuid := gen_random_uuid();
  v_agent2_id    uuid := gen_random_uuid();
  v_landlord1_id uuid := gen_random_uuid();
  v_client1_id   uuid := gen_random_uuid();
  v_client2_id   uuid := gen_random_uuid();

  v_prop1_id     uuid := gen_random_uuid();
  v_prop2_id     uuid := gen_random_uuid();
  v_prop3_id     uuid := gen_random_uuid();
  v_prop4_id     uuid := gen_random_uuid();
  v_prop5_id     uuid := gen_random_uuid();
  v_prop6_id     uuid := gen_random_uuid();
  v_prop7_id     uuid := gen_random_uuid();
  v_prop8_id     uuid := gen_random_uuid();

  v_booking1_id  uuid := gen_random_uuid();
  v_booking2_id  uuid := gen_random_uuid();
  v_booking3_id  uuid := gen_random_uuid();
  v_booking4_id  uuid := gen_random_uuid();
  v_booking5_id  uuid := gen_random_uuid();
  v_booking6_id  uuid := gen_random_uuid();
BEGIN

  INSERT INTO public.profiles (id, email, full_name, phone, role, verification_status, created_at, updated_at) VALUES
    (v_agent1_id,    'emeka.obi@primeprop.ng',     'Emeka Obi',          '+2348031112222', 'agent',    'verified',   now() - interval '90 days', now()),
    (v_agent2_id,    'aisha.bello@viproperties.ng', 'Aisha Bello',        '+2348052223333', 'agent',    'verified',   now() - interval '80 days', now()),
    (v_landlord1_id, 'ngozi.eze@gmail.com',         'Ngozi Eze',          '+2348074445555', 'landlord', 'verified',   now() - interval '60 days', now()),
    (v_client1_id,   'tunde.adeyemi@gmail.com',     'Tunde Adeyemi',      '+2348091116677', 'client',   'unverified', now() - interval '30 days', now()),
    (v_client2_id,   'fatima.ibrahim@gmail.com',    'Fatima Ibrahim',     '+2348067778899', 'client',   'unverified', now() - interval '20 days', now());

  INSERT INTO public.agent_profiles (id, agency_name, license_number, fee_type, fee_value, verified_agent, managed_listings_count) VALUES
    (v_agent1_id, 'PrimeProp Lagos',  'AG-LG-0021', 'percentage', 10, true, 0),
    (v_agent2_id, 'VI Properties',   'AG-LG-0034', 'percentage', 8,  true, 0);

  INSERT INTO public.landlord_profiles (id, property_count_range, identity_verified, identity_verification_ready, bank_details_added) VALUES
    (v_landlord1_id, '4-9', true, true, true);

  INSERT INTO public.client_profiles (id, target_state, target_locality, preferred_property_types, budget_min, budget_max) VALUES
    (v_client1_id, 'Lagos',       'Lekki',     ARRAY['family_apartment','duplex']::public.property_type[],  500000,  2500000),
    (v_client2_id, 'FCT - Abuja', 'Wuse II',   ARRAY['family_apartment','shared_flat']::public.property_type[], 300000, 1200000);

  INSERT INTO public.property_listings (
    id, title, description, type, status, listing_tag, price, price_period,
    bedrooms, bathrooms, images, amenities,
    lat, lng, formatted_address, state, local_government, city,
    is_verified, is_featured, owner_id, owner_type, agent_id
  ) VALUES
    (
      v_prop1_id,
      '3-Bed Apartment, Lekki Phase 1',
      'A well-finished 3-bedroom apartment in the heart of Lekki Phase 1. Features a spacious living room, modern kitchen, ample natural light, and 24/7 security. Located on a serene street close to the Admiralty Way axis.',
      'family_apartment', 'available', 'for_rent', 1800000, 'per_year',
      3, 2,
      '[{"id":"img1","url":"/assets/house1.jpeg","alt":"Front view","is_cover":true},{"id":"img2","url":"/assets/house2.jpeg","alt":"Living room","is_cover":false}]',
      ARRAY['WiFi','Parking','Generator','Security','CCTV','Water Supply','Air Conditioning'],
      6.4312, 3.4684, '14 Admiralty Way, Lekki Phase 1, Lagos', 'Lagos', 'Eti-Osa', 'Lekki',
      true, true, v_agent1_id, 'agent', v_agent1_id
    ),
    (
      v_prop2_id,
      'Modern Studio, Victoria Island',
      'An elegant studio flat on Victoria Island, ideal for professionals. Comes fully furnished with quality appliances, fast fibre internet, and access to a rooftop lounge.',
      'shared_flat', 'available', 'for_rent', 480000, 'per_year',
      1, 1,
      '[{"id":"img3","url":"/assets/house2.jpeg","alt":"Studio interior","is_cover":true}]',
      ARRAY['WiFi','Furnished','Air Conditioning','Generator','Gym'],
      6.4319, 3.4179, '25 Kofo Abayomi Street, Victoria Island, Lagos', 'Lagos', 'Eti-Osa', 'Victoria Island',
      true, false, v_agent2_id, 'agent', v_agent2_id
    ),
    (
      v_prop3_id,
      '4-Bed Duplex, Ikoyi',
      'Prestigious 4-bedroom duplex in Ikoyi, surrounded by lush greenery. Semi-detached, with a private garage, BQ, and smart home features.',
      'duplex', 'available', 'for_sale', 3600000, 'per_year',
      4, 3,
      '[{"id":"img4","url":"/assets/house3.jpeg","alt":"Exterior","is_cover":true}]',
      ARRAY['Parking','Generator','Security','CCTV','Water Supply','Air Conditioning','Balcony','Garden'],
      6.4572, 3.4371, '7 Bourdillon Road, Ikoyi, Lagos', 'Lagos', 'Eti-Osa', 'Ikoyi',
      true, true, v_agent1_id, 'agent', v_agent1_id
    ),
    (
      v_prop4_id,
      '2-Bed Apartment, Wuse II',
      'Clean 2-bedroom apartment in the busy Wuse II corridor. Close to banking hubs, restaurants, and major government offices in Abuja.',
      'family_apartment', 'available', 'for_rent', 720000, 'per_year',
      2, 2,
      '[{"id":"img5","url":"/assets/house4.jpeg","alt":"Main entrance","is_cover":true}]',
      ARRAY['Parking','Generator','Security','Water Supply'],
      9.0674, 7.4951, '4 Ibrahim Babangida Blvd, Wuse II, Abuja', 'FCT - Abuja', 'Municipal Area Council', 'Wuse II',
      false, false, v_agent2_id, 'agent', v_agent2_id
    ),
    (
      v_prop5_id,
      'Luxury Villa, Banana Island',
      'Ultra-luxury 5-bedroom villa on the exclusive Banana Island. Features a heated pool, home theatre, private gym, 24/7 concierge service, and a 4-car garage.',
      'villa', 'available', 'for_sale', 8400000, 'per_year',
      5, 5,
      '[{"id":"img6","url":"/assets/house1.jpeg","alt":"Pool view","is_cover":true},{"id":"img7","url":"/assets/house4.jpeg","alt":"Interior","is_cover":false}]',
      ARRAY['WiFi','Parking','Generator','Security','CCTV','Water Supply','Air Conditioning','Furnished','Gym','Swimming Pool','Elevator','Balcony','Garden'],
      6.4698, 3.4420, 'Plot 14, Banana Island Estate, Lagos', 'Lagos', 'Eti-Osa', 'Banana Island',
      true, true, v_landlord1_id, 'landlord', NULL
    ),
    (
      v_prop6_id,
      'Student Lodge, Yaba',
      'Affordable and secure student accommodation in Yaba, close to UNILAG and Yaba Tech. Shared kitchen, 24/7 power backup, and fast internet included.',
      'student_lodge', 'available', 'for_rent', 240000, 'per_year',
      1, 1,
      '[{"id":"img8","url":"/assets/house2.jpeg","alt":"Room view","is_cover":true}]',
      ARRAY['WiFi','Generator','Security','Water Supply'],
      6.5076, 3.3732, 'No. 8 Herbert Macaulay Way, Yaba, Lagos', 'Lagos', 'Mainland', 'Yaba',
      false, false, v_landlord1_id, 'landlord', NULL
    ),
    (
      v_prop7_id,
      'Shortlet Suite, GRA Port Harcourt',
      'Tastefully furnished 2-bedroom shortlet suite in the serene Government Residential Area of Port Harcourt. Great for business travellers and extended stays.',
      'family_apartment', 'available', 'shortlet', 35000, 'per_night',
      2, 1,
      '[{"id":"img9","url":"/assets/house3.jpeg","alt":"Living area","is_cover":true}]',
      ARRAY['WiFi','Furnished','Air Conditioning','Generator','Security','CCTV'],
      4.8156, 7.0498, 'Plot 6 Aba Road GRA, Port Harcourt, Rivers', 'Rivers', 'Port Harcourt', 'GRA',
      true, false, v_agent1_id, 'agent', v_agent1_id
    ),
    (
      v_prop8_id,
      '3-Bed Terrace, Asokoro',
      'Spacious 3-bedroom terrace duplex in Asokoro District, Abuja. Gated estate with 24-hour security, close to Aso Rock and major diplomatic missions.',
      'duplex', 'available', 'for_sale', 2200000, 'per_year',
      3, 3,
      '[{"id":"img10","url":"/assets/house4.jpeg","alt":"Front","is_cover":true}]',
      ARRAY['Parking','Generator','Security','CCTV','Water Supply','Air Conditioning','Balcony'],
      9.0523, 7.5179, 'House 12 Asokoro Extension, Abuja', 'FCT - Abuja', 'Municipal Area Council', 'Asokoro',
      true, false, v_agent2_id, 'agent', v_agent2_id
    );

  INSERT INTO public.bookings (
    id, property_id, client_id, agent_id, status,
    message, viewing_date, price_at_booking, price_period, created_at
  ) VALUES
    (v_booking1_id, v_prop1_id, v_client1_id, v_agent1_id, 'approved',
     'I am interested in renting this apartment. When can I schedule a viewing?',
     now() + interval '3 days', 1800000, 'per_year', now() - interval '15 days'),

    (v_booking2_id, v_prop3_id, v_client1_id, v_agent1_id, 'pending',
     'Looking for a family home. Would love to see this duplex.',
     NULL, 3600000, 'per_year', now() - interval '10 days'),

    (v_booking3_id, v_prop7_id, v_client1_id, v_agent1_id, 'viewing',
     'Business trip in PH next week. Need a shortlet for 5 nights.',
     now() + interval '7 days', 35000, 'per_night', now() - interval '5 days'),

    (v_booking4_id, v_prop4_id, v_client2_id, v_agent2_id, 'approved',
     'Looking to move to Abuja. This looks perfect.',
     now() + interval '4 days', 720000, 'per_year', now() - interval '12 days'),

    (v_booking5_id, v_prop8_id, v_client2_id, v_agent2_id, 'pending',
     'My family needs a 3-bed in Asokoro. Interested in this property.',
     NULL, 2200000, 'per_year', now() - interval '8 days'),

    (v_booking6_id, v_prop6_id, v_client1_id, NULL, 'rejected',
     'Looking for student accommodation near UNILAG.',
     NULL, 240000, 'per_year', now() - interval '20 days');

  INSERT INTO public.saved_properties (client_id, property_id) VALUES
    (v_client1_id, v_prop1_id),
    (v_client1_id, v_prop3_id),
    (v_client1_id, v_prop5_id),
    (v_client1_id, v_prop7_id),
    (v_client2_id, v_prop4_id),
    (v_client2_id, v_prop8_id);

  INSERT INTO public.messages (booking_id, property_id, sender_id, recipient_id, body, is_read) VALUES
    (v_booking1_id, v_prop1_id, v_client1_id, v_agent1_id,
     'Hi, I sent a booking request for the Lekki apartment. Looking forward to hearing from you.', true),
    (v_booking1_id, v_prop1_id, v_agent1_id, v_client1_id,
     'Hello! Your booking is approved. Viewing is confirmed for 3 days from now. Please come with a valid ID.', false),
    (v_booking4_id, v_prop4_id, v_client2_id, v_agent2_id,
     'Hi Aisha, I am very interested in the Wuse II apartment. Can we discuss the terms?', false);

END $$;
