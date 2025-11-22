import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

// Images Service - Uses images_c table
export const getImages = async () => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('images_c', {
      fields: [
        {"field": {"Name": "filename_c"}},
        {"field": {"Name": "format_c"}},
        {"field": {"Name": "upload_date_c"}},
        {"field": {"Name": "url_c"}},
        {"field": {"Name": "dimensions_width_c"}},
        {"field": {"Name": "dimensions_height_c"}},
        {"field": {"Name": "metadata_c"}}
      ],
      orderBy: [{"fieldName": "upload_date_c", "sorttype": "DESC"}]
    });

    if (!response.success) {
      console.error(`Failed to fetch images:`, response);
      toast.error(response.message);
      return [];
    }

    return response.data?.map(image => ({
      Id: image.Id,
      filename: image.filename_c,
      format: image.format_c,
      uploadDate: image.upload_date_c,
      url: image.url_c,
      dimensions: {
        width: image.dimensions_width_c,
        height: image.dimensions_height_c
      },
      metadata: image.metadata_c ? JSON.parse(image.metadata_c) : {}
    })) || [];
  } catch (error) {
    console.error("Error fetching images:", error?.response?.data?.message || error);
    return [];
  }
};

export const getImageById = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('images_c', parseInt(id), {
      fields: [
        {"field": {"Name": "filename_c"}},
        {"field": {"Name": "format_c"}},
        {"field": {"Name": "upload_date_c"}},
        {"field": {"Name": "url_c"}},
        {"field": {"Name": "dimensions_width_c"}},
        {"field": {"Name": "dimensions_height_c"}},
        {"field": {"Name": "metadata_c"}}
      ]
    });

    if (!response.success) {
      console.error(`Failed to fetch image with Id: ${id}:`, response);
      toast.error(response.message);
      return null;
    }

    const image = response.data;
    return {
      Id: image.Id,
      filename: image.filename_c,
      format: image.format_c,
      uploadDate: image.upload_date_c,
      url: image.url_c,
      dimensions: {
        width: image.dimensions_width_c,
        height: image.dimensions_height_c
      },
      metadata: image.metadata_c ? JSON.parse(image.metadata_c) : {}
    };
  } catch (error) {
    console.error(`Error fetching image ${id}:`, error?.response?.data?.message || error);
    return null;
  }
};

export const uploadImage = async (imageFile, metadata = {}) => {
  try {
    // Create image record in database
    const apperClient = getApperClient();
    
    // For now, create a blob URL - in production this would upload to storage
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Get image dimensions
    const img = new Image();
    img.src = imageUrl;
    await new Promise(resolve => { img.onload = resolve; });
    
    const params = {
      records: [{
        filename_c: imageFile.name,
        format_c: imageFile.type.split('/')[1]?.toUpperCase() || 'JPEG',
        upload_date_c: new Date().toISOString(),
        url_c: imageUrl,
        dimensions_width_c: img.naturalWidth,
        dimensions_height_c: img.naturalHeight,
        metadata_c: JSON.stringify({
          size: imageFile.size,
          type: imageFile.type,
          aspectRatio: img.naturalWidth / img.naturalHeight,
          ...metadata
        })
      }]
    };

    const response = await apperClient.createRecord('images_c', params);

    if (!response.success) {
      console.error(`Failed to upload image:`, response);
      toast.error(response.message);
      return null;
    }

    if (response.results && response.results.length > 0) {
      const successful = response.results.filter(r => r.success);
      if (successful.length > 0) {
        const imageData = successful[0].data;
        return {
          Id: imageData.Id,
          filename: imageData.filename_c,
          format: imageData.format_c,
          uploadDate: imageData.upload_date_c,
          url: imageUrl, // Use the blob URL
          dimensions: {
            width: img.naturalWidth,
            height: img.naturalHeight
          },
          metadata: {
            size: imageFile.size,
            type: imageFile.type,
            aspectRatio: img.naturalWidth / img.naturalHeight,
            ...metadata
          }
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error uploading image:", error?.response?.data?.message || error);
    return null;
  }
};

export const deleteImage = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('images_c', {
      RecordIds: [parseInt(id)]
    });

    if (!response.success) {
      console.error(`Failed to delete image:`, response);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      return successful.length > 0;
    }

    return false;
  } catch (error) {
    console.error("Error deleting image:", error?.response?.data?.message || error);
    return false;
  }
};

export const updateImageMetadata = async (id, metadata) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [{
        Id: parseInt(id),
        metadata_c: JSON.stringify(metadata)
      }]
    };

    const response = await apperClient.updateRecord('images_c', params);

    if (!response.success) {
      console.error(`Failed to update image metadata:`, response);
      toast.error(response.message);
      return null;
    }

    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error("Error updating image metadata:", error?.response?.data?.message || error);
    return null;
  }
};