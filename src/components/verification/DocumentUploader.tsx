
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { DocumentUpload } from '@/types/verification';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DocumentUploaderProps {
  label: string;
  documentId: string;
  accept?: string;
  maxSize?: number; // in MB
  onUpload: (docId: string, path: string) => void;
  onRemove: (docId: string) => void;
  document?: DocumentUpload;
  userId: string;
}

const DocumentUploader = ({
  label,
  documentId,
  accept = "application/pdf,image/jpeg,image/png",
  maxSize = 5,
  onUpload,
  onRemove,
  document,
  userId
}: DocumentUploaderProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    
    setUploading(true);
    
    try {
      // First check if bucket exists, create it if it doesn't
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        throw bucketError;
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === 'verification_documents');
      
      if (!bucketExists) {
        // We can't create buckets from the client, so we'll show an error
        toast.error('Verification documents storage not configured');
        throw new Error('Bucket "verification_documents" does not exist');
      }
      
      // Create a unique file path for the user
      const filePath = `${userId}/${documentId}_${new Date().getTime()}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('verification_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Call the onUpload callback with the path
      onUpload(documentId, data.path);
      toast.success('Document uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Error uploading document: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  
  const removeFile = () => {
    onRemove(documentId);
  };
  
  if (document?.url) {
    return (
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="flex items-center p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
          <FileText className="h-5 w-5 text-blue-500 mr-3" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Document uploaded</p>
            <p className="text-xs text-gray-500">{document.file?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {uploading && "(Uploading...)"}
      </label>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDF, PNG or JPG (max. {maxSize}MB)
            </p>
          </div>
          <input
            id={`file-${documentId}`}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      {uploading && (
        <Progress value={document?.progress || 0} className="h-1 w-full" />
      )}
    </div>
  );
};

export default DocumentUploader;
