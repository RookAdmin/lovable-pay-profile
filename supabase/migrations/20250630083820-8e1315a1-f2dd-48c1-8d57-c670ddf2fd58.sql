
-- Add first_name and last_name columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text;

-- Update the handle_new_user function to use first_name and last_name from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- Create trigger to attach to auth.users table for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
