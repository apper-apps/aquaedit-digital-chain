import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Toolbar = ({ onExport, onSave, onUndo, onRedo, canUndo, canRedo, onQuickAccess, onCommandPalette, className }) => {
  const tools = [
    { 
      name: "Selection", 
      icon: "MousePointer2", 
      active: true,
      description: "Selection tool for precise editing" 
    },
    { 
      name: "Crop", 
      icon: "Crop", 
      active: false,
      description: "Crop and straighten images" 
    },
    { 
      name: "Healing", 
      icon: "Eraser", 
      active: false,
      description: "Remove unwanted objects" 
    },
    { 
      name: "Clone", 
      icon: "Copy", 
      active: false,
      description: "Clone parts of the image" 
    },
    { 
      name: "Brush", 
      icon: "Brush", 
      active: false,
      description: "Local adjustments" 
    }
  ];

  return (
    <Card className={cn("w-full lg:w-16 h-fit", className)}>
      <CardContent className="p-2">
        <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
          {/* Main Tools */}
          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
            {tools.map((tool) => (
              <Button
                key={tool.name}
                variant={tool.active ? "primary" : "ghost"}
                size="small"
                className="w-10 h-10 p-0 flex-shrink-0"
                title={tool.description}
              >
                <ApperIcon name={tool.icon} className="w-4 h-4" />
              </Button>
            ))}
          </div>
          
          <div className="hidden lg:block w-full h-px bg-slate-dark my-2"></div>
          <div className="lg:hidden w-px h-8 bg-slate-dark mx-2"></div>
          
          {/* Action Tools */}
          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
            <Button
              variant="ghost"
              size="small"
              className="w-10 h-10 p-0"
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo"
            >
              <ApperIcon name="Undo2" className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="small"
              className="w-10 h-10 p-0"
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo"
            >
              <ApperIcon name="Redo2" className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="small"
              className="w-10 h-10 p-0"
              onClick={onSave}
              title="Save project"
            >
              <ApperIcon name="Save" className="w-4 h-4" />
            </Button>
            
<Button
              variant="secondary"
              size="small"
              className="w-10 h-10 p-0"
              onClick={onExport}
              title="Advanced Export (Ctrl+E)"
            >
              <ApperIcon name="Download" className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="hidden lg:block w-full h-px bg-slate-dark my-2"></div>
          <div className="lg:hidden w-px h-8 bg-slate-dark mx-2"></div>
          
          {/* Quick Access Tools */}
          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
            <Button
              variant="ghost"
              size="small"
              className="w-10 h-10 p-0"
              onClick={onQuickAccess}
              title="Quick Access (Ctrl+Q)"
            >
              <ApperIcon name="Menu" className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="small"
              className="w-10 h-10 p-0"
              onClick={onCommandPalette}
              title="Command Palette (Ctrl+Shift+P)"
            >
              <ApperIcon name="Search" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Toolbar;