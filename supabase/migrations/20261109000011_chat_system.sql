CREATE TABLE IF NOT EXISTS public.conversations (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_one_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_two_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id             uuid        REFERENCES public.property_listings(id) ON DELETE SET NULL,
  booking_id              uuid        REFERENCES public.bookings(id) ON DELETE SET NULL,
  last_message_id         uuid,
  last_message_body       text,
  last_message_sender_id  uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  last_message_at         timestamptz NOT NULL DEFAULT now(),
  participant_one_unread  integer     NOT NULL DEFAULT 0 CHECK (participant_one_unread >= 0),
  participant_two_unread  integer     NOT NULL DEFAULT 0 CHECK (participant_two_unread >= 0),
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT conversations_distinct_participants CHECK (participant_one_id <> participant_two_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS conversations_pair_property_unique_idx
  ON public.conversations (
    LEAST(participant_one_id, participant_two_id),
    GREATEST(participant_one_id, participant_two_id),
    COALESCE(property_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

CREATE INDEX IF NOT EXISTS conversations_p1_idx ON public.conversations (participant_one_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS conversations_p2_idx ON public.conversations (participant_two_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS conversations_property_idx ON public.conversations (property_id);

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES public.conversations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS read_at timestamptz;

CREATE INDEX IF NOT EXISTS messages_thread_pair_idx
  ON public.messages (sender_id, recipient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS messages_unread_batch_idx
  ON public.messages (recipient_id, sender_id)
  WHERE is_read = false;

CREATE INDEX IF NOT EXISTS messages_conversation_idx
  ON public.messages (conversation_id, created_at ASC);

CREATE TABLE IF NOT EXISTS public.message_attachments (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id  uuid        NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  file_url    text        NOT NULL,
  file_name   text        NOT NULL,
  file_type   text        NOT NULL,
  file_size   integer,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS message_attachments_msg_idx ON public.message_attachments (message_id);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conversations: participant can select" ON public.conversations;
DROP POLICY IF EXISTS "conversations: participant can insert" ON public.conversations;
DROP POLICY IF EXISTS "conversations: participant can update" ON public.conversations;
DROP POLICY IF EXISTS "message_attachments: participant can select" ON public.message_attachments;
DROP POLICY IF EXISTS "message_attachments: sender can insert" ON public.message_attachments;

CREATE POLICY "conversations: participant can select"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (participant_one_id = auth.uid() OR participant_two_id = auth.uid() OR public.is_admin());

CREATE POLICY "conversations: participant can insert"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (participant_one_id = auth.uid() OR participant_two_id = auth.uid());

CREATE POLICY "conversations: participant can update"
  ON public.conversations FOR UPDATE
  TO authenticated
  USING (participant_one_id = auth.uid() OR participant_two_id = auth.uid())
  WITH CHECK (participant_one_id = auth.uid() OR participant_two_id = auth.uid());

CREATE POLICY "message_attachments: participant can select"
  ON public.message_attachments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_attachments.message_id
        AND (m.sender_id = auth.uid() OR m.recipient_id = auth.uid())
    )
  );

CREATE POLICY "message_attachments: sender can insert"
  ON public.message_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_attachments.message_id
        AND m.sender_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION public.handle_new_chat_message()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_p1 uuid;
  v_p2 uuid;
  v_conv_id uuid;
  v_sender_name text;
  v_recent_notif_exists boolean;
BEGIN
  v_p1 := LEAST(NEW.sender_id, NEW.recipient_id);
  v_p2 := GREATEST(NEW.sender_id, NEW.recipient_id);

  INSERT INTO public.conversations (
    participant_one_id,
    participant_two_id,
    property_id,
    booking_id,
    last_message_id,
    last_message_body,
    last_message_sender_id,
    last_message_at,
    participant_one_unread,
    participant_two_unread,
    updated_at
  )
  VALUES (
    v_p1,
    v_p2,
    NEW.property_id,
    NEW.booking_id,
    NEW.id,
    LEFT(NEW.body, 240),
    NEW.sender_id,
    NEW.created_at,
    CASE WHEN NEW.recipient_id = v_p1 THEN 1 ELSE 0 END,
    CASE WHEN NEW.recipient_id = v_p2 THEN 1 ELSE 0 END,
    NEW.created_at
  )
  ON CONFLICT (
    LEAST(participant_one_id, participant_two_id),
    GREATEST(participant_one_id, participant_two_id),
    COALESCE(property_id, '00000000-0000-0000-0000-000000000000'::uuid)
  )
  DO UPDATE SET
    last_message_id = EXCLUDED.last_message_id,
    last_message_body = EXCLUDED.last_message_body,
    last_message_sender_id = EXCLUDED.last_message_sender_id,
    last_message_at = EXCLUDED.last_message_at,
    participant_one_unread = CASE
      WHEN NEW.recipient_id = public.conversations.participant_one_id
      THEN public.conversations.participant_one_unread + 1
      ELSE public.conversations.participant_one_unread
    END,
    participant_two_unread = CASE
      WHEN NEW.recipient_id = public.conversations.participant_two_id
      THEN public.conversations.participant_two_unread + 1
      ELSE public.conversations.participant_two_unread
    END,
    updated_at = EXCLUDED.updated_at
  RETURNING id INTO v_conv_id;

  IF NEW.conversation_id IS NULL THEN
    NEW.conversation_id := v_conv_id;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.notifications
    WHERE user_id = NEW.recipient_id
      AND type = 'new_message'
      AND is_read = false
      AND created_at > (now() - interval '5 minutes')
  ) INTO v_recent_notif_exists;

  IF NOT v_recent_notif_exists THEN
    SELECT COALESCE(full_name, 'A user') INTO v_sender_name
    FROM public.profiles
    WHERE id = NEW.sender_id;

    INSERT INTO public.notifications (user_id, type, title, body, reference_id, reference_table)
    VALUES (
      NEW.recipient_id,
      'new_message',
      'New message from ' || v_sender_name,
      LEFT(NEW.body, 140),
      NEW.id,
      'messages'
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_chat_message_inserted ON public.messages;
CREATE TRIGGER on_chat_message_inserted
  BEFORE INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_chat_message();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
  END IF;
END $$;

