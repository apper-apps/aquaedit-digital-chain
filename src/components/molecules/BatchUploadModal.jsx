import React, { useCallback, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const SingleUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

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
    handleFile(files[0]); // Only take the first file
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file) => {
    if (!file) return;

    // Check if it's a supported image format
    const supportedFormats = /\.(jpg|jpeg|png|raw|dng|cr2|nef|arw)$/i;
    const isValidImage = file.type.startsWith("image/") || supportedFormats.test(file.name);
    
    if (!isValidImage) {
      toast.error("Please select a valid image file (JPEG, PNG, or RAW format)");
      return;
    }

    // Check file size (50MB limit for optimal performance)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error("File size too large. Please select an image under 50MB for optimal performance.");
      return;
    }

    setSelectedFile(file);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    toast.success(`Image selected: ${file.name} (${sizeInMB}MB)`);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload processing with progress
      toast.info("Processing your underwater photo...");
      
      await onUpload([selectedFile]);
      
      toast.success("Image uploaded successfully!");
      setSelectedFile(null);
      onClose();
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Upload" className="w-5 h-5 text-ocean-teal" />
              <span>Upload Underwater Photo</span>
            </CardTitle>
            <Button variant="ghost" size="small" onClick={onClose}>
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Upload Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
              isDragActive 
                ? "border-ocean-teal bg-ocean-teal/5 scale-105" 
                : "border-slate-dark hover:border-ocean-teal/50"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-6 bg-ocean-gradient rounded-full">
                  <ApperIcon 
                    name={isDragActive ? "Download" : "Upload"} 
                    className="w-12 h-12 text-white animate-float" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">
                  {isDragActive ? "Drop your photo here!" : "Upload Your Underwater Photo"}
                </h3>
                <p className="text-gray-400">
                  Supports JPEG, PNG, and RAW formats (DNG, CR2, NEF, ARW)
                </p>
                <p className="text-sm text-ocean-teal">
                  Single image upload for optimal editing performance
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  className="relative overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*,.raw,.dng,.cr2,.nef,.arw"
                    onChange={handleFileSelect}
                  />
                  <ApperIcon name="FolderOpen" className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
                
                <div className="text-xs text-gray-500">
                  <p className="mb-2">Professional features for underwater photography:</p>
                  <div className="grid grid-cols-2 gap-2 text-left max-w-md mx-auto">
                    <div>• Advanced color correction</div>
                    <div>• Underwater preset library</div>
                    <div>• Professional masking tools</div>
                    <div>• RAW format support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-white">Selected Image</h4>
              </div>

              <div className="p-4 bg-slate-darker rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-dark rounded-lg flex items-center justify-center">
                    <ApperIcon name="Image" className="w-6 h-6 text-ocean-teal" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white truncate">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type || 'RAW'}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                  className="flex-1"
                >
                  Choose Different Image
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                      Start Editing
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Performance Tips */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Zap" className="w-5 h-5 text-ocean-teal mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Optimized for Performance</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Single image processing for smooth editing experience</li>
                    <li>• Full RAW support with professional-grade adjustments</li>
                    <li>• Real-time preview with hardware acceleration</li>
                    <li>• Underwater-specific color correction tools</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleUploadModal;