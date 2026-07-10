"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { UploadCloud } from "lucide-react";

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string | string[]; // Can be a single string (banner) or array (listing)
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value
}) => {
  const handleUpload = useCallback((result: any) => {
    onChange(result.info.secure_url);
  }, [onChange]);

  return (
    <CldUploadWidget 
      onSuccess={handleUpload}
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "couup_uploads"}
      options={{
        maxFiles: 30,
        multiple: true
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2 
              p-20 
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
              bg-neutral-50
              rounded-xl
            "
          >
            <UploadCloud size={50} className="text-neutral-400" />
            <div className="font-semibold text-lg text-neutral-500">
              Click to upload
            </div>
          </div>
        ) 
      }}
    </CldUploadWidget>
  );
}

export default ImageUpload;
