
import React, { useState } from 'react';
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
import { Heart, Coffee, CreditCard, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { SmartLink } from '@/types/profile';

const smartLinkSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  amount: z.string().refine(value => !isNaN(Number(value)) && Number(value) > 0, {
    message: 'Amount must be a positive number',
  }),
  icon: z.enum(['heart', 'coffee', 'zap', 'card']),
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
  
  const form = useForm<SmartLinkFormData>({
    resolver: zodResolver(smartLinkSchema),
    defaultValues: {
      title: initialData?.title || '',
      amount: initialData ? initialData.amount.toString() : '',
      icon: initialData?.icon || 'heart',
      gradient: initialData?.gradient || false
    }
  });

  const handleSubmit = async (data: SmartLinkFormData) => {
    try {
      if (!user) {
        toast.error('You must be logged in to save smart links');
        return;
      }

      const payload = {
        profile_id: user.id,
        title: data.title,
        amount: parseFloat(data.amount),
        icon: data.icon,
        gradient: data.gradient,
        currency: '₹',
        is_active: true
      };

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
    form.reset({
      title: link.title,
      amount: link.amount.toString(),
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
          Create quick payment links with custom amounts and icons
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
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
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
              <Button type="submit" className="flex-1">
                {editingLink ? 'Update Link' : 'Create Link'}
              </Button>
              
              {(editingLink || onCancel) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingLink(null);
                    form.reset({
                      title: '',
                      amount: '',
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
                    <div className={`p-2 rounded-full ${link.gradient ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-gray-100'}`}>
                      {getIcon(link.icon)}
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
