
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import DocumentUploader from './DocumentUploader';
import { DocumentUpload } from '@/types/verification';

const phoneRegex = /^[6-9]\d{9}$/;
const aadhaarRegex = /^\d{12}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const formSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name is required' }),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
  mobileNumber: z.string().regex(phoneRegex, { message: 'Invalid mobile number. Must be 10 digits starting with 6-9.' }),
  email: z.string().regex(emailRegex, { message: 'Invalid email address' }),
  aadhaarNumber: z.string().regex(aadhaarRegex, { message: 'Aadhaar number must be exactly 12 digits' }),
  address: z.string().min(10, { message: 'Address is required (minimum 10 characters)' }),
});

type FormValues = z.infer<typeof formSchema>;

interface IndividualFormProps {
  userId: string;
  onSubmit: (data: FormValues, documents: Record<string, string>) => void;
  isLoading?: boolean;
  defaultValues?: Partial<FormValues>;
}

export function IndividualForm({ userId, onSubmit, isLoading = false, defaultValues }: IndividualFormProps) {
  const [documents, setDocuments] = React.useState<Record<string, DocumentUpload>>({
    aadhaarDocument: { file: new File([], "") }
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: defaultValues?.fullName || '',
      mobileNumber: defaultValues?.mobileNumber || '',
      email: defaultValues?.email || '',
      aadhaarNumber: defaultValues?.aadhaarNumber || '',
      address: defaultValues?.address || '',
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
    if (!documents.aadhaarDocument.path) {
      form.setError("aadhaarNumber", { 
        message: "Please upload your Aadhaar document" 
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
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
            name="aadhaarNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aadhaar Number</FormLabel>
                <FormControl>
                  <Input placeholder="12-digit Aadhaar number" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your 12-digit Aadhaar number without spaces
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your complete address" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Document uploads */}
          {/* <div className="space-y-4 mt-6">
            <h4 className="text-sm font-medium">Required Documents</h4>
            <DocumentUploader
              label="Aadhaar Card"
              documentId="aadhaarDocument"
              accept="application/pdf,image/jpeg,image/png"
              onUpload={handleUpload}
              onRemove={handleRemove}
              document={documents.aadhaarDocument}
              userId={userId}
            />
          </div> */}
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
