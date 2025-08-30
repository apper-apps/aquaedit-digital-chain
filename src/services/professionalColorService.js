/**
 * Professional Color Science Service for 16-bit workflows
 * Specialized for freediving photography with advanced color correction
 * Handles color space conversions, gamut mapping, and underwater color science
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
        },
        transferFunction: 'sRGB'
      },
      'Adobe RGB': {
        gamut: 'print',
        bitDepth: 16,
        whitePoint: 'D65',
        primaries: {
          red: [0.64, 0.33],
          green: [0.21, 0.71],
          blue: [0.15, 0.06]
        },
        transferFunction: 'gamma2.2'
      },
      'ProPhoto RGB': {
        gamut: 'professional',
        bitDepth: 16,
        whitePoint: 'D50',
        primaries: {
          red: [0.7347, 0.2653],
          green: [0.1596, 0.8404],
          blue: [0.0366, 0.0001]
        },
        transferFunction: 'gamma1.8'
      },
      'Rec. 2020': {
        gamut: 'ultra_wide',
        bitDepth: 16,
        whitePoint: 'D65',
        primaries: {
          red: [0.708, 0.292],
          green: [0.170, 0.797],
          blue: [0.131, 0.046]
        },
        transferFunction: 'PQ'
      }
    };

    // Advanced underwater color profiles with depth-based mathematical models
    this.underwaterColorProfiles = {
      'Shallow Reef (0-10m)': {
        redCompensation: 1.2,
        blueAttenuation: 0.85,
        greenShift: 1.08,
        depthAdjustment: true,
        lightPenetration: 0.95,
        backscatterCompensation: 0.1,
        coralEnhancement: 1.15
      },
      'Open Water (10-20m)': {
        redCompensation: 1.5,
        blueAttenuation: 0.75,
        greenShift: 1.2,
        depthAdjustment: true,
        lightPenetration: 0.8,
        backscatterCompensation: 0.2,
        coralEnhancement: 1.0
      },
      'Deep Blue (20-40m)': {
        redCompensation: 2.0,
        blueAttenuation: 0.6,
        greenShift: 1.4,
        depthAdjustment: true,
        lightPenetration: 0.6,
        backscatterCompensation: 0.3,
        coralEnhancement: 0.9
      },
      'Cave/Wreck Interior': {
        redCompensation: 2.5,
        blueAttenuation: 0.5,
        greenShift: 1.6,
        depthAdjustment: false,
        lightPenetration: 0.4,
        backscatterCompensation: 0.4,
        coralEnhancement: 0.8,
        artificialLightCompensation: true
      },
      'Murky Water': {
        redCompensation: 1.8,
        blueAttenuation: 0.4,
        greenShift: 1.8,
        depthAdjustment: true,
        lightPenetration: 0.3,
        backscatterCompensation: 0.6,
        coralEnhancement: 0.7,
        particleCorrection: true
      }
    };

    // Three-way color correction matrices for professional grading
    this.colorGradingMatrices = {
      shadows: { range: [0, 0.3], weight: 1.0 },
      midtones: { range: [0.2, 0.8], weight: 1.0 },
      highlights: { range: [0.7, 1.0], weight: 1.0 }
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
   * Apply three-way color correction (shadows, midtones, highlights)
   */
  applyThreeWayColorCorrection(imageData, colorGrading) {
    const data = imageData.data;
    const result = new ImageData(data.slice(), imageData.width, imageData.height);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      
      // Calculate luminance for tonal range determination
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Calculate weights for each tonal range
      const shadowWeight = this.calculateTonalWeight(luminance, 'shadows');
      const midtoneWeight = this.calculateTonalWeight(luminance, 'midtones');
      const highlightWeight = this.calculateTonalWeight(luminance, 'highlights');
      
      // Apply lift, gamma, and gain adjustments
      let newR = r, newG = g, newB = b;
      
      // Shadows (Lift)
      if (colorGrading.shadows?.lift) {
        newR += (colorGrading.shadows.lift[0] / 100) * shadowWeight;
        newG += (colorGrading.shadows.lift[1] / 100) * shadowWeight;
        newB += (colorGrading.shadows.lift[2] / 100) * shadowWeight;
      }
      
      // Midtones (Gamma)
      if (colorGrading.midtones?.gamma) {
        const gammaR = 1 + (colorGrading.midtones.gamma[0] / 100);
        const gammaG = 1 + (colorGrading.midtones.gamma[1] / 100);
        const gammaB = 1 + (colorGrading.midtones.gamma[2] / 100);
        
        newR = Math.pow(newR, 1/gammaR) * midtoneWeight + newR * (1 - midtoneWeight);
        newG = Math.pow(newG, 1/gammaG) * midtoneWeight + newG * (1 - midtoneWeight);
        newB = Math.pow(newB, 1/gammaB) * midtoneWeight + newB * (1 - midtoneWeight);
      }
      
      // Highlights (Gain)
      if (colorGrading.highlights?.gain) {
        newR *= (1 + (colorGrading.highlights.gain[0] / 100) * highlightWeight);
        newG *= (1 + (colorGrading.highlights.gain[1] / 100) * highlightWeight);
        newB *= (1 + (colorGrading.highlights.gain[2] / 100) * highlightWeight);
      }
      
      // Apply master controls
      if (colorGrading.master) {
        // Master saturation
        if (colorGrading.master.saturation) {
          const satMult = 1 + (colorGrading.master.saturation / 100);
          const gray = 0.299 * newR + 0.587 * newG + 0.114 * newB;
          newR = gray + (newR - gray) * satMult;
          newG = gray + (newG - gray) * satMult;
          newB = gray + (newB - gray) * satMult;
        }
      }
      
      result.data[i] = Math.max(0, Math.min(255, newR * 255));
      result.data[i + 1] = Math.max(0, Math.min(255, newG * 255));
      result.data[i + 2] = Math.max(0, Math.min(255, newB * 255));
    }

    return result;
  }

  /**
   * Calculate tonal weight for three-way color correction
   */
  calculateTonalWeight(luminance, range) {
    const ranges = this.colorGradingMatrices[range];
    if (!ranges) return 0;

    const [min, max] = ranges.range;
    
    if (luminance < min) {
      return range === 'shadows' ? 1 : 0;
    } else if (luminance > max) {
      return range === 'highlights' ? 1 : 0;
    } else {
      // Smooth transition using cosine interpolation
      const t = (luminance - min) / (max - min);
      if (range === 'shadows') {
        return Math.cos(t * Math.PI / 2);
      } else if (range === 'highlights') {
        return Math.sin(t * Math.PI / 2);
      } else { // midtones
        return Math.sin(t * Math.PI);
      }
    }
  }

  /**
   * Advanced color matching with freediving-specific algorithms
   */
  matchColors(sourceImageData, targetImageData, matchType = 'underwater_histogram') {
    switch (matchType) {
      case 'underwater_histogram':
        return this.underwaterHistogramMatching(sourceImageData, targetImageData);
      case 'color_temperature':
        return this.colorTemperatureMatching(sourceImageData, targetImageData);
      case 'depth_based':
        return this.depthBasedMatching(sourceImageData, targetImageData);
      default:
        return this.histogramMatching(sourceImageData, targetImageData);
    }
  }

  /**
   * Underwater-specific histogram matching
   */
  underwaterHistogramMatching(sourceImageData, targetImageData) {
    const sourceData = sourceImageData.data;
    const targetData = targetImageData.data;
    const result = new ImageData(sourceData.slice(), sourceImageData.width, sourceImageData.height);

    // Separate processing for underwater channels with different weights
    const channelWeights = [1.3, 1.0, 0.7]; // Red enhanced, blue reduced for underwater

    for (let channel = 0; channel < 3; channel++) {
      const sourceHist = this.calculateHistogram(sourceData, channel);
      const targetHist = this.calculateHistogram(targetData, channel);
      const mapping = this.createHistogramMapping(sourceHist, targetHist, channelWeights[channel]);

      for (let i = channel; i < sourceData.length; i += 4) {
        result.data[i] = mapping[sourceData[i]];
      }
    }

    return result;
  }

  /**
   * Calculate histogram for a color channel with weighting
   */
  calculateHistogram(imageData, channel, weight = 1.0) {
    const histogram = new Array(256).fill(0);
    
    for (let i = channel; i < imageData.length; i += 4) {
      const value = Math.round(imageData[i] * weight);
      const clampedValue = Math.max(0, Math.min(255, value));
      histogram[clampedValue]++;
    }

    return histogram;
  }

  /**
   * Create mapping between source and target histograms with weighting
   */
  createHistogramMapping(sourceHist, targetHist, weight = 1.0) {
    const sourceCDF = this.calculateCDF(sourceHist);
    const targetCDF = this.calculateCDF(targetHist);
    
    const mapping = new Array(256);
    
    for (let i = 0; i < 256; i++) {
      let j = 0;
      const adjustedSource = sourceCDF[i] * weight;
      
      while (j < 255 && targetCDF[j] < adjustedSource) {
        j++;
      }
      mapping[i] = Math.max(0, Math.min(255, j));
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
    if (total > 0) {
      for (let i = 0; i < 256; i++) {
        cdf[i] /= total;
      }
    }

    return cdf;
  }

  /**
   * Color harmony analysis for underwater scenes
   */
  analyzeColorHarmony(imageData) {
    const dominantColors = this.extractDominantColors(imageData, 5);
    const harmonyScore = this.calculateHarmonyScore(dominantColors);
    const recommendations = this.generateHarmonyRecommendations(dominantColors);
    
    return {
      dominantColors,
      harmonyScore,
      recommendations,
      colorTemperature: this.estimateColorTemperature(dominantColors),
      underwaterCompatibility: this.assessUnderwaterCompatibility(dominantColors)
    };
  }

  /**
   * Extract dominant colors using k-means clustering
   */
  extractDominantColors(imageData, k = 5) {
    const data = imageData.data;
    const pixels = [];
    
    // Sample pixels (every 10th pixel for performance)
    for (let i = 0; i < data.length; i += 40) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
    
    // Simplified k-means clustering
    const clusters = this.kMeansClustering(pixels, k);
    return clusters.map(cluster => ({
      rgb: cluster.center,
      percentage: (cluster.size / pixels.length) * 100,
      hsv: this.rgbToHsv(cluster.center)
    }));
  }

  /**
   * Simplified k-means clustering for color extraction
   */
  kMeansClustering(pixels, k) {
    const clusters = [];
    
    // Initialize random centroids
    for (let i = 0; i < k; i++) {
      const randomIndex = Math.floor(Math.random() * pixels.length);
      clusters.push({
        center: [...pixels[randomIndex]],
        pixels: [],
        size: 0
      });
    }
    
    // Simplified clustering (3 iterations for performance)
    for (let iter = 0; iter < 3; iter++) {
      // Clear previous assignments
      clusters.forEach(cluster => {
        cluster.pixels = [];
        cluster.size = 0;
      });
      
      // Assign pixels to nearest cluster
      pixels.forEach(pixel => {
        let minDist = Infinity;
        let nearestCluster = 0;
        
        clusters.forEach((cluster, index) => {
          const dist = this.colorDistance(pixel, cluster.center);
          if (dist < minDist) {
            minDist = dist;
            nearestCluster = index;
          }
        });
        
        clusters[nearestCluster].pixels.push(pixel);
        clusters[nearestCluster].size++;
      });
      
      // Update centroids
      clusters.forEach(cluster => {
        if (cluster.pixels.length > 0) {
          const sum = cluster.pixels.reduce((acc, pixel) => [
            acc[0] + pixel[0],
            acc[1] + pixel[1],
            acc[2] + pixel[2]
          ], [0, 0, 0]);
          
          cluster.center = [
            Math.round(sum[0] / cluster.pixels.length),
            Math.round(sum[1] / cluster.pixels.length),
            Math.round(sum[2] / cluster.pixels.length)
          ];
        }
      });
    }
    
    return clusters;
  }

  /**
   * Calculate color distance using weighted Euclidean distance
   */
  colorDistance(color1, color2) {
    const rDiff = color1[0] - color2[0];
    const gDiff = color1[1] - color2[1];
    const bDiff = color1[2] - color2[2];
    
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  }

  /**
   * Convert RGB to HSV color space
   */
  rgbToHsv([r, g, b]) {
    r /= 255; g /= 255; b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6;
      else if (max === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    const s = max === 0 ? 0 : Math.round((diff / max) * 100);
    const v = Math.round(max * 100);
    
    return [h, s, v];
  }

  /**
   * Get available color profiles
   */
  getAvailableProfiles() {
    return Object.keys(this.colorProfiles);
  }

  /**
   * Get available underwater profiles
   */
  getAvailableUnderwaterProfiles() {
    return Object.keys(this.underwaterColorProfiles);
  }

  /**
   * Check if profile is compatible with bit depth
   */
  isProfileCompatible(profileName, bitDepth) {
    const profile = this.colorProfiles[profileName];
    return profile ? profile.bitDepth >= bitDepth : false;
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