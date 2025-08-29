import React, { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";

const BatchUploadModal = ({ isOpen, onClose, onUpload, maxFiles = 100 }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
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
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files) => {
    // Filter for supported image formats
    const imageFiles = files.filter(file => 
      file.type.startsWith("image/") || 
      file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|tiff|raw|dng|cr2|nef|arw)$/i)
    );

    if (imageFiles.length === 0) {
      toast.error("No supported image files found");
      return;
    }

    if (imageFiles.length > maxFiles) {
      toast.warning(`Maximum ${maxFiles} files allowed. First ${maxFiles} files will be selected.`);
    }

    const validFiles = imageFiles.slice(0, maxFiles);
    setSelectedFiles(validFiles);
    
    // Show file summary
    toast.info(`Selected ${validFiles.length} images for upload`);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No files selected");
      return;
    }

    setIsUploading(true);
    
    try {
      await onUpload(selectedFiles);
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Upload" className="w-5 h-5 text-ocean-teal" />
              <span>Batch Upload - Underwater Photos</span>
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
                  {isDragActive ? "Drop your images here!" : "Drag & Drop Underwater Photos"}
                </h3>
                <p className="text-gray-400">
                  Support for JPEG, PNG, RAW, DNG, CR2, NEF, ARW formats
                </p>
                <p className="text-sm text-ocean-teal">
                  Up to {maxFiles} images • Advanced processing included
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
                    multiple
                    accept="image/*,.raw,.dng,.cr2,.nef,.arw"
                    onChange={handleFileSelect}
                  />
                  <ApperIcon name="FolderOpen" className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Features included:</p>
                  <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                    <li>Smart grouping by dive session & conditions</li>
                    <li>Automatic duplicate detection</li>
                    <li>AI-powered underwater condition analysis</li>
                    <li>Batch preset recommendations</li>
                    <li>Background processing with resume capability</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-white">
                  Selected Files ({selectedFiles.length})
                </h4>
                <div className="text-sm text-gray-400">
                  Total: {formatFileSize(selectedFiles.reduce((total, file) => total + file.size, 0))}
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {selectedFiles.map((file, index) => (
                  <div 
                    key={`${file.name}_${index}`}
                    className="flex items-center justify-between p-3 bg-slate-darker rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-dark rounded flex items-center justify-center">
                        <ApperIcon name="Image" className="w-4 h-4 text-ocean-teal" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white truncate max-w-xs">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatFileSize(file.size)} • {file.type}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedFiles([])}
                  disabled={isUploading}
                >
                  Clear All
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
                      Start Upload ({selectedFiles.length} files)
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Upload Tips */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Info" className="w-5 h-5 text-ocean-teal mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Pro Tips for Best Results</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Group photos from same dive session for better analysis</li>
                    <li>• Include EXIF data for accurate depth/lighting detection</li>
                    <li>• RAW files provide more adjustment flexibility</li>
                    <li>• Processing happens in background - you can continue editing</li>
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

export default BatchUploadModal;