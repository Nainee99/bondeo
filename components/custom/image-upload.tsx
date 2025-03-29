"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { Loader2Icon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

function ImageUpload({ endpoint, onChange, value }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle file selection for preview before upload
  const handleFileSelect = (file: File) => {
    // Create a local preview URL
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // Clean up the URL when component unmounts
    return () => URL.revokeObjectURL(localPreview);
  };

  // Reset preview and value
  const handleRemove = () => {
    onChange("");
    setPreviewUrl(null);
  };

  // If we have an uploaded image or a preview
  if (value || previewUrl) {
    return (
      <div className="relative w-full">
        <div className="rounded-lg overflow-hidden border border-muted/50 bg-muted/20 shadow-sm">
          <div className="aspect-video relative group">
            <img
              src={value || previewUrl || "/placeholder.svg"}
              alt="Upload"
              className="w-full h-full object-cover transition-all duration-200 group-hover:brightness-95"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                onClick={handleRemove}
                className="bg-black/70 hover:bg-black/90 text-white rounded-full p-2"
                size="icon"
                variant="ghost"
                aria-label="Remove image"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="p-3 text-xs flex justify-between items-center bg-muted/30">
            <span className="text-muted-foreground">
              {isUploading
                ? "Uploading..."
                : value
                ? "Image uploaded successfully"
                : "Preview (not uploaded yet)"}
            </span>
            <Button
              onClick={handleRemove}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isUploading ? (
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-10 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2Icon className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm font-medium">Uploading your image...</p>
          <p className="text-xs text-muted-foreground">
            Please wait while we process your image
          </p>
        </div>
      ) : (
        <UploadDropzone
          endpoint={endpoint}
          onUploadBegin={() => setIsUploading(true)}
          onClientUploadComplete={(res) => {
            setIsUploading(false);
            setPreviewUrl(null); // Clear preview when upload is complete
            onChange(res?.[0].ufsUrl);
          }}
          onUploadError={(error: Error) => {
            setIsUploading(false);
            console.log(error);
          }}
          className={cn(
            "ut-label:text-primary ut-allowed-content:text-muted-foreground",
            "border-2 border-dashed border-muted-foreground/30 rounded-lg",
            "ut-upload-icon:text-primary",
            "ut-upload-icon:size-12 p-8"
          )}
          appearance={{
            button: {
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              padding: "8px 16px",
              borderRadius: "9999px",
            },
            label: {
              fontSize: "1rem",
              fontWeight: "500",
              marginTop: "1rem",
            },
            allowedContent: {
              fontSize: "0.875rem",
              color: "hsl(var(--muted-foreground))",
              marginTop: "0.5rem",
              marginBottom: "1rem",
            },
          }}
          onBeforeUploadBegin={(files) => {
            // Create preview for the first file
            if (files.length > 0) {
              handleFileSelect(files[0]);
            }
            return files;
          }}
        />
      )}
    </div>
  );
}

export default ImageUpload;
