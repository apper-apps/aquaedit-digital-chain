import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import UploadArea from "@/components/molecules/UploadArea";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getRecentProjects, getPresets } from "@/services/api/projectService";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState([]);
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [projectsData, presetsData] = await Promise.all([
        getRecentProjects(),
        getPresets()
      ]);
      
      setRecentProjects(projectsData);
      setPresets(presetsData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpload = (files) => {
    toast.success(`Uploaded ${files.length} image${files.length > 1 ? 's' : ''}`);
    navigate("/editor", { state: { uploadedFiles: files } });
  };

  const handleOpenProject = (project) => {
    navigate("/editor", { state: { project } });
  };

  const handleQuickStart = (preset) => {
    navigate("/editor", { state: { preset } });
  };

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Error 
          title="Dashboard Error"
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-ocean-gradient rounded-full flex items-center justify-center animate-float">
              <ApperIcon name="Waves" className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -inset-2 bg-ocean-gradient rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-ocean-teal bg-clip-text text-transparent">
            Welcome to AquaEdit Pro
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            Transform your underwater photography with professional editing tools
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="max-w-2xl mx-auto">
        <UploadArea onUpload={handleUpload} />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="w-5 h-5 text-ocean-teal" />
              <span>Recent Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <Empty
                icon="FolderOpen"
                title="No recent projects"
                message="Start editing to see your recent work here."
                actionLabel="Start Editing"
                onAction={() => navigate("/editor")}
              />
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.Id}
                    className="flex items-center justify-between p-3 bg-slate-darker rounded-lg hover:bg-slate-dark transition-colors cursor-pointer"
                    onClick={() => handleOpenProject(project)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-ocean-gradient rounded-lg flex items-center justify-center">
                        <ApperIcon name="Image" className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{project.name}</h3>
                        <p className="text-sm text-gray-400">
                          {new Date(project.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
                <Button variant="ghost" className="w-full mt-4" onClick={() => navigate("/gallery")}>
                  View All Projects
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Start Presets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Palette" className="w-5 h-5 text-coral" />
              <span>Quick Start Presets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {presets.slice(0, 4).map((preset) => (
                <div
                  key={preset.Id}
                  className="p-3 bg-slate-darker rounded-lg hover:bg-slate-dark transition-all cursor-pointer group"
                  onClick={() => handleQuickStart(preset)}
                >
                  <div className="aspect-square bg-ocean-gradient rounded-lg flex items-center justify-center mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <ApperIcon name="Waves" className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-sm font-medium text-white group-hover:text-ocean-teal transition-colors">
                    {preset.name}
                  </h4>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" onClick={() => navigate("/presets")}>
              Browse All Presets
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats and Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Color Accuracy</h3>
            <p className="text-2xl font-bold text-emerald-400">98%</p>
            <p className="text-xs text-gray-400">Underwater color restoration</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Zap" className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Processing Speed</h3>
            <p className="text-2xl font-bold text-blue-400">2.3s</p>
            <p className="text-xs text-gray-400">Average edit time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Star" className="w-6 h-6 text-coral" />
            </div>
            <h3 className="font-semibold text-white mb-1">User Rating</h3>
            <p className="text-2xl font-bold text-coral">4.9</p>
            <p className="text-xs text-gray-400">Professional grade tools</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;