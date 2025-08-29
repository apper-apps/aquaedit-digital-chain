/**
 * Professional Color Science Service for 16-bit workflows
 * Handles color space conversions, gamut mapping, and professional printing workflows
 */

class ProfessionalColorService {
  constructor() {
    this.colorProfiles = {
      'sRGB': {
        gamut: 'web',
        bitDepth: 8,
        whitePoint: 'D65',
        primaries: {
          red: [0.64, 0.33],
          green: [0.3, 0.6],
          blue: [0.15, 0.06]
        }
      },
      'Adobe RGB': {
        gamut: 'print',
        bitDepth: 16,
        whitePoint: 'D65',
        primaries: {
          red: [0.64, 0.33],
          green: [0.21, 0.71],
          blue: [0.15, 0.06]
        }
      },
      'ProPhoto RGB': {
        gamut: 'professional',
        bitDepth: 16,
        whitePoint: 'D50',
        primaries: {
          red: [0.7347, 0.2653],
          green: [0.1596, 0.8404],
          blue: [0.0366, 0.0001]
        }
      }
    };

    this.underwaterColorProfiles = {
      'Underwater Standard': {
        redCompensation: 1.3,
        blueAttenuation: 0.8,
        greenShift: 1.1,
        depthAdjustment: true
      },
      'Deep Water': {
        redCompensation: 1.8,
        blueAttenuation: 0.6,
        greenShift: 1.3,
        depthAdjustment: true
      },
      'Shallow Reef': {
        redCompensation: 1.1,
        blueAttenuation: 0.9,
        greenShift: 1.05,
        depthAdjustment: false
      }
    };
  }

  /**
   * Convert between color spaces with 16-bit precision
   */
  convertColorSpace(imageData, fromSpace, toSpace) {
    if (fromSpace === toSpace) return imageData;

    const data = imageData.data;
    const result = new ImageData(data.slice(), imageData.width, imageData.height);
    
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = this.convertPixel(
        [data[i], data[i + 1], data[i + 2]], 
        fromSpace, 
        toSpace
      );
      
      result.data[i] = Math.max(0, Math.min(255, r));
      result.data[i + 1] = Math.max(0, Math.min(255, g));
      result.data[i + 2] = Math.max(0, Math.min(255, b));
    }
    
    return result;
  }

  /**
   * Convert individual pixel between color spaces
   */
  convertPixel([r, g, b], fromSpace, toSpace) {
    // Normalize to 0-1 range for 16-bit processing
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    // Apply gamma correction
    const rLinear = this.applyGamma(rNorm, fromSpace, 'decode');
    const gLinear = this.applyGamma(gNorm, fromSpace, 'decode');
    const bLinear = this.applyGamma(bNorm, fromSpace, 'decode');

    // Convert to XYZ color space (intermediate)
    const [x, y, z] = this.rgbToXYZ([rLinear, gLinear, bLinear], fromSpace);

    // Convert from XYZ to target RGB
    const [rTarget, gTarget, bTarget] = this.xyzToRGB([x, y, z], toSpace);

    // Apply target gamma
    const rFinal = this.applyGamma(rTarget, toSpace, 'encode');
    const gFinal = this.applyGamma(gTarget, toSpace, 'encode');
    const bFinal = this.applyGamma(bTarget, toSpace, 'encode');

    return [rFinal * 255, gFinal * 255, bFinal * 255];
  }

  /**
   * Apply gamma correction for different color spaces
   */
  applyGamma(value, colorSpace, direction) {
    const gammaValues = {
      'sRGB': 2.2,
      'Adobe RGB': 2.2,
      'ProPhoto RGB': 1.8
    };

    const gamma = gammaValues[colorSpace] || 2.2;

    if (direction === 'encode') {
      return Math.pow(Math.max(0, value), 1 / gamma);
    } else {
      return Math.pow(Math.max(0, value), gamma);
    }
  }

  /**
   * Convert RGB to XYZ color space
   */
  rgbToXYZ([r, g, b], colorSpace) {
    const profile = this.colorProfiles[colorSpace];
    if (!profile) return [r, g, b]; // Fallback

    // Color space transformation matrices (simplified)
    const matrices = {
      'sRGB': [
        [0.4124564, 0.3575761, 0.1804375],
        [0.2126729, 0.7151522, 0.0721750],
        [0.0193339, 0.1191920, 0.9503041]
      ],
      'Adobe RGB': [
        [0.5767309, 0.1855540, 0.1881852],
        [0.2973769, 0.6273491, 0.0752741],
        [0.0270343, 0.0706872, 0.9911085]
      ],
      'ProPhoto RGB': [
        [0.7976749, 0.1351917, 0.0313534],
        [0.2880402, 0.7118741, 0.0000857],
        [0.0000000, 0.0000000, 0.8252100]
      ]
    };

    const matrix = matrices[colorSpace] || matrices['sRGB'];
    
    return [
      matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b,
      matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b,
      matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b
    ];
  }

  /**
   * Convert XYZ to RGB color space
   */
  xyzToRGB([x, y, z], colorSpace) {
    // Inverse matrices for XYZ to RGB conversion
    const matrices = {
      'sRGB': [
        [3.2404542, -1.5371385, -0.4985314],
        [-0.9692660, 1.8760108, 0.0415560],
        [0.0556434, -0.2040259, 1.0572252]
      ],
      'Adobe RGB': [
        [2.0413690, -0.5649464, -0.3446944],
        [-0.9692660, 1.8760108, 0.0415560],
        [0.0134474, -0.1183897, 1.0154096]
      ],
      'ProPhoto RGB': [
        [1.3459433, -0.2556075, -0.0511118],
        [-0.5445989, 1.5081673, 0.0205351],
        [0.0000000, 0.0000000, 1.2118128]
      ]
    };

    const matrix = matrices[colorSpace] || matrices['sRGB'];
    
    return [
      matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z,
      matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z,
      matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z
    ];
  }

  /**
   * Apply underwater color profile corrections
   */
  applyUnderwaterProfile(imageData, profileName, depth = 0) {
    const profile = this.underwaterColorProfiles[profileName];
    if (!profile) return imageData;

    const data = imageData.data;
    const result = new ImageData(data.slice(), imageData.width, imageData.height);

    // Calculate depth-based adjustments
    const depthFactor = profile.depthAdjustment ? Math.max(0.5, 1 - depth / 30) : 1;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Apply red compensation (red light is absorbed first underwater)
      r *= profile.redCompensation * depthFactor;

      // Apply blue attenuation (blue light penetrates deeper)
      b *= profile.blueAttenuation;

      // Apply green shift correction
      g *= profile.greenShift;

      result.data[i] = Math.max(0, Math.min(255, r));
      result.data[i + 1] = Math.max(0, Math.min(255, g));
      result.data[i + 2] = Math.max(0, Math.min(255, b));
    }

    return result;
  }

  /**
   * Detect out-of-gamut colors for target color space
   */
  detectOutOfGamut(imageData, targetColorSpace) {
    const data = imageData.data;
    const outOfGamutPixels = [];
    const profile = this.colorProfiles[targetColorSpace];
    
    if (!profile) return outOfGamutPixels;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;

      if (this.isOutOfGamut([r, g, b], targetColorSpace)) {
        outOfGamutPixels.push({
          index: i / 4,
          x: (i / 4) % imageData.width,
          y: Math.floor((i / 4) / imageData.width),
          rgb: [r, g, b]
        });
      }
    }

    return outOfGamutPixels;
  }

  /**
   * Check if RGB values are within gamut for color space
   */
  isOutOfGamut([r, g, b], colorSpace) {
    // Convert to target color space and check bounds
    const [rTarget, gTarget, bTarget] = this.convertPixel([r * 255, g * 255, b * 255], 'sRGB', colorSpace);
    
    return (
      rTarget < 0 || rTarget > 255 ||
      gTarget < 0 || gTarget > 255 ||
      bTarget < 0 || bTarget > 255
    );
  }

  /**
   * Soft proof for print preview
   */
  generateSoftProof(imageData, targetColorSpace, paperType = 'glossy') {
    // Simulate ink limitations and paper characteristics
    const inkLimits = {
      'matte': { cyan: 85, magenta: 85, yellow: 85, black: 95 },
      'glossy': { cyan: 95, magenta: 95, yellow: 95, black: 100 },
      'canvas': { cyan: 80, magenta: 80, yellow: 80, black: 90 }
    };

    const limits = inkLimits[paperType] || inkLimits['glossy'];
    const converted = this.convertColorSpace(imageData, 'sRGB', targetColorSpace);
    
    // Apply ink limitations (simplified)
    const data = converted.data;
    for (let i = 0; i < data.length; i += 4) {
      // Convert to CMYK simulation (simplified)
      const c = 255 - data[i];
      const m = 255 - data[i + 1];
      const y = 255 - data[i + 2];
      const k = Math.min(c, m, y);

      // Apply ink limits
      const cLimited = Math.min(c, limits.cyan * 2.55);
      const mLimited = Math.min(m, limits.magenta * 2.55);
      const yLimited = Math.min(y, limits.yellow * 2.55);
      const kLimited = Math.min(k, limits.black * 2.55);

      // Convert back to RGB
      data[i] = Math.max(0, 255 - cLimited);
      data[i + 1] = Math.max(0, 255 - mLimited);
      data[i + 2] = Math.max(0, 255 - yLimited);
    }

    return converted;
  }

  /**
   * Color matching between images for consistent processing
   */
  matchColors(sourceImageData, targetImageData, matchType = 'histogram') {
    if (matchType === 'histogram') {
      return this.histogramMatching(sourceImageData, targetImageData);
    } else if (matchType === 'statistics') {
      return this.statisticalMatching(sourceImageData, targetImageData);
    }
    
    return sourceImageData;
  }

  /**
   * Histogram-based color matching
   */
  histogramMatching(sourceImageData, targetImageData) {
    const sourceData = sourceImageData.data;
    const targetData = targetImageData.data;
    const result = new ImageData(sourceData.slice(), sourceImageData.width, sourceImageData.height);

    // Calculate histograms for each channel
    for (let channel = 0; channel < 3; channel++) {
      const sourceHist = this.calculateHistogram(sourceData, channel);
      const targetHist = this.calculateHistogram(targetData, channel);
      const mapping = this.createHistogramMapping(sourceHist, targetHist);

      // Apply mapping to source image
      for (let i = channel; i < sourceData.length; i += 4) {
        result.data[i] = mapping[sourceData[i]];
      }
    }

    return result;
  }

  /**
   * Calculate histogram for a color channel
   */
  calculateHistogram(imageData, channel) {
    const histogram = new Array(256).fill(0);
    
    for (let i = channel; i < imageData.length; i += 4) {
      histogram[imageData[i]]++;
    }

    return histogram;
  }

  /**
   * Create mapping between source and target histograms
   */
  createHistogramMapping(sourceHist, targetHist) {
    // Calculate cumulative distribution functions
    const sourceCDF = this.calculateCDF(sourceHist);
    const targetCDF = this.calculateCDF(targetHist);
    
    const mapping = new Array(256);
    
    for (let i = 0; i < 256; i++) {
      let j = 0;
      while (j < 255 && targetCDF[j] < sourceCDF[i]) {
        j++;
      }
      mapping[i] = j;
    }

    return mapping;
  }

  /**
   * Calculate cumulative distribution function
   */
  calculateCDF(histogram) {
    const cdf = new Array(256);
    cdf[0] = histogram[0];
    
    for (let i = 1; i < 256; i++) {
      cdf[i] = cdf[i - 1] + histogram[i];
    }

    // Normalize
    const total = cdf[255];
    for (let i = 0; i < 256; i++) {
      cdf[i] /= total;
    }

    return cdf;
  }

  /**
   * Get available color profiles
   */
  getAvailableProfiles() {
    return {
      colorSpaces: Object.keys(this.colorProfiles),
      underwaterProfiles: Object.keys(this.underwaterColorProfiles)
    };
  }

  /**
   * Validate color profile compatibility
   */
  isProfileCompatible(profileName, bitDepth) {
    const profile = this.colorProfiles[profileName];
    return profile && profile.bitDepth >= bitDepth;
  }
}

export default new ProfessionalColorService();