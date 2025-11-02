-- Function to generate random 6-character alphanumeric PIN
CREATE OR REPLACE FUNCTION generate_random_pin()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Function to hash PIN
CREATE OR REPLACE FUNCTION hash_pin(pin TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  pin_hash BYTEA;
BEGIN
  pin_hash := digest(pin || 'paym_salt_2024', 'sha256');
  RETURN encode(pin_hash, 'hex');
END;
$$;

-- Function to set default PIN on profile creation
CREATE OR REPLACE FUNCTION set_default_profile_pin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  random_pin TEXT;
BEGIN
  -- Generate random PIN
  random_pin := generate_random_pin();
  
  -- Set the PIN hash and disable PIN protection by default
  NEW.profile_pin_hash := hash_pin(random_pin);
  NEW.profile_pin_enabled := false;
  
  RETURN NEW;
END;
$$;

-- Create trigger to set default PIN on profile creation
DROP TRIGGER IF EXISTS set_default_pin_on_profile_insert ON profiles;
CREATE TRIGGER set_default_pin_on_profile_insert
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_default_profile_pin();