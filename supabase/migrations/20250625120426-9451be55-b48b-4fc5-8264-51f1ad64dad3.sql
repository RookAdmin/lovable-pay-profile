
-- Add upi_id column to profiles table to store user's UPI ID
ALTER TABLE public.profiles 
ADD COLUMN upi_id text;
