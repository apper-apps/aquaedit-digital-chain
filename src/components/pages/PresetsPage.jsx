import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import PresetImportModal from "@/components/molecules/PresetImportModal";
import PresetCard from "@/components/molecules/PresetCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { createPreset, exportPresets, getPresets, importPresets } from "@/services/api/projectService";
const PresetsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isImportMode = location.pathname.includes('/import');
  
  const [presets, setPresets] = useState([]);
  const [filteredPresets, setFilteredPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [presetStrength, setPresetStrength] = useState(100);
  const [previewImage, setPreviewImage] = useState("reef");

  const categories = [
    { id: "all", name: "All Presets", icon: "Grid" },
    { id: "reef", name: "Coral Reef", icon: "Flower" },
    { id: "open", name: "Open Water", icon: "Waves" },
    { id: "cave", name: "Cave Diving", icon: "Mountain" },
    { id: "tropical", name: "Tropical", icon: "Palmtree" },
    { id: "murky", name: "Murky Water", icon: "Cloud" },
    { id: "macro", name: "Macro", icon: "Zap" },
    { id: "wreck", name: "Wreck", icon: "Anchor" },
    { id: "night", name: "Night Dive", icon: "Moon" },
    { id: "imported", name: "Imported", icon: "Upload" },
    { id: "lightroom", name: "Lightroom", icon: "Camera" },
    { id: "custom", name: "Custom", icon: "User" }
  ];

  const creators = [
    { id: "all", name: "All Creators" },
    { id: "aquaedit", name: "AquaEdit Pro" },
    { id: "user", name: "My Presets" },
    { id: "imported", name: "Imported" }
  ];

  const sortOptions = [
    { id: "name", name: "Name A-Z" },
    { id: "category", name: "Category" },
    { id: "created", name: "Date Created" },
    { id: "popular", name: "Most Used" }
  ];

  const sampleImages = [
    { id: 'reef', name: 'Coral Reef', icon: 'Flower' },
    { id: 'open', name: 'Open Water', icon: 'Waves' },
    { id: 'macro', name: 'Macro Shot', icon: 'Zap' },
    { id: 'cave', name: 'Cave Dive', icon: 'Mountain' }
  ];

const loadPresets = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPresets();
      const validPresets = Array.isArray(data) ? data : [];
      setPresets(validPresets);
      setFilteredPresets(validPresets);
    } catch (err) {
      setError("Failed to load presets");
      console.error(err);
      // Ensure states are reset to empty arrays on error
      setPresets([]);
      setFilteredPresets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresets();
    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('presetFavorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    setShowImportModal(isImportMode);
  }, [isImportMode]);

  useEffect(() => {
    let filtered = [...presets];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(preset => 
        preset.category === selectedCategory || 
        preset.name.toLowerCase().includes(selectedCategory)
      );
    }

    // Filter by creator
    if (selectedCreator !== "all") {
filtered = filtered.filter(preset => {
        if (selectedCreator === "user") return preset.creator === "user" || preset.category === "custom";
        if (selectedCreator === "imported") return preset.source === "dng" || preset.source === "json" || preset.source === "xmp";
        if (selectedCreator === "aquaedit") return !preset.creator || preset.creator === "aquaedit";
        return preset.creator === selectedCreator;
      });
    }

    // Filter by search query
if (searchQuery) {
      filtered = filtered.filter(preset =>
        (preset.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (preset.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(preset.tags) && preset.tags.some(tag => 
          (tag || '').toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }
// Sort presets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || '').localeCompare(b.name || '');
        case "category":
          return (a.category || '').localeCompare(b.category || '');
        case "created":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "popular":
          return (b.usageCount || 0) - (a.usageCount || 0);
        default:
          return 0;
      }
    });

    setFilteredPresets(filtered);
  }, [presets, selectedCategory, selectedCreator, searchQuery, sortBy]);

  const handleApplyPreset = (preset) => {
    // Apply strength adjustment to preset
    const adjustedPreset = {
      ...preset,
      adjustments: Object.fromEntries(
        Object.entries(preset.adjustments).map(([key, value]) => [
          key,
          typeof value === 'number' ? (value * presetStrength / 100) : value
        ])
      )
    };
    
    navigate("/editor", { state: { preset: adjustedPreset } });
  };

  const handleCreatePreset = async () => {
    try {
      const newPreset = await createPreset({
        name: "Custom Preset",
        adjustments: {
          exposure: 20,
          contrast: 15,
          highlights: -30,
          shadows: 40,
          saturation: 25,
          vibrance: 20,
          warmth: 10,
          clarity: 15
        },
        category: "custom",
        description: "A custom preset created from your adjustments",
        creator: "user",
        createdAt: new Date().toISOString(),
        tags: ["custom", "underwater"]
      });
      
      setPresets([...presets, newPreset]);
      toast.success("Custom preset created!");
    } catch (err) {
      toast.error("Failed to create preset");
    }
  };

  const handleImportPresets = async (importedPresets) => {
    try {
      const savedPresets = await importPresets(importedPresets);
      setPresets([...presets, ...savedPresets]);
      toast.success(`Successfully imported ${savedPresets.length} preset(s)!`);
      setShowImportModal(false);
      if (!isImportMode) {
        navigate('/presets');
      }
    } catch (err) {
      toast.error("Failed to import presets");
    }
  };

  const handleExportPresets = async () => {
    try {
      const exportData = await exportPresets(filteredPresets);
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aquaedit-presets-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Presets exported successfully!");
    } catch (err) {
      toast.error("Failed to export presets");
    }
  };

  const toggleFavorite = (presetId) => {
    const newFavorites = favorites.includes(presetId)
      ? favorites.filter(id => id !== presetId)
      : [...favorites, presetId];
    
    setFavorites(newFavorites);
    localStorage.setItem('presetFavorites', JSON.stringify(newFavorites));
  };

  if (loading) {
    return <Loading message="Loading underwater presets..." />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load presets"
        message={error}
        onRetry={loadPresets}
      />
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-coral-gradient rounded-full flex items-center justify-center animate-float">
            <ApperIcon name="Palette" className="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-coral bg-clip-text text-transparent">
            Professional Preset Library
          </h1>
          <p className="text-gray-400 text-lg">
          </p>
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Preset Management</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                size="small"
onClick={() => setShowImportModal(true)}
              >
                <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                Import XMP/DNG/JSON
              </Button>
              <Button 
                variant="secondary" 
                size="small"
                onClick={handleExportPresets}
                disabled={filteredPresets.length === 0}
              >
                <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                Export Collection
              </Button>
              <Button onClick={handleCreatePreset} size="small">
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Create Custom
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search presets, tags, creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <select
                  value={selectedCreator}
                  onChange={(e) => setSelectedCreator(e.target.value)}
                  className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
                >
                  {creators.map((creator) => (
                    <option key={creator.id} value={creator.id}>
                      {creator.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "primary" : "secondary"}
                  size="small"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name={category.icon} className="w-4 h-4" />
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>

            {/* Preview Controls */}
            <div className="flex items-center justify-between p-4 bg-slate-darker rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-300">Preview Strength:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={presetStrength}
                  onChange={(e) => setPresetStrength(parseInt(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm text-ocean-teal">{presetStrength}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Sample:</span>
                {sampleImages.map((sample) => (
                  <Button
                    key={sample.id}
                    variant={previewImage === sample.id ? "primary" : "ghost"}
                    size="small"
                    onClick={() => setPreviewImage(sample.id)}
                  >
                    <ApperIcon name={sample.icon} className="w-3 h-3 mr-1" />
                    {sample.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Presets Grid */}
      {filteredPresets.length === 0 ? (
        <Empty
          icon="Palette"
          title="No presets found"
          message={searchQuery || selectedCategory !== "all" 
            ? "Try adjusting your filters or search terms." 
            : "Start by importing DNG presets or creating custom presets."}
          actionLabel={searchQuery ? "Clear Search" : "Import Presets"}
          onAction={searchQuery ? () => setSearchQuery("") : () => setShowImportModal(true)}
        />
) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPresets.map((preset) => (
            <div key={preset.id || preset.Id} className="relative">
              <PresetCard
                preset={preset}
                onApply={handleApplyPreset}
                strength={presetStrength}
                previewImage={previewImage}
              />
              <Button
                variant="ghost"
                size="small"
                className="absolute top-2 right-2 w-8 h-8 p-0"
                onClick={() => toggleFavorite(preset.id || preset.Id)}
              >
                <ApperIcon 
                  name={favorites.includes(preset.id || preset.Id) ? "Star" : "StarOff"} 
                  className={`w-4 h-4 ${favorites.includes(preset.id || preset.Id) ? 'text-coral' : 'text-gray-400'}`} 
                />
              </Button>
            </div>
        </div>
      )}

      {/* Enhanced Statistics */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-ocean-teal">{presets.length}</p>
              <p className="text-sm text-gray-400">Total Presets</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-coral">
                {presets.filter(p => p.source === 'dng' || p.source === 'json').length}
              </p>
              <p className="text-sm text-gray-400">Imported</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {presets.filter(p => p.creator === 'user' || p.category === 'custom').length}
              </p>
              <p className="text-sm text-gray-400">Custom</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{favorites.length}</p>
              <p className="text-sm text-gray-400">Favorites</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">{categories.length - 1}</p>
              <p className="text-sm text-gray-400">Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Modal */}
      <PresetImportModal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          if (isImportMode) {
            navigate('/presets');
          }
        }}
        onImport={handleImportPresets}
      />
    </div>
  );
};

export default PresetsPage;