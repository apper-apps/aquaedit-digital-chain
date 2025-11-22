import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

// Projects Service - Uses projects_c table
export const getProjects = async () => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('projects_c', {
      fields: [
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "image_id_c"}},
        {"field": {"Name": "created_date_c"}},
        {"field": {"Name": "last_modified_c"}},
        {"field": {"Name": "adjustments_c"}}
      ],
      orderBy: [{"fieldName": "last_modified_c", "sorttype": "DESC"}]
    });

    if (!response.success) {
      console.error(`Failed to fetch projects:`, response);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error?.response?.data?.message || error);
    return [];
  }
};

export const getRecentProjects = async (limit = 5) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('projects_c', {
      fields: [
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "image_id_c"}},
        {"field": {"Name": "last_modified_c"}}
      ],
      orderBy: [{"fieldName": "last_modified_c", "sorttype": "DESC"}],
      pagingInfo: {"limit": limit, "offset": 0}
    });

    if (!response.success) {
      console.error(`Failed to fetch recent projects:`, response);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching recent projects:", error?.response?.data?.message || error);
    return [];
  }
};

export const getProjectById = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('projects_c', parseInt(id), {
      fields: [
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "image_id_c"}},
        {"field": {"Name": "created_date_c"}},
        {"field": {"Name": "last_modified_c"}},
        {"field": {"Name": "adjustments_c"}}
      ]
    });

    if (!response.success) {
      console.error(`Failed to fetch project with Id: ${id}:`, response);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error?.response?.data?.message || error);
    return null;
  }
};

export const createProject = async (projectData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [{
        name_c: projectData.name,
        image_id_c: projectData.imageId,
        created_date_c: new Date().toISOString(),
        last_modified_c: new Date().toISOString(),
        adjustments_c: JSON.stringify(projectData.adjustments || {})
      }]
    };

    const response = await apperClient.createRecord('projects_c', params);

    if (!response.success) {
      console.error(`Failed to create project:`, response);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} projects:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      return successful.length > 0 ? successful[0].data : null;
    }

    return null;
  } catch (error) {
    console.error("Error creating project:", error?.response?.data?.message || error);
    return null;
  }
};

export const saveProject = async (projectData) => {
  return await createProject(projectData);
};

export const updateProject = async (id, projectData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [{
        Id: parseInt(id),
        name_c: projectData.name,
        image_id_c: projectData.imageId,
        last_modified_c: new Date().toISOString(),
        adjustments_c: JSON.stringify(projectData.adjustments || {})
      }]
    };

    const response = await apperClient.updateRecord('projects_c', params);

    if (!response.success) {
      console.error(`Failed to update project:`, response);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} projects:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      return successful.length > 0 ? successful[0].data : null;
    }

    return null;
  } catch (error) {
    console.error("Error updating project:", error?.response?.data?.message || error);
    return null;
  }
};

export const deleteProject = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('projects_c', {
      RecordIds: [parseInt(id)]
    });

    if (!response.success) {
      console.error(`Failed to delete project:`, response);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} projects:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      return successful.length > 0;
    }

    return false;
  } catch (error) {
    console.error("Error deleting project:", error?.response?.data?.message || error);
    return false;
  }
};

// Presets Service - Uses presets_c table
export const getPresets = async () => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('presets_c', {
      fields: [
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "category_c"}},
        {"field": {"Name": "thumbnail_c"}},
        {"field": {"Name": "adjustments_c"}},
        {"field": {"Name": "created_at_c"}},
        {"field": {"Name": "usage_count_c"}},
        {"field": {"Name": "tags_c"}},
        {"field": {"Name": "process_version_c"}},
        {"field": {"Name": "has_local_adjustments_c"}}
      ],
      orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
    });

    if (!response.success) {
      console.error(`Failed to fetch presets:`, response);
      toast.error(response.message);
      return [];
    }

    return response.data?.map(preset => ({
      Id: preset.Id,
      name: preset.name_c,
      description: preset.description_c,
      category: preset.category_c,
      thumbnail: preset.thumbnail_c,
      adjustments: preset.adjustments_c ? JSON.parse(preset.adjustments_c) : {},
      createdAt: preset.created_at_c,
      usageCount: preset.usage_count_c || 0,
      tags: preset.tags_c ? preset.tags_c.split(',') : [],
      processVersion: preset.process_version_c,
      hasLocalAdjustments: preset.has_local_adjustments_c
    })) || [];
  } catch (error) {
    console.error("Error fetching presets:", error?.response?.data?.message || error);
    return [];
  }
};

export const getPresetById = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('presets_c', parseInt(id), {
      fields: [
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "category_c"}},
        {"field": {"Name": "adjustments_c"}},
        {"field": {"Name": "tags_c"}}
      ]
    });

    if (!response.success) {
      console.error(`Failed to fetch preset with Id: ${id}:`, response);
      toast.error(response.message);
      return null;
    }

    const preset = response.data;
    return {
      Id: preset.Id,
      name: preset.name_c,
      description: preset.description_c,
      category: preset.category_c,
      adjustments: preset.adjustments_c ? JSON.parse(preset.adjustments_c) : {},
      tags: preset.tags_c ? preset.tags_c.split(',') : []
    };
  } catch (error) {
    console.error(`Error fetching preset ${id}:`, error?.response?.data?.message || error);
    return null;
  }
};

export const createPreset = async (presetData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [{
        name_c: presetData.name,
        description_c: presetData.description || '',
        category_c: presetData.category || 'custom',
        thumbnail_c: presetData.thumbnail || '',
        adjustments_c: JSON.stringify(presetData.adjustments || {}),
        created_at_c: new Date().toISOString(),
        usage_count_c: 0,
        tags_c: Array.isArray(presetData.tags) ? presetData.tags.join(',') : '',
        process_version_c: '1.0',
        has_local_adjustments_c: false
      }]
    };

    const response = await apperClient.createRecord('presets_c', params);

    if (!response.success) {
      console.error(`Failed to create preset:`, response);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      if (successful.length > 0) {
        toast.success("Preset created successfully");
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error creating preset:", error?.response?.data?.message || error);
    return null;
  }
};

export const updatePreset = async (id, presetData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [{
        Id: parseInt(id),
        name_c: presetData.name,
        description_c: presetData.description,
        category_c: presetData.category,
        adjustments_c: JSON.stringify(presetData.adjustments || {}),
        tags_c: Array.isArray(presetData.tags) ? presetData.tags.join(',') : presetData.tags || ''
      }]
    };

    const response = await apperClient.updateRecord('presets_c', params);

    if (!response.success) {
      console.error(`Failed to update preset:`, response);
      toast.error(response.message);
      return null;
    }

    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error("Error updating preset:", error?.response?.data?.message || error);
    return null;
  }
};

export const deletePreset = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('presets_c', {
      RecordIds: [parseInt(id)]
    });

    if (!response.success) {
      console.error(`Failed to delete preset:`, response);
      toast.error(response.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting preset:", error?.response?.data?.message || error);
    return false;
  }
};

export const importPresets = async (presets) => {
  try {
    if (!Array.isArray(presets) || presets.length === 0) return [];
    
    const records = presets.map(preset => ({
      name_c: preset.name,
      description_c: preset.description || '',
      category_c: preset.category || 'imported',
      adjustments_c: JSON.stringify(preset.adjustments || {}),
      created_at_c: new Date().toISOString(),
      tags_c: Array.isArray(preset.tags) ? preset.tags.join(',') : '',
      process_version_c: '1.0'
    }));

    const apperClient = getApperClient();
    const response = await apperClient.createRecord('presets_c', { records });

    if (!response.success) {
      console.error(`Failed to import presets:`, response);
      toast.error(response.message);
      return [];
    }

    const successful = response.results?.filter(r => r.success) || [];
    toast.success(`Successfully imported ${successful.length} presets`);
    return successful.map(r => r.data);
  } catch (error) {
    console.error("Error importing presets:", error?.response?.data?.message || error);
    return [];
  }
};

export const exportPresets = async (presets) => {
  try {
    const exportData = presets.map(preset => ({
      name: preset.name,
      description: preset.description,
      category: preset.category,
      adjustments: preset.adjustments,
      tags: preset.tags
    }));

    return {
      version: "1.0",
      exported: new Date().toISOString(),
      presets: exportData
    };
  } catch (error) {
    console.error("Error exporting presets:", error);
    throw error;
  }
};

// Images would be handled by a separate service
export const uploadImage = async (imageFile, metadata = {}) => {
  // This would integrate with file upload service
  // For now, return a mock response
  return {
    Id: Date.now(),
    filename: imageFile.name,
    url: URL.createObjectURL(imageFile),
    format: imageFile.type,
    uploadDate: new Date(),
    metadata: {
      size: imageFile.size,
      type: imageFile.type,
      ...metadata
    }
  };
};

export const getImages = async () => {
  // Mock implementation - in real app would fetch from images_c table
  return [];
};

export const getImageById = async (id) => {
  // Mock implementation - in real app would fetch from images_c table
  return null;
};

// Utility function for delays (can be removed in production)
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));