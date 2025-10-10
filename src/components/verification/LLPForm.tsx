
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
const llpinRegex = /^[A-Z]{3}-[0-9]{4}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const formSchema = z.object({
  llpName: z.string().min(3, { message: 'LLP name is required' }),
  llpin: z.string().regex(llpinRegex, { message: 'Invalid LLPIN format (e.g., AAA-1234)' }),
  panNumber: z.string().regex(panRegex, { message: 'Invalid PAN format' }),
  registeredAddress: z.string().min(10, { message: 'Registered address is required (minimum 10 characters)' }),
  gstNumber: z.string().regex(gstRegex, { message: 'Invalid GST number format' }),
  email: z.string().regex(emailRegex, { message: 'Invalid email address' }),
  phoneNumber: z.string().regex(phoneRegex, { message: 'Invalid phone number. Must be 10 digits starting with 6-9.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface LLPFormProps {
  userId: string;
  onSubmit: (data: FormValues, documents: Record<string, string>) => void;
  isLoading?: boolean;
  defaultValues?: Partial<FormValues>;
}

export function LLPForm({ userId, onSubmit, isLoading = false, defaultValues }: LLPFormProps) {
  const [documents, setDocuments] = React.useState<Record<string, DocumentUpload>>({
    incorporationCertificate: { file: new File([], "") }
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      llpName: defaultValues?.llpName || '',
      llpin: defaultValues?.llpin || '',
      panNumber: defaultValues?.panNumber || '',
      registeredAddress: defaultValues?.registeredAddress || '',
      gstNumber: defaultValues?.gstNumber || '',
      email: defaultValues?.email || '',
      phoneNumber: defaultValues?.phoneNumber || '',
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
    if (!documents.incorporationCertificate.path) {
      form.setError("llpin", { 
        message: "Please upload your Certificate of Incorporation" 
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
            name="llpName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LLP Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter LLP name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="llpin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LLPIN (LLP Identification Number)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., AAA-1234" {...field} />
                </FormControl>
                <FormDescription>
                  Format: AAA-1234
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="panNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAN of the LLP</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., ABCDE1234F" {...field} />
                </FormControl>
                <FormDescription>
                  Format: ABCDE1234F
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="registeredAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registered Office Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter registered office address" 
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
                <FormLabel>GST Number</FormLabel>
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
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="llp@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="10-digit phone number" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your 10-digit phone number without any prefix
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Document uploads */}
          <div className="space-y-4 mt-6">
            <h4 className="text-sm font-medium">Required Documents</h4>
            <DocumentUploader
              label="Certificate of Incorporation"
              documentId="incorporationCertificate"
              accept="application/pdf,image/jpeg,image/png"
              onUpload={handleUpload}
              onRemove={handleRemove}
              document={documents.incorporationCertificate}
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
