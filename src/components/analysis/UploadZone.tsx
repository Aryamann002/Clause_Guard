
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFile: (file: File) => void;
  onClear: () => void;
  file: File | null;
}

export function UploadZone({ onFile, onClear, file }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFile(accepted[0]);
      setDragActive(false);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  if (file) {
    return (
      <div className="flex items-center gap-3 bg-teal-50 border border-teal-400/30 rounded-xl px-4 py-3.5">
        <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-teal-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-800 truncate">{file.name}</p>
          <p className="text-xs text-teal-600 font-medium">
            <CheckCircle2 className="inline w-3 h-3 mr-1" />
            Ready to analyze · {(file.size / 1024).toFixed(0)} KB
          </p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-all duration-200",
        isDragActive || dragActive
          ? "border-teal-400 bg-teal-50"
          : "border-stone-200 bg-white hover:border-teal-300 hover:bg-teal-50/50"
      )}
    >
      <input {...getInputProps()} />
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors",
          isDragActive ? "bg-teal-100" : "bg-stone-100"
        )}
      >
        <Upload
          className={cn(
            "w-6 h-6 transition-colors",
            isDragActive ? "text-teal-600" : "text-stone-500"
          )}
        />
      </div>
      <p className="font-semibold text-stone-700 mb-1">
        {isDragActive ? "Drop it here" : "Drop your contract here"}
      </p>
      <p className="text-sm text-stone-400">
        Supports PDF and TXT · Max 10 MB
      </p>
      <p className="text-xs text-teal-600 font-medium mt-2">
        or click to browse files
      </p>
    </div>
  );
}
