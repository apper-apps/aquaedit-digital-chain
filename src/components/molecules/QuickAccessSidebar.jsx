import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const QuickAccessSidebar = ({ className, isOpen, onToggle }) => {
  const navigate = useNavigate();
  const [recentFiles, setRecentFiles] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Mock recent files with thumbnails
  useEffect(() => {
    setRecentFiles([
      {
        id: 1,
        name: "coral_reef_sunset.jpg",
        path: "/editor",
        timestamp: "2 hours ago",
        thumbnail: "/api/placeholder/60/40",
        project: "Maldives Collection"
      },
      {
        id: 2,
        name: "sea_turtle_macro.jpg",
        path: "/editor", 
        timestamp: "Yesterday",
        thumbnail: "/api/placeholder/60/40",
        project: "Marine Life Series"
      },
      {
        id: 3,
        name: "underwater_cave.jpg",
        path: "/editor",
        timestamp: "3 days ago", 
        thumbnail: "/api/placeholder/60/40",
        project: "Cave Diving"
      }
    ]);

    setFavorites([
      { id: 1, name: "Blue Water Preset", type: "preset", icon: "Droplets" },
      { id: 2, name: "Coral Enhancement", type: "preset", icon: "Palette" },
      { id: 3, name: "Quick Tutorial: Color Correction", type: "tutorial", icon: "PlayCircle" }
    ]);
  }, []);

  if (!isOpen) return null;

  return (
    <div className={cn("fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-slate-dark/95 backdrop-blur-sm border-r border-slate-dark z-30 transform transition-transform", className)}>
      <div className="p-4 space-y-4 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Quick Access</h2>
          <Button variant="ghost" size="small" onClick={onToggle}>
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        </div>

        {/* Recent Files */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <ApperIcon name="Clock" className="w-4 h-4 text-ocean-teal" />
              <span>Recent Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => navigate(file.path)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-darker transition-colors cursor-pointer group"
              >
                <div className="w-12 h-8 bg-slate-darker rounded overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-ocean-gradient/20 flex items-center justify-center">
                    <ApperIcon name="Image" className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-ocean-teal">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{file.project}</p>
                  <p className="text-xs text-gray-500">{file.timestamp}</p>
                </div>
                <ApperIcon name="ExternalLink" className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate("/gallery")}
              className="w-full text-xs justify-center mt-2"
            >
              View All Files
              <ApperIcon name="ArrowRight" className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Favorites */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <ApperIcon name="Star" className="w-4 h-4 text-coral" />
              <span>Favorites</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-darker transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 bg-slate-darker rounded-lg flex items-center justify-center flex-shrink-0">
                  <ApperIcon name={item.icon} className="w-4 h-4 text-ocean-teal" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-ocean-teal">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{item.type}</p>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="small"
              className="w-full text-xs justify-center mt-2"
            >
              Manage Favorites
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <ApperIcon name="Zap" className="w-4 h-4 text-coral" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => navigate("/editor")}
              className="w-full justify-start"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              New Edit Session
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => navigate("/presets")}
              className="w-full justify-start"
            >
              <ApperIcon name="Palette" className="w-4 h-4 mr-2" />
              Browse Presets
            </Button>
            <Button
              variant="secondary"
              size="small"
              className="w-full justify-start"
            >
              <ApperIcon name="HelpCircle" className="w-4 h-4 mr-2" />
              Tutorials
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickAccessSidebar;