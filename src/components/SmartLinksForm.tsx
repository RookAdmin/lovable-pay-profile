import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Heart, Coffee, CreditCard, Zap, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { SmartLink } from '@/types/profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Maximum file size: 200KB
const MAX_FILE_SIZE = 200 * 1024;
// Maximum dimensions: 1000x1000
const MAX_DIMENSION = 1000;

const smartLinkSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  amount: z.string().refine(value => !isNaN(Number(value)) && Number(value) > 0, {
    message: 'Amount must be a positive number',
  }),
  displayType: z.enum(['icon', 'image']).default('icon'),
  icon: z.enum(['heart', 'coffee', 'zap', 'card']).optional(),
  gradient: z.boolean().default(false)
});

type SmartLinkFormData = z.infer<typeof smartLinkSchema>;

interface SmartLinksFormProps {
  initialData?: SmartLink | null;
  existingLinks?: SmartLink[];
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

const SmartLinksForm: React.FC<SmartLinksFormProps> = ({ 
  initialData = null, 
  existingLinks = [],
  onSubmitSuccess,
  onCancel 
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingLink, setEditingLink] = useState<SmartLink | null>(initialData);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<SmartLinkFormData>({
    resolver: zodResolver(smartLinkSchema),
    defaultValues: {
      title: initialData?.title || '',
      amount: initialData ? initialData.amount.toString() : '',
      displayType: initialData?.imageUrl ? 'image' : 'icon',
      icon: initialData?.icon || 'heart',
      gradient: initialData?.gradient || false
    }
  });

  const displayType = form.watch('displayType');

  const validateImage = (file: File): Promise<{ valid: boolean; message?: string }> => {
    return new Promise((resolve) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        resolve({ valid: false, message: `Image is too large. Maximum size is ${MAX_FILE_SIZE / 1024}KB.` });
        return;
      }
      
      // Check dimensions - Fix: Create the Image object correctly
      const img = new window.Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
          resolve({ 
            valid: false, 
            message: `Image dimensions are too large. Maximum dimensions are ${MAX_DIMENSION}x${MAX_DIMENSION} pixels.` 
          });
        } else if (Math.abs(img.width - img.height) > 10) {
          resolve({ 
            valid: false, 
            message: 'Image should be square (equal width and height).' 
          });
        } else {
          resolve({ valid: true });
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve({ valid: false, message: 'Invalid image file.' });
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const validation = await validateImage(file);
    if (!validation.valid) {
      toast.error(validation.message);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    setUploadedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    setIsUploading(true);
    
    try {
      const { data, error } = await supabase.storage
        .from('smart_links_images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('smart_links_images')
        .getPublicUrl(fileName);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (data: SmartLinkFormData) => {
    try {
      if (!user) {
        toast.error('You must be logged in to save smart links');
        return;
      }

      let imageUrl = imagePreview;

      // If there's a new image to upload
      if (uploadedImage) {
        imageUrl = await uploadImageToStorage(uploadedImage);
        if (!imageUrl) return;
      }

      const payload: any = {
        profile_id: user.id,
        title: data.title,
        amount: parseFloat(data.amount),
        gradient: data.gradient,
        currency: '₹',
        is_active: true
      };

      // Set either icon or imageUrl based on selected display type
      if (data.displayType === 'icon' && data.icon) {
        payload.icon = data.icon;
        payload.image_url = null;
      } else if (data.displayType === 'image' && imageUrl) {
        payload.icon = null;
        payload.image_url = imageUrl;
      }

      if (editingLink?.id) {
        // Update existing
        const { error } = await supabase
          .from('smart_links')
          .update(payload)
          .eq('id', editingLink.id);

        if (error) throw error;
        toast.success('Smart link updated successfully');
      } else {
        // Insert new
        const { error } = await supabase
          .from('smart_links')
          .insert(payload);

        if (error) throw error;
        toast.success('Smart link created successfully');
      }

      // Reset form and editing state
      form.reset();
      setEditingLink(null);
      setUploadedImage(null);
      setImagePreview(null);
      
      // Refresh smart links data
      queryClient.invalidateQueries({ queryKey: ['smart_links', user.id] });
      
      // Call success callback if provided
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error('Error saving smart link:', error);
      toast.error('Failed to save smart link');
    }
  };

  const handleEdit = (link: SmartLink) => {
    setEditingLink(link);
    setImagePreview(link.imageUrl || null);
    form.reset({
      title: link.title,
      amount: link.amount.toString(),
      displayType: link.imageUrl ? 'image' : 'icon',
      icon: link.icon,
      gradient: link.gradient || false
    });
  };

  const handleDelete = async (id: string) => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('smart_links')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Smart link deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['smart_links', user.id] });
    } catch (error) {
      console.error('Error deleting smart link:', error);
      toast.error('Failed to delete smart link');
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'heart': return <Heart size={20} />;
      case 'coffee': return <Coffee size={20} />;
      case 'zap': return <Zap size={20} />;
      case 'card': return <CreditCard size={20} />;
      default: return <Heart size={20} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingLink ? 'Edit Smart Link' : 'Create Smart Link'}</CardTitle>
        <CardDescription>
          Create quick payment links with custom amounts and visuals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Support me" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input placeholder="100" type="number" min="1" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="displayType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Type</FormLabel>
                  <FormControl>
                    <Tabs 
                      value={field.value} 
                      onValueChange={field.onChange}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="icon">Icon</TabsTrigger>
                        <TabsTrigger value="image">Custom Image</TabsTrigger>
                      </TabsList>
                      <TabsContent value="icon" className="mt-4">
                        <FormField
                          control={form.control}
                          name="icon"
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an icon" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="heart">
                                    <div className="flex items-center">
                                      <Heart className="mr-2" size={16} />
                                      <span>Heart</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="coffee">
                                    <div className="flex items-center">
                                      <Coffee className="mr-2" size={16} />
                                      <span>Coffee</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="zap">
                                    <div className="flex items-center">
                                      <Zap className="mr-2" size={16} />
                                      <span>Zap</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="card">
                                    <div className="flex items-center">
                                      <CreditCard className="mr-2" size={16} />
                                      <span>Card</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      <TabsContent value="image" className="mt-4">
                        <div className="space-y-4">
                          <div className="flex flex-col items-center space-y-4">
                            {imagePreview ? (
                              <div className="relative">
                                <img 
                                  src={imagePreview} 
                                  alt="Preview" 
                                  className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                                />
                                <button 
                                  type="button" 
                                  onClick={clearImage} 
                                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                                <ImageIcon size={32} className="text-gray-400" />
                              </div>
                            )}
                            <div className="text-center">
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                {imagePreview ? 'Change Image' : 'Upload Image'}
                              </Button>
                              <p className="text-xs text-muted-foreground mt-2">
                                Square image, max 200KB, 1000x1000px
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gradient"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Use Gradient Background</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" disabled={isUploading}>
                {isUploading ? 'Uploading...' : (editingLink ? 'Update Link' : 'Create Link')}
              </Button>
              
              {(editingLink || onCancel) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingLink(null);
                    setImagePreview(null);
                    form.reset({
                      title: '',
                      amount: '',
                      displayType: 'icon',
                      icon: 'heart',
                      gradient: false
                    });
                    if (onCancel) onCancel();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>

        {existingLinks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Your Smart Links</h3>
            <div className="space-y-3">
              {existingLinks.map(link => (
                <div 
                  key={link.id} 
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full ${link.gradient ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-gray-100'}`}>
                      {link.imageUrl ? (
                        <img 
                          src={link.imageUrl} 
                          alt={link.title}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="p-2">
                          {getIcon(link.icon || 'heart')}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{link.title}</p>
                      <p className="text-sm text-muted-foreground">₹{link.amount}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(link)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(link.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartLinksForm;
