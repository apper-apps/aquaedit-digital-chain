import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ className }) => {
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: "Home" },
    { name: "Editor", path: "/editor", icon: "Edit3" },
    { name: "Presets", path: "/presets", icon: "Palette" },
    { name: "Gallery", path: "/gallery", icon: "Images" }
  ];

  return (
    <header className={cn("bg-slate-dark/95 backdrop-blur-sm border-b border-slate-dark sticky top-0 z-40", className)}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-ocean-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ApperIcon name="Waves" className="w-6 h-6 text-white animate-wave" />
              </div>
              <div className="absolute -inset-1 bg-ocean-gradient rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-ocean-teal bg-clip-text text-transparent">
                AquaEdit Pro
              </h1>
              <p className="text-xs text-gray-400">Transform Your Underwater Shots</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-ocean-teal/20 text-ocean-teal"
                    : "text-gray-300 hover:text-white hover:bg-slate-darker"
                )}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

<div className="flex items-center space-x-2">
            <Button variant="ghost" size="small" className="md:hidden">
              <ApperIcon name="Menu" className="w-5 h-5" />
            </Button>
            <div className="hidden lg:flex items-center space-x-2 text-xs text-gray-400 mr-4">
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-slate-darker rounded text-xs">Ctrl+Shift+P</kbd>
                <span>Command</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-slate-darker rounded text-xs">Ctrl+K</kbd>
                <span>Shortcuts</span>
              </div>
            </div>
            <Button variant="secondary" size="small">
              <ApperIcon name="HelpCircle" className="w-4 h-4 mr-2" />
              Help
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex items-center space-x-1 overflow-x-auto pb-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200",
                location.pathname === item.path
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