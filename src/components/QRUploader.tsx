
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

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
      setFileUrl(data.publicUrl);
      onUpload(data.publicUrl);
    } catch (err) {
      alert("Failed to upload QR: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {fileUrl ? (
        <img
          src={fileUrl}
          alt="QR code"
          className="w-32 h-32 border rounded object-contain"
        />
      ) : (
        <div className="w-32 h-32 border flex items-center justify-center rounded bg-muted">
          <span className="text-xs text-muted-foreground">No QR</span>
        </div>
      )}
      <label>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled || uploading}
          onChange={handleFileChange}
        />
        <Button size="sm" variant="outline" className="mt-1" disabled={disabled || uploading}>
          {uploading ? "Uploading..." : (fileUrl ? "Change QR" : "Upload QR")}
        </Button>
      </label>
      {fileUrl && onDelete && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => { setFileUrl(""); onDelete(); }}
          disabled={disabled}
        >
          Remove QR
        </Button>
      )}
    </div>
  );
};

export default QRUploader;
