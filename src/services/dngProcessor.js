// DNG Processing Service for Lightroom Preset Extraction
export class DNGProcessor {
static async extractXMPMetadata(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const buffer = e.target.result;
          const view = new DataView(buffer);
          
          // Find XMP metadata section in DNG file
          const xmpData = this.findXMPData(buffer);
          if (!xmpData) {
            reject(new Error('No XMP metadata found in DNG file'));
            return;
          }
          
          // Parse Lightroom adjustments with enhanced parameter support
          const adjustments = this.parseLightroomAdjustments(xmpData);
          const metadata = this.parseImageMetadata(xmpData);
          const localAdjustments = this.parseLocalAdjustments(xmpData);
          const lensCorrections = this.parseLensCorrections(xmpData);
          
          resolve({
            adjustments: { ...adjustments, ...lensCorrections },
            metadata,
            localAdjustments,
            rawXMP: xmpData,
            processVersion: this.extractXMPValue(xmpData, 'crs:ProcessVersion', '5.0')
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read DNG file'));
      reader.readAsArrayBuffer(file);
    });
  }
  
  static findXMPData(buffer) {
    const text = new TextDecoder('utf-8', { fatal: false }).decode(buffer);
    const xmpStart = text.indexOf('<x:xmpmeta');
    const xmpEnd = text.indexOf('</x:xmpmeta>');
    
    if (xmpStart !== -1 && xmpEnd !== -1) {
      return text.substring(xmpStart, xmpEnd + 12);
    }
    
    // Try alternative XMP markers
    const altStart = text.indexOf('<?xpacket');
    const altEnd = text.indexOf('<?xpacket end');
    
    if (altStart !== -1 && altEnd !== -1) {
      return text.substring(altStart, altEnd + 20);
    }
    
    return null;
  }
  
  static parseLightroomAdjustments(xmpData) {
    const adjustments = {};
    
// Enhanced Lightroom to AquaEdit Pro parameter mapping
    const parameterMap = {
      'crs:Exposure2012': { key: 'exposure', scale: 100 },
      'crs:Contrast2012': { key: 'contrast', scale: 1 },
      'crs:Highlights2012': { key: 'highlights', scale: 1 },
      'crs:Shadows2012': { key: 'shadows', scale: 1 },
      'crs:Whites2012': { key: 'whites', scale: 1 },
      'crs:Blacks2012': { key: 'blacks', scale: 1 },
      'crs:Texture': { key: 'texture', scale: 1 },
      'crs:Clarity2012': { key: 'clarity', scale: 1 },
      'crs:Dehaze': { key: 'dehaze', scale: 1 },
      'crs:Vibrance': { key: 'vibrance', scale: 1 },
      'crs:Saturation': { key: 'saturation', scale: 1 },
      'crs:Temperature': { key: 'temperature', scale: 0.02 },
      'crs:Tint': { key: 'tint', scale: 0.5 },
      'crs:LuminanceSmoothing': { key: 'luminanceNoise', scale: 1 },
      'crs:ColorNoiseReduction': { key: 'colorNoise', scale: 1 },
      'crs:SharpenAmount': { key: 'sharpening', scale: 1 },
      'crs:SharpenRadius': { key: 'sharpenRadius', scale: 1 },
      'crs:SharpenDetail': { key: 'sharpenDetail', scale: 1 },
      'crs:SharpenEdgeMasking': { key: 'sharpenMasking', scale: 1 }
    };
    
    // Extract HSL adjustments
    const hslChannels = ['Red', 'Orange', 'Yellow', 'Green', 'Aqua', 'Blue', 'Purple', 'Magenta'];
    const hslMap = {
      'Red': 'hslReds',
      'Orange': 'hslOranges', 
      'Yellow': 'hslYellows',
      'Green': 'hslGreens',
      'Aqua': 'hslCyans',
      'Blue': 'hslBlues',
      'Purple': 'hslPurples',
      'Magenta': 'hslMagentas'
    };
    
    // Parse basic adjustments
    for (const [crsKey, config] of Object.entries(parameterMap)) {
      const value = this.extractXMPValue(xmpData, crsKey, 0);
      if (value !== 0) {
        adjustments[config.key] = value * config.scale;
      }
    }
    
    // Parse HSL adjustments
    for (const channel of hslChannels) {
      const hslKey = hslMap[channel];
      if (hslKey) {
        const hue = this.extractXMPValue(xmpData, `crs:Hue${channel}`, 0);
        const saturation = this.extractXMPValue(xmpData, `crs:Saturation${channel}`, 0);
        const luminance = this.extractXMPValue(xmpData, `crs:Luminance${channel}`, 0);
        
        if (hue !== 0 || saturation !== 0 || luminance !== 0) {
          adjustments[hslKey] = { hue, saturation, luminance };
        }
      }
    }
// Parse tone curve if present
    // Note: HSL adjustments already processed above using hslChannels and hslMap

    // Extract tone curve data
    const curveData = this.extractToneCurve(xmpData);
    if (curveData) {
      adjustments.masterCurve = curveData;
    }
    
    return adjustments;
  }

  static parseLensCorrections(xmpData) {
    const lensCorrections = {};
    
    // Lens distortion correction
    const distortion = this.extractXMPValue(xmpData, 'crs:LensProfileDistortionScale', 0);
    if (distortion !== 0) {
      lensCorrections.distortion = distortion;
    }

    // Chromatic aberration correction
    const chromaticR = this.extractXMPValue(xmpData, 'crs:ChromaticAberrationR', 0);
    const chromaticB = this.extractXMPValue(xmpData, 'crs:ChromaticAberrationB', 0);
    if (chromaticR !== 0 || chromaticB !== 0) {
      lensCorrections.chromaticAberration = Math.max(Math.abs(chromaticR), Math.abs(chromaticB));
    }

    // Vignette correction
    const vignette = this.extractXMPValue(xmpData, 'crs:PostCropVignetteAmount', 0);
    if (vignette !== 0) {
      lensCorrections.vignette = vignette;
    }

    // Lens profile corrections
    const lensProfileEnabled = this.extractXMPValue(xmpData, 'crs:LensProfileEnable', 0);
    if (lensProfileEnabled) {
      lensCorrections.lensProfileEnabled = true;
      lensCorrections.lensProfileName = this.extractXMPValue(xmpData, 'crs:LensProfileName', '');
    }

    return lensCorrections;
  }

  static parseLocalAdjustments(xmpData) {
    const localAdjustments = [];
    
    // Extract graduated filter data
    const gradientMatch = xmpData.match(/crs:GradientBasedCorrections="([^"]*)"/);
    if (gradientMatch) {
      localAdjustments.push({
        type: 'gradient',
        data: this.parseGradientFilter(gradientMatch[1])
      });
    }

    // Extract radial filter data
    const radialMatch = xmpData.match(/crs:CircularGradientBasedCorrections="([^"]*)"/);
    if (radialMatch) {
      localAdjustments.push({
        type: 'radial',
        data: this.parseRadialFilter(radialMatch[1])
      });
    }

    // Extract masking/brush data
    const maskMatch = xmpData.match(/crs:PaintBasedCorrections="([^"]*)"/);
    if (maskMatch) {
      localAdjustments.push({
        type: 'brush',
        data: this.parseBrushAdjustments(maskMatch[1])
      });
    }

    return localAdjustments;
  }

  static parseGradientFilter(data) {
    // Parse linear gradient filter parameters
    const params = data.split(',');
    return {
      centerX: parseFloat(params[0]) || 0.5,
      centerY: parseFloat(params[1]) || 0.5,
      rotation: parseFloat(params[2]) || 0,
      feather: parseFloat(params[3]) || 50,
      adjustments: this.parseLocalAdjustmentParams(data)
    };
  }

  static parseRadialFilter(data) {
    // Parse radial gradient filter parameters
    const params = data.split(',');
    return {
      centerX: parseFloat(params[0]) || 0.5,
      centerY: parseFloat(params[1]) || 0.5,
      radiusX: parseFloat(params[2]) || 0.2,
      radiusY: parseFloat(params[3]) || 0.2,
      feather: parseFloat(params[4]) || 50,
      invert: params[5] === '1',
      adjustments: this.parseLocalAdjustmentParams(data)
    };
  }

  static parseBrushAdjustments(data) {
    // Parse brush/masking adjustment data
    return {
      brushStrokes: this.parseBrushStrokes(data),
      adjustments: this.parseLocalAdjustmentParams(data)
    };
  }

  static parseBrushStrokes(data) {
    const strokes = [];
    const strokePattern = /Dabs="([^"]*)"/g;
    let strokeMatch;
    
    while ((strokeMatch = strokePattern.exec(data)) !== null) {
      const strokeData = strokeMatch[1];
      const points = strokeData.split(' ').map(point => {
        const [x, y, pressure] = point.split(',').map(parseFloat);
        return { x: x || 0, y: y || 0, pressure: pressure || 1 };
      });
      strokes.push({ points });
    }
    
    return strokes;
  }

  static parseLocalAdjustmentParams(data) {
    const adjustments = {};
    const params = ['Exposure', 'Contrast', 'Highlights', 'Shadows', 'Clarity', 'Saturation', 'Temperature', 'Tint'];
    
    params.forEach(param => {
      const regex = new RegExp(`${param}="([^"]*)"`, 'i');
      const match = data.match(regex);
      if (match) {
        adjustments[param.toLowerCase()] = parseFloat(match[1]) || 0;
      }
    });

    return adjustments;
  }
  
  static parseImageMetadata(xmpData) {
return {
      camera: this.extractXMPValue(xmpData, 'tiff:Model', 'Unknown'),
      lens: this.extractXMPValue(xmpData, 'aux:Lens', 'Unknown') || 
            this.extractXMPValue(xmpData, 'aux:LensInfo', 'Unknown'),
      iso: this.extractXMPValue(xmpData, 'exif:ISOSpeedRatings', null),
      aperture: this.extractXMPValue(xmpData, 'exif:FNumber', null),
      shutterSpeed: this.extractXMPValue(xmpData, 'exif:ExposureTime', null),
      focalLength: this.extractXMPValue(xmpData, 'exif:FocalLength', null),
      creationDate: this.extractXMPValue(xmpData, 'xmp:CreateDate', new Date().toISOString()),
      modifyDate: this.extractXMPValue(xmpData, 'xmp:ModifyDate', new Date().toISOString()),
      software: this.extractXMPValue(xmpData, 'xmp:CreatorTool', 'Adobe Lightroom'),
      colorSpace: this.extractXMPValue(xmpData, 'exif:ColorSpace', 'sRGB'),
      processVersion: this.extractXMPValue(xmpData, 'crs:ProcessVersion', '5.0'),
      hasSettings: this.extractXMPValue(xmpData, 'crs:HasSettings', false),
      hasLensCorrections: this.extractXMPValue(xmpData, 'crs:LensProfileEnable', false)
    };
  }
  
  static extractXMPValue(xmpData, key, defaultValue) {
    // Try attribute format first: key="value"
    const attrRegex = new RegExp(`${key.replace(':', '\\:')}="([^"]*)"`, 'i');
    const attrMatch = xmpData.match(attrRegex);
    
    if (attrMatch && attrMatch[1]) {
      const value = parseFloat(attrMatch[1]);
      return isNaN(value) ? attrMatch[1] : value;
    }
    
    // Try element format: <key>value</key>
    const elemRegex = new RegExp(`<${key.replace(':', '\\:')}>([^<]*)</${key.replace(':', '\\:')}>`, 'i');
    const elemMatch = xmpData.match(elemRegex);
    
    if (elemMatch && elemMatch[1]) {
      const value = parseFloat(elemMatch[1]);
      return isNaN(value) ? elemMatch[1] : value;
    }
    
    return defaultValue;
  }
  
  static extractToneCurve(xmpData) {
    // Look for tone curve data in Lightroom format
    const curveMatch = xmpData.match(/crs:ToneCurve="([^"]+)"/i);
    if (!curveMatch) return null;
    
    const curveString = curveMatch[1];
    const points = curveString.split(' ').map(point => {
      const [input, output] = point.split(',').map(val => parseInt(val));
      return { x: input, y: output };
    });
    
    return points.length > 1 ? points : null;
  }
  
  static validateDNGFile(file) {
    // Check file extension
    if (!file.name.toLowerCase().endsWith('.dng')) {
      return { valid: false, error: 'File must have .dng extension' };
    }
    
    // Check file size (reasonable limits)
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      return { valid: false, error: 'DNG file too large (max 100MB)' };
    }
    
    if (file.size < 1024) { // 1KB minimum
      return { valid: false, error: 'DNG file too small to contain valid data' };
    }
    
    return { valid: true };
  }
}

export default DNGProcessor;