
-- Add first_name and last_name columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text;

-- Update the trigger function to handle first_name and last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, first_name, last_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', LOWER(SPLIT_PART(new.email, '@', 1))),
    COALESCE(
      TRIM(CONCAT(
        COALESCE(new.raw_user_meta_data->>'first_name', ''),
        ' ',
        COALESCE(new.raw_user_meta_data->>'last_name', '')
      )),
      SPLIT_PART(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$;
