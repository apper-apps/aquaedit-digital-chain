import projectsData from "@/services/mockData/projects.json";
import imagesData from "@/services/mockData/images.json";
import presetsData from "@/services/mockData/presets.json";

// Mock API delay with context-aware throttling
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Memory-efficient data stores with chunking support
let projects = [...projectsData];
let images = [...imagesData];
let presets = [...presetsData];

// Pagination configuration
const DEFAULT_PAGE_SIZE = 20;
const MAX_BATCH_SIZE = 10;

// Memory cleanup utility
const cleanupLargeObjects = (data) => {
  return data.map(item => ({
    ...item,
    // Remove large fields for list operations
    ...(item.adjustments && Object.keys(item.adjustments).length > 10 ? 
      { adjustments: { summary: 'Full adjustments available on detail view' } } : {}),
    ...(item.editHistory && item.editHistory.length > 5 ? 
      { editHistory: item.editHistory.slice(-3) } : {})
  }));
};

// Enhanced project service methods with pagination
export const getProjects = async (page = 1, pageSize = DEFAULT_PAGE_SIZE, filters = {}) => {
  await delay(200); // Reduced delay for better UX
  
  try {
    let filteredProjects = [...projects];
    
    // Apply filters if provided
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProjects = filteredProjects.filter(p => 
        p.name.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.imageId) {
      filteredProjects = filteredProjects.filter(p => p.imageId === filters.imageId);
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const totalItems = filteredProjects.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // Return paginated results with metadata
    const paginatedProjects = cleanupLargeObjects(
      filteredProjects.slice(startIndex, endIndex)
    );
    
    return {
      data: paginatedProjects,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }
};

export const getRecentProjects = async (limit = 5) => {
  await delay(150);
  try {
    const recent = projects
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
      .slice(0, Math.min(limit, 10)); // Cap at 10 for memory efficiency
    
    return cleanupLargeObjects(recent);
  } catch (error) {
    throw new Error(`Failed to fetch recent projects: ${error.message}`);
  }
};

export const getProjectById = async (id) => {
  await delay(100); // Faster for individual items
  try {
    const project = projects.find(p => p.Id === parseInt(id));
    if (!project) {
      throw new Error(`Project with Id ${id} not found`);
    }
    return { ...project }; // Full object for detail view
  } catch (error) {
    throw new Error(`Failed to fetch project ${id}: ${error.message}`);
  }
};

export const createProject = async (projectData) => {
  await delay(400);
  const highestId = Math.max(...projects.map(p => p.Id), 0);
  const newProject = {
    Id: highestId + 1,
    ...projectData,
    createdDate: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
  projects.push(newProject);
  return { ...newProject };
};

export const updateProject = async (id, projectData) => {
  await delay(350);
  const index = projects.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Project with Id ${id} not found`);
  }
  projects[index] = {
    ...projects[index],
    ...projectData,
    lastModified: new Date().toISOString()
  };
  return { ...projects[index] };
};

export const deleteProject = async (id) => {
  await delay(300);
  const index = projects.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Project with Id ${id} not found`);
  }
  projects.splice(index, 1);
  return true;
};

export const saveProject = async (projectData) => {
  await delay(250);
  
  // Check if project already exists
  const existingProject = projects.find(p => 
    p.imageId === projectData.imageId && p.name === projectData.name
  );
  
  if (existingProject) {
    return updateProject(existingProject.Id, projectData);
  } else {
    return createProject(projectData);
  }
};

// Enhanced image service methods with chunking
export const getImages = async (page = 1, pageSize = DEFAULT_PAGE_SIZE, filters = {}) => {
  await delay(200);
  
  try {
    let filteredImages = [...images];
    
    // Apply filters
    if (filters.format) {
      filteredImages = filteredImages.filter(img => img.format === filters.format);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredImages = filteredImages.filter(img => 
        img.filename.toLowerCase().includes(searchTerm)
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const totalItems = filteredImages.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // Clean up metadata for list view
    const cleanImages = filteredImages.slice(startIndex, endIndex).map(img => ({
      ...img,
      metadata: {
        size: img.metadata.size,
        camera: img.metadata.camera,
        // Remove extensive metadata for list view
        ...(Object.keys(img.metadata).length > 5 ? { hasMore: true } : img.metadata)
      }
    }));
    
    return {
      data: cleanImages,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch images: ${error.message}`);
  }
};

export const getImageById = async (id) => {
  await delay(100);
  try {
    const image = images.find(img => img.Id === parseInt(id));
    if (!image) {
      throw new Error(`Image with Id ${id} not found`);
    }
    return { ...image }; // Full metadata for detail view
  } catch (error) {
    throw new Error(`Failed to fetch image ${id}: ${error.message}`);
  }
};

export const uploadImage = async (imageData) => {
  await delay(500);
  const highestId = Math.max(...images.map(img => img.Id), 0);
  const newImage = {
    Id: highestId + 1,
    ...imageData,
    uploadDate: new Date().toISOString(),
    editHistory: []
  };
  images.push(newImage);
  return { ...newImage };
};

// Enhanced preset service methods with efficient loading
export const getPresets = async (page = 1, pageSize = DEFAULT_PAGE_SIZE, filters = {}) => {
  await delay(150);
  
  try {
    let filteredPresets = [...presets];
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filteredPresets = filteredPresets.filter(p => p.category === filters.category);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPresets = filteredPresets.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const totalItems = filteredPresets.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // Optimize for list view - reduce adjustment data
    const optimizedPresets = filteredPresets.slice(startIndex, endIndex).map(preset => ({
      ...preset,
      adjustments: preset.adjustments ? {
        // Keep only key adjustments for preview
        exposure: preset.adjustments.exposure,
        contrast: preset.adjustments.contrast,
        saturation: preset.adjustments.saturation,
        adjustmentCount: Object.keys(preset.adjustments).length
      } : {}
    }));
    
    return {
      data: optimizedPresets,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch presets: ${error.message}`);
  }
};

export const getPresetById = async (id) => {
  await delay(100);
  try {
    const preset = presets.find(p => p.Id === parseInt(id));
    if (!preset) {
      throw new Error(`Preset with Id ${id} not found`);
    }
    return { ...preset }; // Full adjustments for detail/application
  } catch (error) {
    throw new Error(`Failed to fetch preset ${id}: ${error.message}`);
  }
};

export const createPreset = async (presetData) => {
  await delay(300);
  const highestId = Math.max(...presets.map(p => p.Id), 0);
  const newPreset = {
    Id: highestId + 1,
    category: "custom",
    thumbnail: "custom_preset.jpg",
    ...presetData
  };
  presets.push(newPreset);
  return { ...newPreset };
};

export const updatePreset = async (id, presetData) => {
  await delay(250);
  const index = presets.findIndex(p => p.Id === id);
  if (index === -1) {
    throw new Error("Preset not found");
  }
  presets[index] = { ...presets[index], ...presetData };
  return { ...presets[index] };
};

// Context-aware preset import with batching
export const importPresets = async (importedPresets, options = {}) => {
  const { batchSize = MAX_BATCH_SIZE, onProgress } = options;
  
  if (importedPresets.length === 0) {
    throw new Error("No presets to import");
  }
  
  if (importedPresets.length > 100) {
    throw new Error("Too many presets to import at once. Maximum 100 presets allowed.");
  }
  
  const savedPresets = [];
  const batches = [];
  
  // Split into manageable batches
  for (let i = 0; i < importedPresets.length; i += batchSize) {
    batches.push(importedPresets.slice(i, i + batchSize));
  }
  
  try {
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      await delay(300); // Prevent context overload
      
      const batch = batches[batchIndex];
      const currentHighestId = Math.max(...presets.map(p => p.Id), 0);
      
      for (let i = 0; i < batch.length; i++) {
        const preset = batch[i];
        const newPreset = {
          Id: currentHighestId + savedPresets.length + 1,
          category: preset.category || "imported",
          source: preset.source || "import",
          thumbnail: preset.source === "dng" ? "dng_preset.jpg" : "imported_preset.jpg",
          createdAt: new Date().toISOString(),
          usageCount: 0,
          tags: preset.tags || [],
          processVersion: preset.metadata?.processVersion || "1.0",
          hasLocalAdjustments: !!(preset.localAdjustments?.length),
          ...preset
        };
        
        presets.push(newPreset);
        savedPresets.push({ ...newPreset });
      }
      
      // Report progress
      if (onProgress) {
        onProgress({
          completed: savedPresets.length,
          total: importedPresets.length,
          currentBatch: batchIndex + 1,
          totalBatches: batches.length
        });
      }
    }
    
    return savedPresets;
  } catch (error) {
    throw new Error(`Import failed: ${error.message}`);
  }
};

export const exportPresets = async (presetsToExport) => {
  await delay(300);
  return {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    totalPresets: presetsToExport.length,
    appVersion: "1.0.0",
    compatibility: {
      lightroomSupport: true,
      processVersions: ["4.0", "5.0"],
      localAdjustments: true
    },
    presets: presetsToExport.map(preset => ({
      ...preset,
      exportedFrom: "AquaEdit Pro",
      xmpCompatible: !!(preset.metadata?.processVersion),
      preserveLocalAdjustments: !!(preset.localAdjustments?.length)
    }))
  };
};

export const deletePreset = async (id) => {
  await delay(250);
const index = presets.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Preset with Id ${id} not found`);
  }
  presets.splice(index, 1);
  return true;
};