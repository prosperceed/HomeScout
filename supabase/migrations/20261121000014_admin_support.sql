CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  subject text NOT NULL CHECK (char_length(subject) >= 3),
  category text NOT NULL DEFAULT 'support' CHECK (category IN ('support', 'complaint', 'billing', 'listing', 'account')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_on_user', 'resolved', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(body) >= 1),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS support_tickets_status_idx ON public.support_tickets(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS support_tickets_created_by_idx ON public.support_tickets(created_by, updated_at DESC);
CREATE INDEX IF NOT EXISTS support_messages_ticket_idx ON public.support_messages(ticket_id, created_at ASC);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "support tickets participant can read" ON public.support_tickets FOR SELECT TO authenticated
  USING (created_by = auth.uid() OR assigned_to = auth.uid() OR public.is_admin());
CREATE POLICY "support tickets user can create" ON public.support_tickets FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "support tickets admin can manage" ON public.support_tickets FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "support messages participant can read" ON public.support_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND (t.created_by = auth.uid() OR t.assigned_to = auth.uid() OR public.is_admin())));
CREATE POLICY "support messages participant can send" ON public.support_messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND (t.created_by = auth.uid() OR t.assigned_to = auth.uid() OR public.is_admin())));
CREATE POLICY "support messages admin can manage" ON public.support_messages FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
