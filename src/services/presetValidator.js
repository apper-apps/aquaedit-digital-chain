// JSON Preset Validation Schema and Utilities
export class PresetValidator {
  static schema = {
    name: { required: true, type: 'string' },
    description: { required: false, type: 'string' },
    category: { required: false, type: 'string' },
    adjustments: { 
      required: true, 
      type: 'object',
      properties: {
        exposure: { type: 'number', min: -500, max: 500 },
        contrast: { type: 'number', min: -100, max: 100 },
        highlights: { type: 'number', min: -100, max: 100 },
        shadows: { type: 'number', min: -100, max: 100 },
        saturation: { type: 'number', min: -100, max: 100 },
        vibrance: { type: 'number', min: -100, max: 100 },
        warmth: { type: 'number', min: -100, max: 100 },
        clarity: { type: 'number', min: -100, max: 100 },
        temperature: { type: 'number', min: -100, max: 100 },
        tint: { type: 'number', min: -100, max: 100 }
      }
    },
    version: { required: false, type: 'string' },
    creator: { required: false, type: 'string' },
    tags: { required: false, type: 'array' }
  };
  
  static validate(presetData) {
    const errors = [];
    const warnings = [];
    
    // Check required fields
    if (!presetData.name || typeof presetData.name !== 'string') {
      errors.push('Name is required and must be a string');
    }
    
    if (!presetData.adjustments || typeof presetData.adjustments !== 'object') {
      errors.push('Adjustments object is required');
      return { valid: false, errors, warnings };
    }
    
    // Validate adjustment values
    for (const [key, value] of Object.entries(presetData.adjustments)) {
      if (typeof value === 'number') {
        const property = this.schema.adjustments.properties[key];
        if (property) {
          if (property.min !== undefined && value < property.min) {
            warnings.push(`${key} value ${value} is below recommended minimum ${property.min}`);
          }
          if (property.max !== undefined && value > property.max) {
            warnings.push(`${key} value ${value} is above recommended maximum ${property.max}`);
          }
        }
      }
    }
    
    // Validate HSL adjustments if present
    const hslChannels = ['hslReds', 'hslOranges', 'hslYellows', 'hslGreens', 'hslCyans', 'hslBlues', 'hslPurples', 'hslMagentas'];
    for (const channel of hslChannels) {
      if (presetData.adjustments[channel]) {
        const hsl = presetData.adjustments[channel];
        if (typeof hsl !== 'object') {
          errors.push(`${channel} must be an object with hue, saturation, and luminance properties`);
        } else {
          if (hsl.hue && (hsl.hue < -180 || hsl.hue > 180)) {
            warnings.push(`${channel} hue value should be between -180 and 180 degrees`);
          }
          if (hsl.saturation && (hsl.saturation < -100 || hsl.saturation > 200)) {
            warnings.push(`${channel} saturation value should be between -100 and 200 percent`);
          }
          if (hsl.luminance && (hsl.luminance < -100 || hsl.luminance > 100)) {
            warnings.push(`${channel} luminance value should be between -100 and 100 percent`);
          }
        }
      }
    }
    
    // Check version compatibility
    if (presetData.version) {
      const version = this.parseVersion(presetData.version);
      const currentVersion = this.parseVersion('1.0.0');
      
      if (version.major > currentVersion.major) {
        warnings.push(`Preset was created with a newer version (${presetData.version}). Some features may not be supported.`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  static parseVersion(versionString) {
    const parts = versionString.split('.').map(n => parseInt(n) || 0);
    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0
    };
  }
  
  static upgradePreset(presetData) {
    // Handle version upgrades and compatibility issues
    const upgraded = { ...presetData };
    
    // Ensure current version
    upgraded.version = '1.0.0';
    
    // Upgrade legacy field names
    if (upgraded.adjustments.hslAquas) {
      upgraded.adjustments.hslCyans = upgraded.adjustments.hslAquas;
      delete upgraded.adjustments.hslAquas;
    }
    
    // Ensure all HSL channels have proper structure
    const hslChannels = ['hslReds', 'hslOranges', 'hslYellows', 'hslGreens', 'hslCyans', 'hslBlues', 'hslPurples', 'hslMagentas'];
    for (const channel of hslChannels) {
      if (upgraded.adjustments[channel] && typeof upgraded.adjustments[channel] !== 'object') {
        // Convert old single-value format to new object format
        const value = upgraded.adjustments[channel];
        upgraded.adjustments[channel] = { hue: 0, saturation: value, luminance: 0 };
      }
    }
    
    // Add missing metadata
    if (!upgraded.createdAt) {
      upgraded.createdAt = new Date().toISOString();
    }
    
    if (!upgraded.tags) {
      upgraded.tags = [upgraded.category || 'imported'];
    }
    
    return upgraded;
  }
  
  static generatePresetSchema() {
    // Generate a complete schema example for documentation
    return {
      name: "Example Underwater Preset",
      description: "Professional underwater color correction with coral enhancement",
      category: "custom",
      creator: "Photographer Name",
      version: "1.0.0",
      tags: ["underwater", "coral", "tropical"],
      adjustments: {
        exposure: 25,
        contrast: 15,
        highlights: -20,
        shadows: 30,
        saturation: 35,
        vibrance: 40,
        warmth: 10,
        clarity: 20,
        temperature: -15,
        tint: 5,
        hslReds: { hue: 5, saturation: 15, luminance: 0 },
        hslOranges: { hue: 0, saturation: 20, luminance: 5 },
        hslYellows: { hue: -5, saturation: 10, luminance: 0 },
        hslGreens: { hue: 0, saturation: 5, luminance: 0 },
        hslCyans: { hue: 0, saturation: 10, luminance: 5 },
        hslBlues: { hue: -5, saturation: 15, luminance: 10 },
        hslPurples: { hue: 0, saturation: 0, luminance: 0 },
        hslMagentas: { hue: 0, saturation: 5, luminance: 0 },
        luminanceNoise: 0,
        colorNoise: 0,
        sharpening: 15,
        sharpenRadius: 1.0,
        distortion: 0,
        chromaticAberration: 0,
        vignette: 0
      },
      metadata: {
        targetConditions: ["tropical waters", "10-30ft depth"],
        bestUsedWith: ["coral photography", "macro shots"],
        cameraProfiles: ["Standard", "Natural"],
        notes: "Works best with natural lighting conditions"
      }
    };
  }
}

export default PresetValidator;