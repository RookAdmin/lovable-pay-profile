
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import DocumentUploader from './DocumentUploader';
import { DocumentUpload } from '@/types/verification';

const phoneRegex = /^[6-9]\d{9}$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const formSchema = z.object({
  businessName: z.string().min(3, { message: 'Business name is required' }),
  proprietorName: z.string().min(3, { message: 'Proprietor name is required' }),
  mobileNumber: z.string().regex(phoneRegex, { message: 'Invalid mobile number. Must be 10 digits starting with 6-9.' }),
  email: z.string().regex(emailRegex, { message: 'Invalid email address' }),
  businessAddress: z.string().min(10, { message: 'Business address is required (minimum 10 characters)' }),
  gstNumber: z.string().regex(gstRegex, { message: 'Invalid GST number format' }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProprietorshipFormProps {
  userId: string;
  onSubmit: (data: FormValues, documents: Record<string, string>) => void;
  isLoading?: boolean;
  defaultValues?: Partial<FormValues>;
}

export function ProprietorshipForm({ userId, onSubmit, isLoading = false, defaultValues }: ProprietorshipFormProps) {
  const [documents, setDocuments] = React.useState<Record<string, DocumentUpload>>({
    gstCertificate: { file: new File([], "") }
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: defaultValues?.businessName || '',
      proprietorName: defaultValues?.proprietorName || '',
      mobileNumber: defaultValues?.mobileNumber || '',
      email: defaultValues?.email || '',
      businessAddress: defaultValues?.businessAddress || '',
      gstNumber: defaultValues?.gstNumber || '',
      ...defaultValues,
    },
  });
  
  const handleUpload = (docId: string, path: string) => {
    setDocuments(prev => ({
      ...prev,
      [docId]: { ...prev[docId], path }
    }));
  };
  
  const handleRemove = (docId: string) => {
    setDocuments(prev => ({
      ...prev,
      [docId]: { file: new File([], "") }
    }));
  };
  
  const handleSubmit = (values: FormValues) => {
    // Check if all required documents are uploaded
    if (!documents.gstCertificate.path) {
      form.setError("gstNumber", { 
        message: "Please upload your GST certificate" 
      });
      return;
    }
    
    const documentPaths: Record<string, string> = {};
    Object.entries(documents).forEach(([key, doc]) => {
      if (doc.path) documentPaths[key] = doc.path;
    });
    
    onSubmit(values, documentPaths);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your business name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="proprietorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proprietor's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter proprietor's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="10-digit mobile number" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your 10-digit mobile number without any prefix
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="businessAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your business address" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gstNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="GST number" {...field} />
                </FormControl>
                <FormDescription>
                  Format: 22AAAAA0000A1Z5
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Document uploads */}
          <div className="space-y-4 mt-6">
            <h4 className="text-sm font-medium">Required Documents</h4>
            <DocumentUploader
              label="GST Certificate"
              documentId="gstCertificate"
              accept="application/pdf,image/jpeg,image/png"
              onUpload={handleUpload}
              onRemove={handleRemove}
              document={documents.gstCertificate}
              userId={userId}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit for Verification"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
