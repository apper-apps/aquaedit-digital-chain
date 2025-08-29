import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const SmartGrouping = ({ 
  images, 
  groups, 
  onGroupsChange, 
  criteria, 
  onCriteriaChange,
  onNext 
}) => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [viewMode, setViewMode] = useState("groups");

  useEffect(() => {
    if (groups.length > 0) {
      setSelectedGroups(groups.map(g => g.id));
    }
  }, [groups]);

  const handleCriteriaChange = (key, value) => {
    onCriteriaChange({ ...criteria, [key]: value });
  };

  const handleGroupSelection = (groupId, selected) => {
    if (selected) {
      setSelectedGroups(prev => [...prev, groupId]);
    } else {
      setSelectedGroups(prev => prev.filter(id => id !== groupId));
    }
  };

const handleCreateGroups = () => {
    // Trigger grouping logic in parent component
    if (typeof window !== 'undefined' && window.CustomEvent) {
      const event = new window.CustomEvent('createGroups', { detail: criteria });
      window.dispatchEvent(event);
    }
  };

  const renderGroupingCriteria = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="Settings" className="w-5 h-5 text-ocean-teal" />
          <span>Grouping Criteria</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-white">Time-Based Grouping</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.byTimestamp}
                  onChange={(e) => handleCriteriaChange('byTimestamp', e.target.checked)}
                  className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                />
                <span className="text-gray-300">Group by dive session (30min gaps)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.byDiveSession}
                  onChange={(e) => handleCriteriaChange('byDiveSession', e.target.checked)}
                  className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                />
                <span className="text-gray-300">Extended dive sessions (2+ hours)</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white">Condition-Based Grouping</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.byLightingConditions}
                  onChange={(e) => handleCriteriaChange('byLightingConditions', e.target.checked)}
                  className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                />
                <span className="text-gray-300">Group by lighting conditions</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.byDepth}
                  onChange={(e) => handleCriteriaChange('byDepth', e.target.checked)}
                  className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                />
                <span className="text-gray-300">Group by estimated depth</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.bySimilarExposure}
                  onChange={(e) => handleCriteriaChange('bySimilarExposure', e.target.checked)}
                  className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                />
                <span className="text-gray-300">Group by camera settings</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-dark">
          <Button onClick={handleCreateGroups} className="w-full">
            <ApperIcon name="Layers" className="w-4 h-4 mr-2" />
            Create Smart Groups ({images.length} images)
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderGroups = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Smart Groups ({groups.length})
        </h3>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === "groups" ? "primary" : "ghost"}
            size="small"
            onClick={() => setViewMode("groups")}
          >
            <ApperIcon name="Layers" className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "ghost"}
            size="small"
            onClick={() => setViewMode("list")}
          >
            <ApperIcon name="List" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => (
          <Card 
            key={group.id}
            className={cn(
              "transition-all duration-200",
              selectedGroups.includes(group.id) 
                ? "border-ocean-teal bg-ocean-teal/5" 
                : "border-slate-dark"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group.id)}
                    onChange={(e) => handleGroupSelection(group.id, e.target.checked)}
                    className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                  />
                  <div>
                    <CardTitle className="text-base">{group.name}</CardTitle>
                    <p className="text-sm text-gray-400">{group.criteria}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-ocean-teal">
                    {group.images.length} images
                  </div>
                  <div className="text-xs text-gray-400">
                    {group.type}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-4 gap-2">
                {group.images.slice(0, 8).map((image, index) => (
                  <div key={image.Id} className="relative">
                    <img 
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-16 object-cover rounded"
                    />
                    {index === 7 && group.images.length > 8 && (
                      <div className="absolute inset-0 bg-black/70 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          +{group.images.length - 8}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {group.images.length > 0 && (
                <div className="mt-3 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Time Range:</span>
                    <span>
                      {new Date(Math.min(...group.images.map(img => new Date(img.metadata.lastModified)))).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Size Range:</span>
                    <span>
                      {(Math.min(...group.images.map(img => img.size)) / (1024*1024)).toFixed(1)}MB - {(Math.max(...group.images.map(img => img.size)) / (1024*1024)).toFixed(1)}MB
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length > 0 && (
        <div className="flex justify-between items-center pt-6 border-t border-slate-dark">
          <div className="text-sm text-gray-400">
            {selectedGroups.length} of {groups.length} groups selected • {groups.reduce((total, group) => total + group.images.length, 0)} total images
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="secondary"
              onClick={() => setSelectedGroups(groups.map(g => g.id))}
            >
              Select All Groups
            </Button>
            <Button 
              onClick={onNext}
              disabled={selectedGroups.length === 0}
            >
              <ApperIcon name="ArrowRight" className="w-4 h-4 mr-2" />
              Check for Duplicates
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {groups.length === 0 ? (
        renderGroupingCriteria()
      ) : (
        renderGroups()
      )}
    </div>
  );
};

export default SmartGrouping;