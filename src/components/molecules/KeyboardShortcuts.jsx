import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const KeyboardShortcuts = ({ isOpen, onClose }) => {
  const shortcuts = [
    {
      category: "Navigation",
      shortcuts: [
        { keys: ["Ctrl", "Shift", "P"], description: "Open Command Palette" },
        { keys: ["Ctrl", "K"], description: "Show Keyboard Shortcuts" },
        { keys: ["Ctrl", "1"], description: "Go to Dashboard" },
        { keys: ["Ctrl", "2"], description: "Open Editor" },
        { keys: ["Ctrl", "3"], description: "Browse Presets" },
        { keys: ["Ctrl", "4"], description: "Open Gallery" }
      ]
    },
    {
      category: "Editor Actions", 
      shortcuts: [
        { keys: ["Ctrl", "S"], description: "Save Project" },
        { keys: ["Ctrl", "E"], description: "Export Image" },
        { keys: ["Ctrl", "Z"], description: "Undo" },
        { keys: ["Ctrl", "Y"], description: "Redo" },
        { keys: ["Ctrl", "R"], description: "Reset All Adjustments" },
        { keys: ["Space"], description: "Toggle Before/After View" }
      ]
    },
    {
      category: "Canvas Controls",
      shortcuts: [
        { keys: ["Ctrl", "+"], description: "Zoom In" },
        { keys: ["Ctrl", "-"], description: "Zoom Out" },
        { keys: ["Ctrl", "0"], description: "Fit to Screen" },
        { keys: ["H"], description: "Hand Tool (Pan)" },
        { keys: ["G"], description: "Toggle Grid Overlay" },
        { keys: ["C"], description: "Toggle Comparison Mode" }
      ]
    },
    {
      category: "Adjustments",
      shortcuts: [
        { keys: ["E"], description: "Focus Exposure" },
        { keys: ["T"], description: "Focus Temperature" },
        { keys: ["S"], description: "Focus Saturation" },
        { keys: ["V"], description: "Focus Vibrance" },
        { keys: ["Tab"], description: "Cycle Adjustment Panels" },
        { keys: ["Shift", "Tab"], description: "Cycle Adjustment Panels (Reverse)" }
      ]
    },
    {
category: "Quick Presets",
      shortcuts: [
{ keys: ["1"], description: "Apply Depth Preset" },
        { keys: ["2"], description: "Apply Coral Boost" },
        { keys: ["3"], description: "Apply Blue Water" },
        { keys: ["4"], description: "Apply Surface Light" },
        { keys: ["Ctrl", "Shift", "I"], description: "Import DNG/JSON Presets" },
        { keys: ["Ctrl", "Shift", "E"], description: "Export Preset Collection" },
        { keys: ["0"], description: "Reset to Original" }
      ]
    },
    {
      category: "Tools & Utilities",
      shortcuts: [
        { keys: ["B"], description: "Batch Export Mode" },
        { keys: ["W"], description: "Toggle Watermark" },
        { keys: ["M"], description: "Metadata Editor" },
        { keys: ["F"], description: "Toggle Fullscreen" },
        { keys: ["?"], description: "Show Help" }
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Keyboard" className="w-5 h-5 text-ocean-teal" />
              <span>Keyboard Shortcuts</span>
            </CardTitle>
            <Button variant="ghost" size="small" onClick={onClose}>
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shortcuts.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-3">
                <h3 className="font-semibold text-ocean-teal text-sm uppercase tracking-wider">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.shortcuts.map((shortcut, shortcutIndex) => (
                    <div
                      key={shortcutIndex}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-darker transition-colors"
                    >
                      <span className="text-gray-300 text-sm">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center space-x-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2 py-1 bg-slate-dark border border-slate-darker rounded text-xs font-mono text-gray-300">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-gray-500 text-xs">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-slate-darker rounded-lg border border-slate-dark">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Info" className="w-5 h-5 text-ocean-teal mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white mb-2">Pro Tips</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Hold <kbd className="px-1 py-0.5 bg-slate-dark rounded text-xs">Shift</kbd> while adjusting sliders for fine control</li>
                  <li>• Use <kbd className="px-1 py-0.5 bg-slate-dark rounded text-xs">Alt + Click</kbd> on adjustment labels to reset individual values</li>
                  <li>• Press <kbd className="px-1 py-0.5 bg-slate-dark rounded text-xs">Ctrl + D</kbd> to duplicate current adjustments to clipboard</li>
                  <li>• Double-click any tool icon to access advanced options</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyboardShortcuts;