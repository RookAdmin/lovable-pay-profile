-- Fix search_path for the new profile pin timestamp function
-- First drop the trigger, then recreate the function with proper search_path
DROP TRIGGER IF EXISTS trigger_update_profile_pin_timestamp ON public.profiles;

CREATE OR REPLACE FUNCTION public.update_profile_pin_timestamp()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (OLD.profile_pin_hash IS DISTINCT FROM NEW.profile_pin_hash) OR 
     (OLD.profile_pin_enabled IS DISTINCT FROM NEW.profile_pin_enabled) THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER trigger_update_profile_pin_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_pin_timestamp();