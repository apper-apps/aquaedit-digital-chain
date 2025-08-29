// XMP Sidecar File Processor for Lightroom Compatibility
export class XMPProcessor {
  static async processSidecarFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const xmpContent = e.target.result;
          
          // Parse XMP sidecar file
          const adjustments = this.parseLightroomXMP(xmpContent);
          const metadata = this.parseXMPMetadata(xmpContent);
          const localAdjustments = this.parseLocalAdjustments(xmpContent);
          
          resolve({
            adjustments,
            metadata,
            localAdjustments,
            rawXMP: xmpContent,
            processVersion: this.extractProcessVersion(xmpContent)
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read XMP sidecar file'));
      reader.readAsText(file);
    });
  }

  static parseLightroomXMP(xmpContent) {
    const parameterMap = {
      'crs:Exposure2012': { key: 'exposure', scale: 100 },
      'crs:Contrast2012': { key: 'contrast', scale: 1 },
      'crs:Highlights2012': { key: 'highlights', scale: 1 },
      'crs:Shadows2012': { key: 'shadows', scale: 1 },
      'crs:Whites2012': { key: 'whites', scale: 1 },
      'crs:Blacks2012': { key: 'blacks', scale: 1 },
      'crs:Texture': { key: 'clarity', scale: 1 },
      'crs:Clarity2012': { key: 'clarity', scale: 1 },
      'crs:Dehaze': { key: 'dehaze', scale: 1 },
      'crs:Vibrance': { key: 'vibrance', scale: 1 },
      'crs:Saturation': { key: 'saturation', scale: 1 },
      'crs:Temperature': { key: 'temperature', scale: 0.02 },
      'crs:Tint': { key: 'tint', scale: 0.5 },
      'crs:LensProfileDistortionScale': { key: 'distortion', scale: 1 },
      'crs:ChromaticAberrationR': { key: 'chromaticAberration', scale: 1 },
      'crs:ChromaticAberrationB': { key: 'chromaticAberration', scale: 1 },
      'crs:PostCropVignetteAmount': { key: 'vignette', scale: 1 },
      'crs:LuminanceSmoothing': { key: 'luminanceNoise', scale: 1 },
      'crs:ColorNoiseReduction': { key: 'colorNoise', scale: 1 },
      'crs:SharpenAmount': { key: 'sharpening', scale: 1 },
      'crs:SharpenRadius': { key: 'sharpenRadius', scale: 1 }
    };

    const adjustments = {};

    // Extract basic adjustments
    for (const [xmpKey, config] of Object.entries(parameterMap)) {
      const value = this.extractXMPValue(xmpContent, xmpKey, null);
      if (value !== null) {
        adjustments[config.key] = value * config.scale;
      }
    }

    // Extract HSL adjustments
    const hslChannels = [
      'crs:HueAdjustmentRed', 'crs:HueAdjustmentOrange', 'crs:HueAdjustmentYellow',
      'crs:HueAdjustmentGreen', 'crs:HueAdjustmentAqua', 'crs:HueAdjustmentBlue',
      'crs:HueAdjustmentPurple', 'crs:HueAdjustmentMagenta'
    ];

    const hslMapping = {
      'Red': 'hslReds', 'Orange': 'hslOranges', 'Yellow': 'hslYellows',
      'Green': 'hslGreens', 'Aqua': 'hslCyans', 'Blue': 'hslBlues',
      'Purple': 'hslPurples', 'Magenta': 'hslMagentas'
    };

    for (const [color, key] of Object.entries(hslMapping)) {
      const hue = this.extractXMPValue(xmpContent, `crs:HueAdjustment${color}`, 0);
      const sat = this.extractXMPValue(xmpContent, `crs:SaturationAdjustment${color}`, 0);
      const lum = this.extractXMPValue(xmpContent, `crs:LuminanceAdjustment${color}`, 0);

      if (hue !== 0 || sat !== 0 || lum !== 0) {
        adjustments[key] = {
          hue: hue,
          saturation: sat,
          luminance: lum
        };
      }
    }

    // Extract tone curves
    const toneCurve = this.extractToneCurve(xmpContent);
    if (toneCurve) {
      adjustments.masterCurve = toneCurve;
    }

    return adjustments;
  }

  static parseLocalAdjustments(xmpContent) {
    const localAdjustments = [];
    
    // Extract graduated filters
    const gradientRegex = /crs:GradientBasedCorrections="([^"]*)"/g;
    let gradientMatch;
    
    while ((gradientMatch = gradientRegex.exec(xmpContent)) !== null) {
      const gradientData = gradientMatch[1];
      if (gradientData) {
        localAdjustments.push({
          type: 'gradient',
          data: this.parseGradientData(gradientData)
        });
      }
    }

    // Extract radial filters
    const radialRegex = /crs:CircularGradientBasedCorrections="([^"]*)"/g;
    let radialMatch;
    
    while ((radialMatch = radialRegex.exec(xmpContent)) !== null) {
      const radialData = radialMatch[1];
      if (radialData) {
        localAdjustments.push({
          type: 'radial',
          data: this.parseRadialData(radialData)
        });
      }
    }

    // Extract masking data
    const maskRegex = /crs:PaintBasedCorrections="([^"]*)"/g;
    let maskMatch;
    
    while ((maskMatch = maskRegex.exec(xmpContent)) !== null) {
      const maskData = maskMatch[1];
      if (maskData) {
        localAdjustments.push({
          type: 'mask',
          data: this.parseMaskData(maskData)
        });
      }
    }

    return localAdjustments;
  }

  static parseGradientData(data) {
    // Parse gradient filter parameters
    const params = data.split(',');
    return {
      centerX: parseFloat(params[0]) || 0.5,
      centerY: parseFloat(params[1]) || 0.5,
      rotation: parseFloat(params[2]) || 0,
      feather: parseFloat(params[3]) || 50,
      adjustments: this.parseAdjustmentString(data)
    };
  }

  static parseRadialData(data) {
    // Parse radial filter parameters
    const params = data.split(',');
    return {
      centerX: parseFloat(params[0]) || 0.5,
      centerY: parseFloat(params[1]) || 0.5,
      radiusX: parseFloat(params[2]) || 0.2,
      radiusY: parseFloat(params[3]) || 0.2,
      feather: parseFloat(params[4]) || 50,
      adjustments: this.parseAdjustmentString(data)
    };
  }

  static parseMaskData(data) {
    // Parse brush/mask adjustment data
    return {
      brushStrokes: this.parseBrushStrokes(data),
      adjustments: this.parseAdjustmentString(data)
    };
  }

  static parseBrushStrokes(data) {
    // Extract brush stroke coordinates and properties
    const strokes = [];
    const strokeRegex = /Dabs="([^"]*)"/g;
    let strokeMatch;
    
    while ((strokeMatch = strokeRegex.exec(data)) !== null) {
      const strokeData = strokeMatch[1];
      const points = strokeData.split(' ').map(point => {
        const [x, y, pressure] = point.split(',').map(parseFloat);
        return { x: x || 0, y: y || 0, pressure: pressure || 1 };
      });
      strokes.push({ points });
    }
    
    return strokes;
  }

  static parseAdjustmentString(data) {
    // Extract adjustment parameters from local adjustment data
    const adjustments = {};
    const adjustmentParams = [
      'Exposure', 'Contrast', 'Highlights', 'Shadows', 'Whites', 'Blacks',
      'Texture', 'Clarity', 'Dehaze', 'Vibrance', 'Saturation',
      'Temperature', 'Tint', 'Sharpness'
    ];

    adjustmentParams.forEach(param => {
      const regex = new RegExp(`${param}="([^"]*)"`, 'i');
      const match = data.match(regex);
      if (match) {
        adjustments[param.toLowerCase()] = parseFloat(match[1]) || 0;
      }
    });

    return adjustments;
  }

  static parseXMPMetadata(xmpContent) {
    return {
      camera: this.extractXMPValue(xmpContent, 'tiff:Model', 'Unknown'),
      lens: this.extractXMPValue(xmpContent, 'aux:Lens', 'Unknown') || 
            this.extractXMPValue(xmpContent, 'aux:LensInfo', 'Unknown'),
      iso: this.extractXMPValue(xmpContent, 'exif:ISOSpeedRatings', null),
      aperture: this.extractXMPValue(xmpContent, 'exif:FNumber', null),
      shutterSpeed: this.extractXMPValue(xmpContent, 'exif:ExposureTime', null),
      focalLength: this.extractXMPValue(xmpContent, 'exif:FocalLength', null),
      creationDate: this.extractXMPValue(xmpContent, 'xmp:CreateDate', new Date().toISOString()),
      modifyDate: this.extractXMPValue(xmpContent, 'xmp:ModifyDate', new Date().toISOString()),
      software: this.extractXMPValue(xmpContent, 'xmp:CreatorTool', 'Adobe Lightroom'),
      colorSpace: this.extractXMPValue(xmpContent, 'exif:ColorSpace', 'sRGB'),
      processVersion: this.extractProcessVersion(xmpContent)
    };
  }

  static extractProcessVersion(xmpContent) {
    const version = this.extractXMPValue(xmpContent, 'crs:ProcessVersion', '5.0');
    return version;
  }

  static extractToneCurve(xmpContent) {
    const curveMatch = xmpContent.match(/crs:ToneCurve="([^"]+)"/i);
    if (!curveMatch) return null;
    
    const curveString = curveMatch[1];
    const points = curveString.split(' ').map(point => {
      const [input, output] = point.split(',').map(val => parseInt(val));
      return { x: input || 0, y: output || 0 };
    });
    
    return points.length > 1 ? points : null;
  }

  static extractXMPValue(xmpContent, key, defaultValue) {
    const regex = new RegExp(`${key}="([^"]*)"`, 'i');
    const match = xmpContent.match(regex);
    if (match && match[1]) {
      const value = parseFloat(match[1]);
      return isNaN(value) ? match[1] : value;
    }
    return defaultValue;
  }

  static validateXMPFile(file) {
    if (!file.name.toLowerCase().endsWith('.xmp')) {
      return { valid: false, error: 'File must have .xmp extension' };
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return { valid: false, error: 'XMP file too large (max 10MB)' };
    }
    
    if (file.size < 100) { // 100 bytes minimum
      return { valid: false, error: 'XMP file too small to contain valid data' };
    }
    
    return { valid: true };
  }
}

export default XMPProcessor;