
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Image } from "lucide-react";

interface QRUploaderProps {
  initialUrl?: string;
  onUpload: (url: string) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

const QRUploader: React.FC<QRUploaderProps> = ({
  initialUrl,
  onUpload,
  onDelete,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(initialUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    // Size validation (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    
    setUploading(true);
    try {
      // Upload to Supabase bucket
      const { supabase } = await import("@/integrations/supabase/client");
      const ext = file.name.split(".").pop();
      const filePath = `qrs/${Date.now()}-${Math.random().toString(36).substr(2, 4)}.${ext}`;
      
      const { error } = await supabase.storage.from("qrcodes").upload(filePath, file, {
        upsert: true,
        cacheControl: "3600",
      });
      
      if (error) throw error;

      const { data } = supabase.storage
        .from("qrcodes")
        .getPublicUrl(filePath);
        
      if (!data?.publicUrl) throw new Error("Upload failed. No URL received.");
      
      // Set local state and call parent's callback
      setFileUrl(data.publicUrl);
      onUpload(data.publicUrl);
      toast.success("QR code uploaded successfully");
    } catch (err) {
      console.error("QR upload error:", err);
      toast.error("Failed to upload QR: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {fileUrl ? (
        <div className="relative">
          <img
            src={fileUrl}
            alt="QR code"
            className="w-32 h-32 border rounded object-contain"
          />
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full shadow">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full" 
              onClick={() => document.getElementById('qr-upload')?.click()}
              disabled={disabled || uploading}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-32 h-32 border flex flex-col items-center justify-center rounded bg-muted gap-2">
          <Image className="h-6 w-6 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">No QR</span>
        </div>
      )}
      <label className="w-full">
        <input
          id="qr-upload"
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled || uploading}
          onChange={handleFileChange}
        />
        <Button 
          size="sm" 
          variant="outline" 
          className="mt-1 w-full" 
          disabled={disabled || uploading}
          onClick={() => document.getElementById('qr-upload')?.click()}
        >
          {uploading ? "Uploading..." : (fileUrl ? "Change QR" : "Upload QR")}
        </Button>
      </label>
      {fileUrl && onDelete && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => { setFileUrl(""); onDelete(); }}
          disabled={disabled}
          className="w-full"
        >
          Remove QR
        </Button>
      )}
    </div>
  );
};

export default QRUploader;
