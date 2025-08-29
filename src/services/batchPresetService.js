import { getPresets } from '@/services/api/projectService';

/**
 * Smart Batch Preset Service
 * Matches images with optimal presets based on underwater conditions
 */
export class BatchPresetService {
  constructor() {
    this.presetCache = null;
    this.ruleEngine = new PresetRuleEngine();
  }

  /**
   * Get preset recommendations for a batch of analyzed images
   */
  async getRecommendations(analyzedImages) {
    const presets = await this.getAvailablePresets();
    const recommendations = {};
    
    for (const image of analyzedImages) {
      const matchedPreset = this.matchPresetToImage(image, presets);
      if (matchedPreset) {
        recommendations[image.Id] = {
          preset: matchedPreset.preset,
          strength: matchedPreset.strength,
          confidence: matchedPreset.confidence,
          reasons: matchedPreset.reasons
        };
      }
    }
    
    return recommendations;
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
      reasons.push(`Handles ${analysis.colorCastSeverity.level.toLowerCase()} color cast`);
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
   * Create custom batch rules
   */
  createBatchRule(conditions, presetId, strength = 75) {
    return {
      id: `rule_${Date.now()}`,
      name: `Custom Rule ${Date.now()}`,
      conditions,
      presetId,
      strength,
      createdAt: new Date().toISOString(),
      active: true
    };
  }

  /**
   * Apply batch rules to images
   */
  async applyBatchRules(images, rules) {
    const results = {};
    const presets = await this.getAvailablePresets();
    
    for (const image of images) {
      for (const rule of rules) {
        if (!rule.active) continue;
        
        if (this.ruleEngine.evaluate(rule.conditions, image.analysis)) {
          const preset = presets.find(p => p.Id === rule.presetId);
          if (preset) {
            results[image.Id] = {
              preset,
              strength: rule.strength,
              appliedRule: rule.name,
              confidence: 0.9 // High confidence for rule-based matching
            };
            break; // First matching rule wins
          }
        }
      }
    }
    
    return results;
  }

  /**
   * Generate batch processing summary
   */
  generateBatchSummary(images, recommendations) {
    const summary = {
      totalImages: images.length,
      processedImages: Object.keys(recommendations).length,
      unprocessedImages: images.length - Object.keys(recommendations).length,
      presetDistribution: {},
      averageStrength: 0,
      averageConfidence: 0
    };
    
    let totalStrength = 0;
    let totalConfidence = 0;
    
    Object.values(recommendations).forEach(rec => {
      const presetName = rec.preset.name;
      summary.presetDistribution[presetName] = (summary.presetDistribution[presetName] || 0) + 1;
      totalStrength += rec.strength;
      totalConfidence += rec.confidence;
    });
    
    const processedCount = Object.keys(recommendations).length;
    summary.averageStrength = processedCount > 0 ? Math.round(totalStrength / processedCount) : 0;
    summary.averageConfidence = processedCount > 0 ? totalConfidence / processedCount : 0;
    
    return summary;
  }
}

/**
 * Rule Engine for custom batch processing rules
 */
class PresetRuleEngine {
  /**
   * Evaluate if image analysis matches rule conditions
   */
  evaluate(conditions, analysis) {
    if (!conditions || !analysis) return false;
    
    return Object.entries(conditions).every(([key, expectedValue]) => {
      switch (key) {
        case 'waterClarity':
          return analysis.waterClarity === expectedValue;
        
        case 'estimatedDepth':
          return analysis.estimatedDepth === expectedValue;
        
        case 'lightingCondition':
          return analysis.lightingCondition === expectedValue;
        
        case 'subjectType':
          return analysis.subjectType === expectedValue;
        
        case 'colorCastLevel':
          return analysis.colorCastSeverity?.level === expectedValue;
        
        case 'backscatterLevel':
          return analysis.backscatterDensity?.level === expectedValue;
        
        case 'minConfidence':
          return analysis.confidence >= expectedValue;
        
        default:
          return true;
      }
    });
  }

  /**
   * Get available rule conditions
   */
  getAvailableConditions() {
    return {
      waterClarity: ['Crystal Clear', 'Slightly Murky', 'Very Murky', 'Sandy/Silty'],
      estimatedDepth: ['Surface (0-10ft)', 'Shallow (10-30ft)', 'Deep (30ft+)'],
      lightingCondition: ['Natural Sunlight', 'Artificial Strobe', 'Mixed Lighting', 'Low Light'],
      subjectType: ['Coral Reef', 'Open Water', 'Cave/Wreck', 'Macro', 'Wide Angle'],
      colorCastLevel: ['Mild', 'Moderate', 'Severe'],
      backscatterLevel: ['Low', 'Medium', 'High'],
      minConfidence: [0.5, 0.6, 0.7, 0.8, 0.9]
    };
  }
}

export default BatchPresetService;