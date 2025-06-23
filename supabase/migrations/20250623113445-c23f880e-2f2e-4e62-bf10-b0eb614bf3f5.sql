
-- Create storage bucket for smart links images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'smart_links_images', 
  'smart_links_images', 
  true, 
  102400, -- 100KB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Public can view smart link images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload smart link images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own smart link images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own smart link images" ON storage.objects;

-- Create policy to allow public access to view images
CREATE POLICY "Public can view smart link images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'smart_links_images');

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload smart link images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'smart_links_images' 
  AND auth.role() = 'authenticated'
);

-- Create policy to allow users to update their own images
CREATE POLICY "Users can update their own smart link images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'smart_links_images' 
  AND auth.role() = 'authenticated'
);

-- Create policy to allow users to delete their own images
CREATE POLICY "Users can delete their own smart link images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'smart_links_images' 
  AND auth.role() = 'authenticated'
);
