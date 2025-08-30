import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const MobileNavigationTabs = ({ 
  activeTab, 
  onTabChange, 
  tabs = ['develop', 'presets', 'export'],
  className 
}) => {
  const tabConfig = {
    develop: { icon: 'Edit3', label: 'Develop' },
    presets: { icon: 'Palette', label: 'Presets' },
    export: { icon: 'Download', label: 'Export' },
    community: { icon: 'Users', label: 'Community' }
  };

  return (
    <div className={cn(
      "lg:hidden flex bg-slate-dark/95 backdrop-blur-sm border-b border-slate-dark",
      className
    )}>
      <div className="flex flex-1">
        {tabs.map((tab) => {
          const config = tabConfig[tab];
          const isActive = activeTab === tab;
          
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "text-ocean-teal border-b-2 border-ocean-teal bg-ocean-teal/10" 
                  : "text-gray-400 hover:text-white hover:bg-slate-darker"
              )}
            >
              <ApperIcon name={config.icon} className="w-4 h-4" />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigationTabs;