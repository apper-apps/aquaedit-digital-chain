import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Footer = ({ className }) => {
  const socialLinks = [
    { name: "GitHub", icon: "Github", href: "#" },
    { name: "Twitter", icon: "Twitter", href: "#" },
    { name: "YouTube", icon: "Youtube", href: "#" },
    { name: "Instagram", icon: "Instagram", href: "#" }
  ];

  const helpLinks = [
    { name: "User Guide", href: "#" },
    { name: "Tutorials", href: "#" },
    { name: "Keyboard Shortcuts", href: "#" },
    { name: "Support", href: "#" }
  ];

  return (
    <footer className={cn("bg-slate-dark border-t border-slate-dark", className)}>
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-ocean-gradient rounded-lg flex items-center justify-center">
                <ApperIcon name="Waves" className="w-5 h-5 text-white" />
              </div>
<h3 className="text-lg font-semibold text-white">DepthRoom Studio</h3>
            </div>
<p className="text-gray-400 text-sm">
              Professional depth-focused photo editing studio designed specifically for underwater photographers.
              Transform your depth explorations into stunning aquatic masterpieces.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-medium">Help & Resources</h4>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-ocean-teal transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-medium">Connect</h4>
            <div className="flex items-center space-x-2">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  size="small"
                  className="w-10 h-10 p-0"
                  title={link.name}
                >
                  <ApperIcon name={link.icon} className="w-4 h-4" />
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-400">
                Made with ❤️ for the diving community
              </p>
              <p className="text-xs text-gray-500">
© 2024 DepthRoom Studio. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;