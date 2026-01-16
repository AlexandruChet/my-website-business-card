import { useState, type ChangeEvent } from "react";

interface UseFileInputOptions {
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const useFileInput = (
  options: UseFileInputOptions = {}
) => {
  const { allowedTypes, maxSizeMB } = options;

  const [file, setFile] = useState<File | null>(null);
  const [fileSizeText, setFileSizeText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setError(null);

    if (!selectedFile) {
      setFile(null);
      setFileSizeText("");
      return;
    }

    if (
      allowedTypes &&
      !allowedTypes.includes(selectedFile.type)
    ) {
      setError("Invalid file type");
      return;
    }

    if (
      maxSizeMB &&
      selectedFile.size > maxSizeMB * 1024 * 1024
    ) {
      setError(`File must be smaller than ${maxSizeMB}MB`);
      return;
    }

    setFile(selectedFile);
    setFileSizeText(formatFileSize(selectedFile.size));
  };

  const clearFile = () => {
    setFile(null);
    setFileSizeText("");
    setError(null);
  };

  return {
    file,
    fileSizeText,
    error,
    handleFileChange,
    clearFile,
  };
};
