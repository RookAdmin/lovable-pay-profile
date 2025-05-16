
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const phoneRegex = /^[6-9]\d{9}$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const cinRegex = /^[UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const formSchema = z.object({
  corporationName: z.string().min(3, { message: 'Corporation name is required' }),
  type: z.enum(["Public Limited", "MNC", "Government Org"]),
  registrationNumber: z.string().regex(cinRegex, { message: 'Invalid CIN format' }),
  gstNumber: z.string().regex(gstRegex, { message: 'Invalid GST number format' }),
  registeredAddress: z.string().min(10, { message: 'Registered address is required (minimum 10 characters)' }),
  email: z.string().regex(emailRegex, { message: 'Invalid email address' }),
  phoneNumber: z.string().regex(phoneRegex, { message: 'Invalid phone number. Must be 10 digits starting with 6-9.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface CorporationFormProps {
  userId: string;
  onSubmit: (data: FormValues, documents: Record<string, string>) => void;
  isLoading?: boolean;
  defaultValues?: Partial<FormValues>;
}

export function CorporationForm({ userId, onSubmit, isLoading = false, defaultValues }: CorporationFormProps) {
  const [documents, setDocuments] = React.useState<Record<string, DocumentUpload>>({
    incorporationCertificate: { file: new File([], "") }
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      corporationName: defaultValues?.corporationName || '',
      type: defaultValues?.type || 'Public Limited',
      registrationNumber: defaultValues?.registrationNumber || '',
      gstNumber: defaultValues?.gstNumber || '',
      registeredAddress: defaultValues?.registeredAddress || '',
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
      form.setError("registrationNumber", { 
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
            name="corporationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Corporation Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter corporation name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select corporation type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Public Limited">Public Limited</SelectItem>
                    <SelectItem value="MNC">MNC</SelectItem>
                    <SelectItem value="Government Org">Government Organization</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CIN or equivalent registration number</FormLabel>
                <FormControl>
                  <Input placeholder="Registration number" {...field} />
                </FormControl>
                <FormDescription>
                  For CIN format: U12345AB1234XYZ123456
                </FormDescription>
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
            name="registeredAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registered Corporate Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter registered corporate address" 
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="corporation@email.com" type="email" {...field} />
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
