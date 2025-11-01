-- Add profile pin security fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS profile_pin_hash TEXT,
ADD COLUMN IF NOT EXISTS profile_pin_enabled BOOLEAN DEFAULT true;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_pin_enabled ON public.profiles(profile_pin_enabled);

-- Add audit logging table for pin access attempts
CREATE TABLE IF NOT EXISTS public.profile_pin_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attempt_success BOOLEAN NOT NULL,
  attempt_ip TEXT,
  attempt_user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE public.profile_pin_audit ENABLE ROW LEVEL SECURITY;

-- Only profile owners can view their audit logs
CREATE POLICY "Users can view their own pin audit logs"
  ON public.profile_pin_audit
  FOR SELECT
  USING (auth.uid() = profile_id);

-- System can insert audit logs (via service role)
CREATE POLICY "System can insert audit logs"
  ON public.profile_pin_audit
  FOR INSERT
  WITH CHECK (true);

-- Add trigger to update profiles updated_at on pin changes
CREATE OR REPLACE FUNCTION public.update_profile_pin_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.profile_pin_hash IS DISTINCT FROM NEW.profile_pin_hash) OR 
     (OLD.profile_pin_enabled IS DISTINCT FROM NEW.profile_pin_enabled) THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_pin_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_pin_timestamp();