import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getProjects, deleteProject } from "@/services/api/projectService";
import { getImages } from "@/services/api/imageService";
import { toast } from "react-toastify";

const GalleryPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [images, setImages] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("date");

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [projectsData, imagesData] = await Promise.all([
        getProjects(),
        getImages()
      ]);
      
      // Combine project data with image data
      const projectsWithImages = projectsData.map(project => {
        const image = imagesData.find(img => img.Id === project.imageId);
        return {
          ...project,
          image: image || null
        };
      });
      
      setProjects(projectsWithImages);
      setImages(imagesData);
      setFilteredProjects(projectsWithImages);
    } catch (err) {
      setError("Failed to load gallery");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryData();
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.image && project.image.filename.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.lastModified) - new Date(a.lastModified);
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return (b.image?.metadata?.size || 0) - (a.image?.metadata?.size || 0);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchQuery, sortBy]);

  const handleOpenProject = (project) => {
    navigate("/editor", { state: { project } });
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.Id !== projectId));
      toast.success("Project deleted successfully");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return <Loading message="Loading your gallery..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Error 
          title="Gallery Error"
          message={error}
          onRetry={loadGalleryData}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-ocean-gradient rounded-full flex items-center justify-center animate-float">
            <ApperIcon name="Images" className="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-ocean-teal bg-clip-text text-transparent">
            Photo Gallery
          </h1>
          <p className="text-gray-400 text-lg">
            Browse and manage your underwater photography projects
          </p>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Projects ({filteredProjects.length})</span>
            <Button onClick={() => navigate("/editor")} size="small">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by Size</option>
            </select>

            {/* View Mode */}
            <div className="flex space-x-1">
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="small"
                onClick={() => setViewMode("grid")}
              >
                <ApperIcon name="Grid3X3" className="w-4 h-4" />
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
        </CardContent>
      </Card>

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <Empty
          icon="FolderOpen"
          title="No projects found"
          message={searchQuery 
            ? "No projects match your search criteria." 
            : "Start editing your first underwater photo to create a project."}
          actionLabel="Start Editing"
          onAction={() => navigate("/editor")}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.Id} className="group cursor-pointer hover:scale-105 transition-all duration-300">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Image Preview */}
                  <div className="aspect-video bg-ocean-gradient rounded-lg flex items-center justify-center relative overflow-hidden">
                    {project.image ? (
                      <img 
                        src={project.image.url} 
                        alt={project.name}
                        className="w-full h-full object-cover"
                        onClick={() => handleOpenProject(project)}
                      />
                    ) : (
                      <ApperIcon name="Image" className="w-8 h-8 text-white/60" />
                    )}
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button
                        size="small"
                        onClick={() => handleOpenProject(project)}
                      >
                        <ApperIcon name="Edit3" className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.Id);
                        }}
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white truncate">{project.name}</h3>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>{new Date(project.lastModified).toLocaleDateString()}</p>
                      {project.image && (
                        <>
                          <p>{project.image.format}</p>
                          <p>{formatFileSize(project.image.metadata?.size)}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.Id}
                  className={`flex items-center p-4 hover:bg-slate-dark transition-colors cursor-pointer ${
                    index !== filteredProjects.length - 1 ? "border-b border-slate-dark" : ""
                  }`}
                  onClick={() => handleOpenProject(project)}
                >
                  <div className="w-12 h-12 bg-ocean-gradient rounded-lg flex items-center justify-center mr-4">
                    <ApperIcon name="Image" className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{project.name}</h3>
                    <div className="text-sm text-gray-400">
                      {new Date(project.lastModified).toLocaleDateString()}
                      {project.image && (
                        <span className="ml-2">
                          • {project.image.format} • {formatFileSize(project.image.metadata?.size)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProject(project);
                      }}
                    >
                      <ApperIcon name="Edit3" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.Id);
                      }}
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-ocean-teal">{projects.length}</p>
            <p className="text-sm text-gray-400">Total Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-coral">{images.length}</p>
            <p className="text-sm text-gray-400">Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {formatFileSize(images.reduce((total, img) => total + (img.metadata?.size || 0), 0))}
            </p>
            <p className="text-sm text-gray-400">Total Size</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {projects.filter(p => new Date(p.lastModified) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </p>
            <p className="text-sm text-gray-400">This Week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GalleryPage;