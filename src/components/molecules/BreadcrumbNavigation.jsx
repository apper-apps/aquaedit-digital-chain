import React from "react";
import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BreadcrumbNavigation = ({ className }) => {
  const location = useLocation();
  
  // Map paths to breadcrumb segments
  const pathMap = {
    "/": { name: "Dashboard", icon: "Home" },
    "/editor": { name: "Editor", icon: "Edit3" },
    "/presets": { name: "Presets", icon: "Palette" },
    "/gallery": { name: "Gallery", icon: "Images" }
  };

  // Build breadcrumb segments
  const segments = [];
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Always include home
  segments.push({ path: "/", name: "Dashboard", icon: "Home", current: false });
  
  // Add current path if not home
  if (location.pathname !== "/") {
    const currentPath = pathMap[location.pathname];
    if (currentPath) {
      segments.push({ 
        path: location.pathname, 
        name: currentPath.name, 
        icon: currentPath.icon, 
        current: true 
      });
    }
  } else {
    segments[0].current = true;
  }

  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)}>
      {segments.map((segment, index) => (
        <React.Fragment key={segment.path}>
          {index > 0 && (
            <ApperIcon name="ChevronRight" className="w-3 h-3 text-gray-500" />
          )}
          <div className="flex items-center space-x-1">
            {segment.current ? (
              <div className="flex items-center space-x-1 text-ocean-teal">
                <ApperIcon name={segment.icon} className="w-3 h-3" />
                <span className="font-medium">{segment.name}</span>
              </div>
            ) : (
              <Link 
                to={segment.path}
                className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
              >
                <ApperIcon name={segment.icon} className="w-3 h-3" />
                <span>{segment.name}</span>
              </Link>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNavigation;