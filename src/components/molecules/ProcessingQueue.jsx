import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ProcessingQueue = ({
  queue,
  isProcessing,
  onStartProcessing,
  onPauseProcessing
}) => {
  const [processingStats, setProcessingStats] = useState({
    completed: 0,
    failed: 0,
    remaining: 0,
    estimatedTimeRemaining: 0
  });
  
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (isProcessing && !startTime) {
      setStartTime(Date.now());
    } else if (!isProcessing) {
      setStartTime(null);
    }
  }, [isProcessing, startTime]);

  useEffect(() => {
    const completed = queue.filter(item => item.status === "processed").length;
    const failed = queue.filter(item => item.status === "failed").length;
    const remaining = queue.length - completed - failed;
    
    let estimatedTimeRemaining = 0;
    if (isProcessing && completed > 0 && startTime) {
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      const avgTimePerImage = elapsed / completed;
      estimatedTimeRemaining = avgTimePerImage * remaining;
    }

    setProcessingStats({
      completed,
      failed,
      remaining,
      estimatedTimeRemaining
    });
  }, [queue, isProcessing, startTime]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processed": return "text-emerald-400";
      case "processing": return "text-ocean-teal";
      case "failed": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "processed": return "CheckCircle";
      case "processing": return "Loader2";
      case "failed": return "AlertCircle";
      default: return "Clock";
    }
  };

  const progressPercentage = queue.length > 0 
    ? (processingStats.completed / queue.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Processing Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Play" className="w-5 h-5 text-ocean-teal" />
              <span>Batch Processing Queue</span>
            </CardTitle>
            <div className="flex space-x-2">
              {isProcessing ? (
                <Button variant="secondary" onClick={onPauseProcessing}>
                  <ApperIcon name="Pause" className="w-4 h-4 mr-2" />
                  Pause Processing
                </Button>
              ) : (
                <Button onClick={onStartProcessing} disabled={queue.length === 0}>
                  <ApperIcon name="Play" className="w-4 h-4 mr-2" />
                  Start Processing ({queue.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Overall Progress</span>
              <span className="text-ocean-teal font-medium">
                {processingStats.completed} / {queue.length} completed
              </span>
            </div>
            
            <div className="w-full bg-slate-dark rounded-full h-3">
              <div 
                className="bg-ocean-teal h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-slate-darker rounded-lg">
                <div className="text-lg font-semibold text-emerald-400">
                  {processingStats.completed}
                </div>
                <div className="text-xs text-gray-400">Completed</div>
              </div>
              <div className="p-3 bg-slate-darker rounded-lg">
                <div className="text-lg font-semibold text-ocean-teal">
                  {processingStats.remaining}
                </div>
                <div className="text-xs text-gray-400">Remaining</div>
              </div>
              <div className="p-3 bg-slate-darker rounded-lg">
                <div className="text-lg font-semibold text-red-400">
                  {processingStats.failed}
                </div>
                <div className="text-xs text-gray-400">Failed</div>
              </div>
              <div className="p-3 bg-slate-darker rounded-lg">
                <div className="text-lg font-semibold text-amber-400">
                  {isProcessing && processingStats.estimatedTimeRemaining > 0
                    ? formatTime(processingStats.estimatedTimeRemaining)
                    : "--"
                  }
                </div>
                <div className="text-xs text-gray-400">ETA</div>
              </div>
            </div>
          </div>

          {/* Processing Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-dark">
            <div className="space-y-2">
              <h4 className="font-medium text-white">Processing Settings</h4>
              <div className="space-y-1 text-sm text-gray-400">
                <div>• Background processing enabled</div>
                <div>• Auto-save processed images</div>
                <div>• Resume interrupted sessions</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-white">Output Options</h4>
              <div className="space-y-1 text-sm text-gray-400">
                <div>• Maintain original quality</div>
                <div>• Preserve EXIF metadata</div>
                <div>• Generate preview thumbnails</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-white">After Processing</h4>
              <div className="space-y-1 text-sm text-gray-400">
                <div>• Open in editor automatically</div>
                <div>• Create processing report</div>
                <div>• Export batch summary</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue Items */}
      {queue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Items ({queue.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {queue.map((item, index) => (
                <div 
                  key={item.Id}
                  className={cn(
                    "flex items-center space-x-4 p-3 rounded-lg transition-all duration-200",
                    item.status === "processing" 
                      ? "bg-ocean-teal/10 border border-ocean-teal/30" 
                      : "bg-slate-darker"
                  )}
                >
                  <div className="text-sm text-gray-400 min-w-[30px]">
                    #{index + 1}
                  </div>
                  
                  <img 
                    src={item.url}
                    alt={item.filename}
                    className="w-12 h-12 object-cover rounded"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {item.filename}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.preset ? `Preset: ${item.preset}` : "No preset assigned"}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={cn("text-sm font-medium", getStatusColor(item.status))}>
                      {item.status || "queued"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.status === "processing" && "In progress..."}
                      {item.status === "processed" && "Complete"}
                      {item.status === "failed" && "Error"}
                      {!item.status && "Waiting"}
                    </div>
                  </div>
                  
                  <ApperIcon 
                    name={getStatusIcon(item.status)} 
                    className={cn(
                      "w-5 h-5",
                      getStatusColor(item.status),
                      item.status === "processing" && "animate-spin"
                    )}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {queue.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-slate-dark rounded-full">
                <ApperIcon name="FileImage" className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No Items in Processing Queue
            </h3>
            <p className="text-gray-400">
              Upload and analyze images, then assign presets to start batch processing.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Resume Checkpoint Info */}
      {isProcessing && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Shield" className="w-5 h-5 text-ocean-teal mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-white">
                  Checkpoint System Active
                </div>
                <div className="text-xs text-gray-400">
                  Processing progress is automatically saved. If interrupted, you can resume from the last completed image.
                  All processed images are safely stored and won't be lost.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProcessingQueue;