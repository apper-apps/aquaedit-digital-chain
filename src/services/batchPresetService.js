import { getPresets } from '@/services/api/projectService';

/**
 * Single Image Preset Service
 * Optimized for single image workflow with optimal performance
 */
export class SingleImagePresetService {
  constructor() {
    this.presetCache = null;
  }

  /**
   * Get preset recommendation for a single analyzed image
   */
  async getRecommendation(analyzedImage) {
    const presets = await this.getAvailablePresets();
    return this.matchPresetToImage(analyzedImage, presets);
  }

  /**
   * Get available presets with caching
   */
  async getAvailablePresets() {
    if (!this.presetCache) {
      this.presetCache = await getPresets();
    }
    return this.presetCache;
  }

  /**
   * Match optimal preset to image based on analysis
   */
  matchPresetToImage(image, presets) {
    const analysis = image.analysis;
    if (!analysis) return null;
    
    const candidates = [];
    
    // Score each preset against the image conditions
    for (const preset of presets) {
      const score = this.calculatePresetScore(preset, analysis);
      if (score.total > 0.3) { // Minimum threshold
        candidates.push({
          preset,
          score: score.total,
          strength: this.calculateOptimalStrength(preset, analysis),
          confidence: score.confidence,
          reasons: score.reasons
        });
      }
    }
    
    // Sort by score and return best match
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0] || null;
  }

  /**
   * Calculate how well a preset matches image conditions
   */
  calculatePresetScore(preset, analysis) {
    const scores = {
      depth: 0,
      clarity: 0,
      lighting: 0,
      subject: 0,
      colorCast: 0
    };
    
    const reasons = [];
    
    // Depth matching
    if (this.matchesDepth(preset, analysis.estimatedDepth)) {
      scores.depth = 0.8;
      reasons.push(`Optimized for ${analysis.estimatedDepth.toLowerCase()}`);
    } else if (this.partiallyMatchesDepth(preset, analysis.estimatedDepth)) {
      scores.depth = 0.4;
      reasons.push(`Partially suitable for ${analysis.estimatedDepth.toLowerCase()}`);
    }
    
    // Water clarity matching
    if (this.matchesClarity(preset, analysis.waterClarity)) {
      scores.clarity = 0.7;
      reasons.push(`Designed for ${analysis.waterClarity.toLowerCase()} water`);
    }
    
    // Lighting condition matching
    if (this.matchesLighting(preset, analysis.lightingCondition)) {
      scores.lighting = 0.6;
      reasons.push(`Optimized for ${analysis.lightingCondition.toLowerCase()}`);
    }
    
    // Subject type matching
    if (this.matchesSubject(preset, analysis.subjectType)) {
      scores.subject = 0.5;
      reasons.push(`Great for ${analysis.subjectType.toLowerCase()}`);
    }
    
    // Color cast severity matching
    if (this.matchesColorCast(preset, analysis.colorCastSeverity)) {
      scores.colorCast = 0.6;
      reasons.push(`Handles ${analysis.colorCastSeverity?.level?.toLowerCase()} color cast`);
    }
    
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
    const confidence = Math.min(0.95, total + (analysis.confidence - 0.7) * 0.3);
    
    return {
      total,
      confidence: Math.max(0.5, confidence),
      individual: scores,
      reasons
    };
  }

  /**
   * Check if preset matches depth conditions
   */
  matchesDepth(preset, depth) {
    const presetTags = preset.tags || [];
    const presetName = preset.name.toLowerCase();
    const presetDesc = (preset.description || '').toLowerCase();
    
    switch (depth) {
      case 'Surface (0-10ft)':
        return presetTags.includes('surface') || 
               presetName.includes('surface') || 
               presetName.includes('shallow') ||
               presetDesc.includes('surface water');
      
      case 'Shallow (10-30ft)':
        return presetTags.includes('shallow') || 
               presetName.includes('shallow') || 
               presetName.includes('10ft') ||
               presetDesc.includes('shallow water');
      
      case 'Deep (30ft+)':
        return presetTags.includes('deep') || 
               presetName.includes('deep') || 
               presetName.includes('30ft') ||
               presetDesc.includes('deep water');
      
      default:
        return false;
    }
  }

  /**
   * Check partial depth matching
   */
  partiallyMatchesDepth(preset, depth) {
    const presetTags = preset.tags || [];
    const underwater = presetTags.includes('underwater') || 
                      preset.name.toLowerCase().includes('underwater');
    return underwater && !this.matchesDepth(preset, depth);
  }

  /**
   * Check if preset matches water clarity
   */
  matchesClarity(preset, clarity) {
    const presetTags = preset.tags || [];
    const presetName = preset.name.toLowerCase();
    
    switch (clarity) {
      case 'Crystal Clear':
        return presetTags.includes('clear') || 
               presetName.includes('clear') || 
               presetName.includes('crystal');
      
      case 'Slightly Murky':
        return presetTags.includes('murky') || 
               presetName.includes('murky') || 
               presetName.includes('moderate');
      
      case 'Very Murky':
        return presetTags.includes('murky') || 
               presetTags.includes('heavy') ||
               presetName.includes('murky') || 
               presetName.includes('heavy');
      
      case 'Sandy/Silty':
        return presetTags.includes('sandy') || 
               presetTags.includes('silt') ||
               presetName.includes('sand') || 
               presetName.includes('silt');
      
      default:
        return false;
    }
  }

  /**
   * Check if preset matches lighting conditions
   */
  matchesLighting(preset, lighting) {
    const presetTags = preset.tags || [];
    const presetName = preset.name.toLowerCase();
    
    switch (lighting) {
      case 'Natural Sunlight':
        return presetTags.includes('natural') || 
               presetName.includes('natural') || 
               presetName.includes('sun');
      
      case 'Artificial Strobe':
        return presetTags.includes('strobe') || 
               presetTags.includes('flash') ||
               presetName.includes('strobe') || 
               presetName.includes('flash');
      
      case 'Mixed Lighting':
        return presetTags.includes('mixed') || 
               presetName.includes('mixed') || 
               presetName.includes('balanced');
      
      case 'Low Light':
        return presetTags.includes('low-light') || 
               presetName.includes('low light') || 
               presetName.includes('dark');
      
      default:
        return false;
    }
  }

  /**
   * Check if preset matches subject type
   */
  matchesSubject(preset, subject) {
    const presetTags = preset.tags || [];
    const presetName = preset.name.toLowerCase();
    
    switch (subject) {
      case 'Coral Reef':
        return presetTags.includes('coral') || 
               presetTags.includes('reef') ||
               presetName.includes('coral') || 
               presetName.includes('reef');
      
      case 'Macro':
        return presetTags.includes('macro') || 
               presetName.includes('macro') || 
               presetName.includes('close-up');
      
      case 'Wide Angle':
        return presetTags.includes('wide') || 
               presetName.includes('wide') || 
               presetName.includes('landscape');
      
      case 'Cave/Wreck':
        return presetTags.includes('cave') || 
               presetTags.includes('wreck') ||
               presetName.includes('cave') || 
               presetName.includes('wreck');
      
      default:
        return false;
    }
  }

  /**
   * Check if preset matches color cast severity
   */
  matchesColorCast(preset, colorCast) {
    if (!colorCast) return true;
    
    const adjustments = preset.adjustments || {};
    const hasColorCorrection = adjustments.temperature !== 0 || 
                              adjustments.tint !== 0 ||
                              adjustments.warmth !== 0;
    
    switch (colorCast.level) {
      case 'Severe':
        return hasColorCorrection && Math.abs(adjustments.temperature || 0) > 30;
      
      case 'Moderate':
        return hasColorCorrection && Math.abs(adjustments.temperature || 0) > 15;
      
      case 'Mild':
        return hasColorCorrection || Math.abs(adjustments.temperature || 0) <= 15;
      
      default:
        return true;
    }
  }

  /**
   * Calculate optimal strength for applying preset
   */
  calculateOptimalStrength(preset, analysis) {
    let baseStrength = analysis.recommendedPresetStrength || 75;
    
    // Adjust based on confidence
    if (analysis.confidence < 0.7) {
      baseStrength = Math.max(50, baseStrength - 15);
    } else if (analysis.confidence > 0.9) {
      baseStrength = Math.min(100, baseStrength + 10);
    }
    
    // Adjust based on color cast severity
    if (analysis.colorCastSeverity?.level === 'Severe') {
      baseStrength = Math.min(100, baseStrength + 15);
    } else if (analysis.colorCastSeverity?.level === 'Mild') {
      baseStrength = Math.max(40, baseStrength - 20);
    }
    
    // Adjust based on backscatter
    if (analysis.backscatterDensity?.level === 'High') {
      baseStrength = Math.min(100, baseStrength + 10);
    } else if (analysis.backscatterDensity?.level === 'Low') {
      baseStrength = Math.max(30, baseStrength - 15);
    }
    
    return Math.round(baseStrength);
  }

  /**
   * Generate processing summary for single image
   */
  generateProcessingSummary(image, recommendation) {
    if (!recommendation) {
      return {
        image: image.filename,
        hasRecommendation: false,
        message: "No suitable preset found for current image conditions"
      };
    }

    return {
      image: image.filename,
      hasRecommendation: true,
      preset: recommendation.preset.name,
      strength: recommendation.strength,
      confidence: recommendation.confidence,
      reasons: recommendation.reasons,
      optimizedForSingle: true,
      processingTime: "< 1 second",
      memoryUsage: "Minimal"
    };
  }
}

export default SingleImagePresetService;