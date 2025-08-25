"use client"; // This component must be a client component

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //optional validation

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent))
          }
        },

      });
      onSuccess(res)
    } catch (error) {
      console.error("Upload failed", error)
    } finally {
      setUploading(false)
    }
  };

  return (
    <>
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />
      {uploading && <span>Loading....</span>}
    </>
  );
};

export default FileUpload;


// "use client";

// import { IKUpload } from "imagekitio-next";
// import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
// import { useState } from "react";
// import { Loader2 } from "lucide-react";

// interface FileUploadProps {
//   onSuccess: (res: IKUploadResponse) => void; // void means mai output me itna zada focued nahi hu
//   onProgress?: (progress: number) => void;
//   fileType?: "image" | "video";
// }

// export default function FileUpload({
//   onSuccess,
//   onProgress,
//   fileType = "image",
// }: FileUploadProps) {
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const onError = (err: { message: string }) => {
//     setError(err.message);
//     setUploading(false);
//   };

//   const handleSuccess = (response: IKUploadResponse) => {
//     setUploading(false);
//     setError(null);
//     onSuccess(response);
//   };

//   const handleStartUpload = () => {
//     setUploading(true);
//     setError(null);
//   };

//   const handleProgress = (evt: ProgressEvent) => {
//     if (evt.lengthComputable && onProgress) {
//       const percentComplete = (evt.loaded / evt.total) * 100;
//       onProgress(Math.round(percentComplete));
//     }
//   };

//   const validateFile = (file: File) => {
//     if (fileType === "video") {
//       if (!file.type.startsWith("video/")) {
//         setError("Please upload a valid video file");
//         return false;
//       }
//       if (file.size > 100 * 1024 * 1024) {
//         setError("Video size must be less than 100MB");
//         return false;
//       }
//     } else {
//       const validTypes = ["image/jpeg", "image/png", "image/webp"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please upload a valid image file (JPEG, PNG, or WebP)");
//         return false;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("File size must be less than 5MB");
//         return false;
//       }
//     }
//     return true;
//   };

//   return (
//     <div className="space-y-2">
//       <IKUpload
//         fileName={fileType === "video" ? "video" : "image"}
//         onError={onError}
//         onSuccess={handleSuccess}
//         onUploadStart={handleStartUpload}
//         onUploadProgress={handleProgress}
//         accept={fileType === "video" ? "video/*" : "image/*"}
//         className="file-input file-input-bordered w-full"
//         validateFile={validateFile}
//         useUniqueFileName={true}
//         folder={fileType === "video" ? "/videos" : "/images"}
//       />

//       {uploading && (
//         <div className="flex items-center gap-2 text-sm text-primary">
//           <Loader2 className="w-4 h-4 animate-spin" />
//           <span>Uploading...</span>
//         </div>
//       )}

//       {error && <div className="text-error text-sm">{error}</div>}
//     </div>
//   );
// } 