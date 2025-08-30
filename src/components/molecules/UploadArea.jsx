import React, { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { toast } from 'react-toastify';

const UploadArea = ({ onUpload, className }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
const files = Array.from(e.dataTransfer.files);
    
    // Single file validation for optimal performance
    if (files.length > 1) {
      toast.warning("Please upload one image at a time for optimal editing performance.");
      return;
    }
    
    const file = files[0];
    if (!file) return;
    
    // Enhanced file validation for single upload
    const supportedFormats = /\.(jpg|jpeg|png|raw|dng|cr2|nef|arw)$/i;
    const isValidImage = file.type.startsWith("image/") || supportedFormats.test(file.name);
    
    if (!isValidImage) {
      toast.error("Please select a valid image file (JPEG, PNG, or RAW format).");
      return;
    }
    
    // File size check (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB for optimal browser performance
    if (file.size > maxSize) {
      toast.error("File size too large. Please select an image under 50MB.");
      return;
    }
    
    onUpload([file]);
  }, [onUpload]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  return (
    <Card
    className={cn(
        "transition-all duration-300 border-2 border-dashed",
        isDragActive ? "border-ocean-teal bg-ocean-teal/5 scale-105" : "border-slate-dark",
        className
    )}
    onDragEnter={handleDragEnter}
    onDragLeave={handleDragLeave}
    onDragOver={handleDragOver}
    onDrop={handleDrop}>
    <CardContent className="p-8 text-center">
        <div className="space-y-4">
<div className="flex justify-center">
                <div className="p-4 bg-ocean-gradient rounded-full">
                    <ApperIcon name="Upload" className="w-8 h-8 text-white animate-float" />
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">
                    {isDragActive ? "Drop your images here!" : "Upload Underwater Photos"}
                </h3>
                <p className="text-gray-400">Drag and drop your images, DNG presets, or JSON presets here
                                </p>
            </div>
            <Button className="relative overflow-hidden">
                <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
accept="image/*,.raw,.dng,.cr2,.nef,.arw"
                    onChange={handleFileSelect} />
                <ApperIcon name="FolderOpen" className="w-4 h-4 mr-2" />Browse Files
                            </Button>
            <p className="text-xs text-gray-500">Single image upload for optimal performance • Professional RAW support
                            </p>
        </div>
    </CardContent>
</Card>
  );
};

export default UploadArea;