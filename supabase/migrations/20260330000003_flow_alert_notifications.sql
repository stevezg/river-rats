-- Track which flow alerts have been notified (prevents spam)
CREATE TABLE public.flow_alert_notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id   uuid NOT NULL REFERENCES public.flow_alerts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gauge_id   text NOT NULL,
  cfs_at_send int NOT NULL,
  sent_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.flow_alert_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flow_alert_notifications_own"
  ON public.flow_alert_notifications FOR SELECT
  USING (auth.uid() = user_id);
