import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PresetCard from "@/components/molecules/PresetCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getPresets, createPreset } from "@/services/api/projectService";
import { toast } from "react-toastify";

const PresetsPage = () => {
  const navigate = useNavigate();
  const [presets, setPresets] = useState([]);
  const [filteredPresets, setFilteredPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Presets", icon: "Grid3X3" },
    { id: "shallow", name: "Shallow Water", icon: "Sun" },
    { id: "deep", name: "Deep Water", icon: "Waves" },
    { id: "cave", name: "Cave Diving", icon: "Mountain" },
    { id: "tropical", name: "Tropical", icon: "Palmtree" },
    { id: "murky", name: "Murky Water", icon: "Cloud" }
  ];

  const loadPresets = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPresets();
      setPresets(data);
      setFilteredPresets(data);
    } catch (err) {
      setError("Failed to load presets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresets();
  }, []);

  useEffect(() => {
    let filtered = presets;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(preset => 
        preset.category === selectedCategory || 
        preset.name.toLowerCase().includes(selectedCategory)
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(preset =>
        preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPresets(filtered);
  }, [presets, selectedCategory, searchQuery]);

  const handleApplyPreset = (preset) => {
    navigate("/editor", { state: { preset } });
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
        description: "A custom preset created from your adjustments"
      });
      
      setPresets([...presets, newPreset]);
      toast.success("Custom preset created!");
    } catch (err) {
      toast.error("Failed to create preset");
    }
  };

  if (loading) {
    return <Loading message="Loading underwater presets..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Error 
          title="Presets Error"
          message={error}
          onRetry={loadPresets}
        />
      </div>
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
            Underwater Presets
          </h1>
          <p className="text-gray-400 text-lg">
            Professional presets designed specifically for underwater photography
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Browse Presets</span>
            <Button onClick={handleCreatePreset} size="small">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create Custom
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search presets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
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
            : "Start creating your first custom preset."}
          actionLabel="Create Preset"
          onAction={handleCreatePreset}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPresets.map((preset) => (
            <PresetCard
              key={preset.Id}
              preset={preset}
              onApply={handleApplyPreset}
            />
          ))}
        </div>
      )}

      {/* Preset Statistics */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-ocean-teal">{presets.length}</p>
              <p className="text-sm text-gray-400">Total Presets</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-coral">{categories.length - 1}</p>
              <p className="text-sm text-gray-400">Categories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">5</p>
              <p className="text-sm text-gray-400">Professional</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">∞</p>
              <p className="text-sm text-gray-400">Custom</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Lightbulb" className="w-5 h-5 text-coral" />
            <span>Preset Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-white">When to use each preset:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• <strong>Shallow Reef:</strong> Bright, colorful coral formations (0-30ft)</li>
                <li>• <strong>Deep Blue:</strong> Deep water diving with blue backgrounds (30ft+)</li>
                <li>• <strong>Cave Dive:</strong> Low light conditions with artificial lighting</li>
                <li>• <strong>Tropical Clear:</strong> Crystal clear tropical waters</li>
                <li>• <strong>Murky Water:</strong> Low visibility conditions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-white">Pro tips:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Start with a preset, then fine-tune manually</li>
                <li>• Use intensity slider to apply presets at reduced strength</li>
                <li>• Create custom presets from your favorite adjustments</li>
                <li>• Different presets work better with different camera systems</li>
                <li>• Save multiple versions for different dive conditions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PresetsPage;