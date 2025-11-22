import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ className }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.user);
  const { logout } = useAuth();

const navigationItems = [
    { name: "Develop", path: "/develop", icon: "Edit3" },
    { name: "Presets", path: "/presets", icon: "Palette" },
    { name: "Export", path: "/export", icon: "Download" },
    { name: "Community", path: "/community", icon: "Users" }
  ];
  
  const secondaryItems = [
    { name: "Gallery", path: "/gallery", icon: "Images" },
    { name: "Dashboard", path: "/dashboard", icon: "BarChart3" }
  ];

return (
    <header className={cn("bg-slate-dark/95 backdrop-blur-sm border-b border-slate-dark sticky top-0 z-40", className)}>
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-8 h-8 bg-ocean-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ApperIcon name="Waves" className="w-5 h-5 text-white animate-wave" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-ocean-teal bg-clip-text text-transparent">
                AquaEdit Pro
              </h1>
            </div>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center space-x-1 mr-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
                    location.pathname === item.path || 
                    (item.path === '/develop' && location.pathname === '/editor')
                      ? "bg-ocean-teal/20 text-ocean-teal"
                      : "text-gray-300 hover:text-white hover:bg-slate-darker"
                  )}
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-1 border-l border-slate-dark pl-6">
              {secondaryItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                    location.pathname === item.path
                      ? "bg-ocean-teal/20 text-ocean-teal"
                      : "text-gray-400 hover:text-white hover:bg-slate-darker"
                  )}
                >
                  <ApperIcon name={item.icon} className="w-3 h-3" />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

<div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                size="small" 
                onClick={logout}
                className="text-ocean-teal hover:text-white"
              >
                <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="small">
                  <ApperIcon name="LogIn" className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="small" className="md:hidden">
              <ApperIcon name="Menu" className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-3 flex items-center space-x-1 overflow-x-auto pb-1">
          {[...navigationItems, ...secondaryItems].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200",
                location.pathname === item.path ||
                (item.path === '/develop' && location.pathname === '/editor')
                  ? "bg-ocean-teal/20 text-ocean-teal"
                  : "text-gray-300 hover:text-white hover:bg-slate-darker"
              )}
            >
              <ApperIcon name={item.icon} className="w-4 h-4" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
export default Header;