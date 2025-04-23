import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Camera, Image } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const profileSchema = z.object({
  display_name: z.string().min(2, 'Display name must be at least 2 characters'),
  bio: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  instagram_url: z.string().url().optional().or(z.literal('')),
  twitter_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  avatar_url: z.string().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  initialData?: ProfileFormValues;
  onProfilePhotoUpdated?: () => void;
}

const AVATAR_BUCKET = 'avatars';

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ initialData, onProfilePhotoUpdated }) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...initialData,
      avatar_url: initialData?.avatar_url || '',
    }
  });

  const handleAvatarChange = async (file: File) => {
    setUploading(true);
    try {
      if (!user?.id) {
        toast.error("User not found");
        return;
      }
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase
        .storage
        .from(AVATAR_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase
        .storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(filePath);
      if (!data?.publicUrl) throw new Error('Could not get public URL for avatar');
      setAvatarUrl(data.publicUrl);
      form.setValue('avatar_url', data.publicUrl, { shouldDirty: true });
      toast.success('Avatar updated! Don\'t forget to save changes.');
      if (onProfilePhotoUpdated) onProfilePhotoUpdated();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    if (file) {
      handleAvatarChange(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const toUpdate = { ...data, avatar_url: avatarUrl };
      const { error } = await supabase
        .from('profiles')
        .update(toUpdate)
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="flex flex-col items-center gap-2 mb-4">
          <Avatar className="h-20 w-20">
            {avatarUrl
              ? <AvatarImage src={avatarUrl} alt="Profile photo" />
              : <AvatarFallback>
                  <Camera size={28} />
                </AvatarFallback>
            }
          </Avatar>
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onSelectFile}
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1 mt-2"
            disabled={uploading}
            onClick={() => inputFileRef.current?.click()}
          >
            <Image size={16} />
            {uploading ? 'Uploading...' : (avatarUrl ? 'Change Photo' : 'Upload Photo')}
          </Button>
        </div>

        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" placeholder="https://" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagram_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" placeholder="https://instagram.com/" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="twitter_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" placeholder="https://twitter.com/" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedin_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" placeholder="https://linkedin.com/in/" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Input type="hidden" {...form.register('avatar_url')} />

        <Button type="submit" disabled={form.formState.isSubmitting || uploading}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileEditForm;
