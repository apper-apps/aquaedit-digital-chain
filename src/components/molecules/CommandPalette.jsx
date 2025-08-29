import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState([]);

  // Command definitions
  const commands = [
    // Navigation
    { id: "nav-dashboard", name: "Go to Dashboard", description: "Navigate to main dashboard", icon: "Home", action: () => navigate("/"), category: "Navigation" },
    { id: "nav-editor", name: "Open Editor", description: "Start editing images", icon: "Edit3", action: () => navigate("/editor"), category: "Navigation" },
    { id: "nav-presets", name: "Browse Presets", description: "View available presets", icon: "Palette", action: () => navigate("/presets"), category: "Navigation" },
    { id: "nav-gallery", name: "Open Gallery", description: "View image gallery", icon: "Images", action: () => navigate("/gallery"), category: "Navigation" },
    
    // Editor Actions
    { id: "editor-export", name: "Export Image", description: "Export current image with settings", icon: "Download", action: () => {}, category: "Editor" },
    { id: "editor-save", name: "Save Project", description: "Save current editing project", icon: "Save", action: () => {}, category: "Editor" },
    { id: "editor-undo", name: "Undo Last Action", description: "Undo the last edit", icon: "Undo2", action: () => {}, category: "Editor" },
    { id: "editor-redo", name: "Redo Action", description: "Redo the last undone action", icon: "Redo2", action: () => {}, category: "Editor" },
    { id: "editor-reset", name: "Reset All Adjustments", description: "Reset all editing adjustments", icon: "RotateCcw", action: () => {}, category: "Editor" },
    
    // Quick Adjustments
    { id: "adj-exposure", name: "Adjust Exposure", description: "Quick exposure adjustment", icon: "Sun", action: () => {}, category: "Adjustments" },
    { id: "adj-contrast", name: "Adjust Contrast", description: "Quick contrast adjustment", icon: "Circle", action: () => {}, category: "Adjustments" },
    { id: "adj-saturation", name: "Adjust Saturation", description: "Quick saturation adjustment", icon: "Droplets", action: () => {}, category: "Adjustments" },
    { id: "adj-wb", name: "Auto White Balance", description: "Apply automatic white balance", icon: "Thermometer", action: () => {}, category: "Adjustments" },
    
    // Presets
    { id: "preset-underwater", name: "Apply Underwater Preset", description: "Apply underwater color correction", icon: "Waves", action: () => {}, category: "Presets" },
    { id: "preset-coral", name: "Apply Coral Boost", description: "Enhance coral colors", icon: "Palette", action: () => {}, category: "Presets" },
    { id: "preset-blue", name: "Apply Blue Water", description: "Enhance blue water tones", icon: "Droplets", action: () => {}, category: "Presets" },
    
    // Help & Tools
    { id: "help-shortcuts", name: "View Keyboard Shortcuts", description: "Show all keyboard shortcuts", icon: "Keyboard", action: () => {}, category: "Help" },
    { id: "help-tutorials", name: "Open Tutorials", description: "View learning resources", icon: "PlayCircle", action: () => {}, category: "Help" },
    { id: "tool-batch-export", name: "Batch Export", description: "Export multiple images", icon: "Layers", action: () => {}, category: "Tools" }
  ];

  // Filter commands based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredCommands(commands.slice(0, 8)); // Show first 8 by default
    } else {
      const filtered = commands.filter(command =>
        command.name.toLowerCase().includes(query.toLowerCase()) ||
        command.description.toLowerCase().includes(query.toLowerCase()) ||
        command.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCommands(filtered.slice(0, 10)); // Limit to 10 results
    }
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  const executeCommand = useCallback((command) => {
    command.action();
    onClose();
    setQuery("");
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 z-50">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-0">
          {/* Search Input */}
          <div className="p-4 border-b border-slate-dark">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="pl-10 text-base"
                autoFocus
              />
            </div>
          </div>

          {/* Command List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <ApperIcon name="Search" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No commands found</p>
                <p className="text-sm">Try searching for "export", "preset", or "navigate"</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => executeCommand(command)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-darker transition-colors",
                      selectedIndex === index && "bg-slate-darker border-r-2 border-ocean-teal"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      selectedIndex === index ? "bg-ocean-teal/20" : "bg-slate-dark"
                    )}>
                      <ApperIcon 
                        name={command.icon} 
                        className={cn(
                          "w-4 h-4",
                          selectedIndex === index ? "text-ocean-teal" : "text-gray-400"
                        )} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium",
                        selectedIndex === index ? "text-white" : "text-gray-200"
                      )}>
                        {command.name}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {command.description}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 bg-slate-dark px-2 py-1 rounded">
                      {command.category}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-dark bg-slate-darker/50">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-dark rounded text-xs">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-dark rounded text-xs">Enter</kbd>
                  <span>Execute</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-dark rounded text-xs">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
              <div className="text-ocean-teal">
                {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommandPalette;