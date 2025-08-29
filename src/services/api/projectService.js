import projectsData from "@/services/mockData/projects.json";
import imagesData from "@/services/mockData/images.json";
import presetsData from "@/services/mockData/presets.json";

// Mock API delay
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory data stores (simulating database)
let projects = [...projectsData];
let images = [...imagesData];
let presets = [...presetsData];

// Project service methods
export const getProjects = async () => {
  await delay(300);
  return [...projects];
};

export const getRecentProjects = async () => {
  await delay(200);
  return projects
    .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
    .slice(0, 5);
};

export const getProjectById = async (id) => {
  await delay(250);
  const project = projects.find(p => p.Id === parseInt(id));
  if (!project) {
    throw new Error(`Project with Id ${id} not found`);
  }
  return { ...project };
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

// Image service methods
export const getImages = async () => {
  await delay(300);
  return [...images];
};

export const getImageById = async (id) => {
  await delay(200);
  const image = images.find(img => img.Id === parseInt(id));
  if (!image) {
    throw new Error(`Image with Id ${id} not found`);
  }
  return { ...image };
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

// Preset service methods
export const getPresets = async () => {
  await delay(200);
  return [...presets];
};

export const getPresetById = async (id) => {
  await delay(150);
const preset = presets.find(p => p.Id === parseInt(id));
  if (!preset) {
    throw new Error("Preset not found");
  }
  return { ...preset };
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

// Enhanced preset import/export functions
export const importPresets = async (importedPresets) => {
  await delay(500);
  const savedPresets = [];
  
  for (const preset of importedPresets) {
const currentHighestId = Math.max(...presets.map(p => p.Id), 0);
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
  
  return savedPresets;
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