import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/cn';

const StatusBar = ({ 
  imageInfo, 
  zoom = 100, 
  isProcessing = false, 
  processingStatus = '',
  className 
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 h-8 bg-slate-dark/95 backdrop-blur-sm border-t border-slate-dark flex items-center justify-between px-4 text-xs text-gray-300 z-40",
      className
    )}>
      <div className="flex items-center space-x-4">
        {/* Image Info */}
        {imageInfo ? (
          <>
            <span>{imageInfo.name}</span>
            <span className="text-gray-500">|</span>
            <span>{imageInfo.width} × {imageInfo.height}</span>
            <span className="text-gray-500">|</span>
            <span>{formatFileSize(imageInfo.size)}</span>
            <span className="text-gray-500">|</span>
            <span>{imageInfo.format?.toUpperCase()}</span>
          </>
        ) : (
          <span className="text-gray-500">No image selected</span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Processing Status */}
        {isProcessing && (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-ocean-teal rounded-full animate-pulse"></div>
              <span className="text-ocean-teal">{processingStatus || 'Processing...'}</span>
            </div>
            <span className="text-gray-500">|</span>
          </>
        )}
        
        {/* Zoom Level */}
        <span>Zoom: {Math.round(zoom)}%</span>
        <span className="text-gray-500">|</span>
        
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="small" 
          onClick={toggleTheme}
          className="h-6 w-6 p-0"
          title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          <ApperIcon 
            name={isDarkMode ? 'Sun' : 'Moon'} 
            className="w-3 h-3" 
          />
        </Button>
      </div>
    </div>
  );
};

export default StatusBar;