import React, { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import toast from "react-hot-toast";

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
    
    // Enhanced file validation and processing
    const imageFiles = files.filter(file => 
      file.type.startsWith("image/") || 
      file.type === "image/raw" ||
      file.name.toLowerCase().endsWith(".dng") ||
      file.name.toLowerCase().endsWith(".raw") ||
      file.name.toLowerCase().endsWith(".cr2") ||
      file.name.toLowerCase().endsWith(".nef") ||
      file.name.toLowerCase().endsWith(".arw") ||
      file.name.toLowerCase().endsWith(".json") ||
      file.name.toLowerCase().endsWith(".xmp")
    );
    
    if (imageFiles.length > 100) {
      toast.warning("Maximum 100 files allowed. First 100 files will be processed.");
    }
    
    if (imageFiles.length > 0) {
      onUpload(imageFiles.slice(0, 100));
    }
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
                    multiple
                    accept="image/*,.raw,.dng,.cr2,.nef,.arw,.json,.xmp"
                    onChange={handleFileSelect} />
                <ApperIcon name="FolderOpen" className="w-4 h-4 mr-2" />Browse Files
                            </Button>
            <p className="text-xs text-gray-500">Supports up to 100 images at once • Advanced batch processing available
                            </p>
        </div>
    </CardContent>
</Card>
  );
};

export default UploadArea;