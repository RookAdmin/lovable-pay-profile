-- Fix search_path for generate_random_pin function
CREATE OR REPLACE FUNCTION generate_random_pin()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix search_path for hash_pin function
CREATE OR REPLACE FUNCTION hash_pin(pin TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pin_hash BYTEA;
BEGIN
  pin_hash := digest(pin || 'paym_salt_2024', 'sha256');
  RETURN encode(pin_hash, 'hex');
END;
$$;

-- Fix search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix search_path for generate_unique_paym_link function
CREATE OR REPLACE FUNCTION public.generate_unique_paym_link()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  unique_str TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    unique_str := unique_str || substr(base_chars, floor(random() * length(base_chars) + 1)::integer, 1);
  END LOOP;
  
  IF NEW.unique_link IS NULL OR NEW.unique_link = '' THEN
    NEW.unique_link := unique_str;
  END IF;
  
  RETURN NEW;
END;
$$;