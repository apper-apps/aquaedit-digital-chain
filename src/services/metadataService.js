/**
 * Comprehensive Metadata Management Service
 * Handles dive logs, equipment tracking, marine life identification, and scientific data
 */

class MetadataService {
  constructor() {
    this.metadataSchema = {
      // Dive-specific metadata
      dive: {
        siteLocation: { type: 'string', required: false },
        siteName: { type: 'string', required: false },
        gpsCoordinates: { type: 'object', required: false },
        depth: { type: 'number', unit: 'meters', required: false },
        waterTemperature: { type: 'number', unit: 'celsius', required: false },
        visibility: { type: 'number', unit: 'meters', required: false },
        diveNumber: { type: 'number', required: false },
        diveDate: { type: 'string', format: 'iso8601', required: false },
        diveDuration: { type: 'number', unit: 'minutes', required: false },
        maxDepth: { type: 'number', unit: 'meters', required: false },
        avgDepth: { type: 'number', unit: 'meters', required: false },
        buddy: { type: 'string', required: false },
        diveMaster: { type: 'string', required: false },
        certification: { type: 'string', required: false },
        diveType: { type: 'enum', values: ['recreational', 'technical', 'commercial', 'scientific'], required: false }
      },

      // Equipment tracking
      equipment: {
        camera: {
          make: { type: 'string', required: false },
          model: { type: 'string', required: false },
          serialNumber: { type: 'string', required: false }
        },
        lens: {
          make: { type: 'string', required: false },
          model: { type: 'string', required: false },
          focalLength: { type: 'string', required: false },
          maxAperture: { type: 'string', required: false }
        },
        housing: {
          make: { type: 'string', required: false },
          model: { type: 'string', required: false },
          portType: { type: 'enum', values: ['dome', 'flat', 'macro'], required: false }
        },
        strobes: {
          primary: { make: { type: 'string' }, model: { type: 'string' }, power: { type: 'string' } },
          secondary: { make: { type: 'string' }, model: { type: 'string' }, power: { type: 'string' } }
        },
        filters: {
          redFilter: { type: 'boolean', required: false },
          magentaFilter: { type: 'boolean', required: false },
          customFilter: { type: 'string', required: false }
        }
      },

      // Marine life identification
      marineLife: {
        primarySubject: { type: 'string', required: false },
        scientificName: { type: 'string', required: false },
        commonName: { type: 'string', required: false },
        conservationStatus: { 
          type: 'enum', 
          values: ['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX', 'DD'], 
          required: false 
        },
        behaviorObserved: { type: 'string', required: false },
        estimatedSize: { type: 'string', required: false },
        quantity: { type: 'number', required: false },
        habitat: { type: 'string', required: false },
        associatedSpecies: { type: 'array', items: { type: 'string' }, required: false }
      },

      // Scientific/Research data
      research: {
        studyId: { type: 'string', required: false },
        researchInstitution: { type: 'string', required: false },
        principalInvestigator: { type: 'string', required: false },
        specimenId: { type: 'string', required: false },
        measurements: { type: 'object', required: false },
        environmentalData: { type: 'object', required: false },
        samplingMethod: { type: 'string', required: false }
      },

      // Copyright and attribution
      rights: {
        photographer: { type: 'string', required: false },
        copyright: { type: 'string', required: false },
        license: { type: 'string', required: false },
        usage: { type: 'string', required: false },
        restrictions: { type: 'string', required: false }
      },

      // Custom project fields
      custom: {
        projectName: { type: 'string', required: false },
        clientName: { type: 'string', required: false },
        purpose: { type: 'string', required: false },
        keywords: { type: 'array', items: { type: 'string' }, required: false }
      }
    };

    this.marineLifeDatabase = {
      // Common underwater subjects with scientific names
      fish: {
        'Clownfish': { scientific: 'Amphiprioninae', conservation: 'LC' },
        'Angelfish': { scientific: 'Pomacanthidae', conservation: 'LC' },
        'Butterflyfish': { scientific: 'Chaetodontidae', conservation: 'LC' },
        'Grouper': { scientific: 'Epinephelinae', conservation: 'VU' },
        'Shark': { scientific: 'Selachimorpha', conservation: 'VU' },
        'Ray': { scientific: 'Batoidea', conservation: 'VU' },
        'Tuna': { scientific: 'Thunnini', conservation: 'EN' },
        'Barracuda': { scientific: 'Sphyraenidae', conservation: 'LC' }
      },
      coral: {
        'Hard Coral': { scientific: 'Scleractinia', conservation: 'VU' },
        'Soft Coral': { scientific: 'Alcyonacea', conservation: 'VU' },
        'Brain Coral': { scientific: 'Faviidae', conservation: 'VU' },
        'Staghorn Coral': { scientific: 'Acropora cervicornis', conservation: 'CR' },
        'Elkhorn Coral': { scientific: 'Acropora palmata', conservation: 'CR' }
      },
      invertebrates: {
        'Sea Turtle': { scientific: 'Testudines', conservation: 'EN' },
        'Octopus': { scientific: 'Octopoda', conservation: 'LC' },
        'Sea Star': { scientific: 'Asteroidea', conservation: 'LC' },
        'Sea Urchin': { scientific: 'Echinoidea', conservation: 'LC' },
        'Lobster': { scientific: 'Nephropidae', conservation: 'LC' }
      }
    };

    this.privacySettings = {
      gps: {
        stripLocation: false,
        approximateLocation: true,
        precision: 1000 // meters
      },
      personalInfo: {
        anonymizeBuddy: false,
        removePersonalNames: false
      }
    };
  }

  /**
   * Extract comprehensive metadata from image file
   */
  async extractMetadata(file) {
    const basicExif = await this.extractExifData(file);
    const xmpData = await this.extractXMPData(file);
    
    return {
      basic: basicExif,
      dive: this.parseDiveMetadata(xmpData),
      equipment: this.parseEquipmentMetadata(basicExif, xmpData),
      marineLife: this.parseMarineLifeMetadata(xmpData),
      research: this.parseResearchMetadata(xmpData),
      rights: this.parseRightsMetadata(xmpData),
      custom: this.parseCustomMetadata(xmpData)
    };
  }

  /**
   * Parse dive-specific metadata from XMP
   */
  parseDiveMetadata(xmpData) {
    const diveMetadata = {};
    
    // Extract dive log information
    const diveFields = [
      'dive:SiteLocation', 'dive:SiteName', 'dive:Depth', 'dive:WaterTemperature',
      'dive:Visibility', 'dive:DiveNumber', 'dive:DiveDate', 'dive:DiveDuration',
      'dive:MaxDepth', 'dive:AvgDepth', 'dive:Buddy', 'dive:DiveMaster',
      'dive:Certification', 'dive:DiveType'
    ];

    diveFields.forEach(field => {
      const key = field.split(':')[1].toLowerCase();
      const value = this.extractXMPValue(xmpData, field);
      if (value) {
        diveMetadata[key] = value;
      }
    });

    // Parse GPS coordinates with privacy considerations
    const lat = this.extractXMPValue(xmpData, 'exif:GPSLatitude');
    const lon = this.extractXMPValue(xmpData, 'exif:GPSLongitude');
    if (lat && lon) {
      diveMetadata.gpsCoordinates = this.processGPSData({ lat, lon });
    }

    return diveMetadata;
  }

  /**
   * Parse equipment metadata from EXIF and XMP
   */
  parseEquipmentMetadata(exifData, xmpData) {
    return {
      camera: {
        make: exifData.make || this.extractXMPValue(xmpData, 'tiff:Make'),
        model: exifData.model || this.extractXMPValue(xmpData, 'tiff:Model'),
        serialNumber: this.extractXMPValue(xmpData, 'aux:SerialNumber')
      },
      lens: {
        make: this.extractXMPValue(xmpData, 'aux:LensMake'),
        model: exifData.lensModel || this.extractXMPValue(xmpData, 'aux:Lens'),
        focalLength: exifData.focalLength || this.extractXMPValue(xmpData, 'exif:FocalLength'),
        maxAperture: this.extractXMPValue(xmpData, 'aux:MaxApertureValue')
      },
      housing: {
        make: this.extractXMPValue(xmpData, 'equipment:HousingMake'),
        model: this.extractXMPValue(xmpData, 'equipment:HousingModel'),
        portType: this.extractXMPValue(xmpData, 'equipment:PortType')
      },
      strobes: {
        primary: {
          make: this.extractXMPValue(xmpData, 'equipment:StrobePrimaryMake'),
          model: this.extractXMPValue(xmpData, 'equipment:StrobePrimaryModel'),
          power: this.extractXMPValue(xmpData, 'equipment:StrobePrimaryPower')
        },
        secondary: {
          make: this.extractXMPValue(xmpData, 'equipment:StrobeSecondaryMake'),
          model: this.extractXMPValue(xmpData, 'equipment:StrobeSecondaryModel'),
          power: this.extractXMPValue(xmpData, 'equipment:StrobeSecondaryPower')
        }
      },
      filters: {
        redFilter: this.extractXMPValue(xmpData, 'equipment:RedFilter') === 'true',
        magentaFilter: this.extractXMPValue(xmpData, 'equipment:MagentaFilter') === 'true',
        customFilter: this.extractXMPValue(xmpData, 'equipment:CustomFilter')
      }
    };
  }

  /**
   * Parse marine life identification metadata
   */
  parseMarineLifeMetadata(xmpData) {
    const marineLife = {
      primarySubject: this.extractXMPValue(xmpData, 'marine:PrimarySubject'),
      scientificName: this.extractXMPValue(xmpData, 'marine:ScientificName'),
      commonName: this.extractXMPValue(xmpData, 'marine:CommonName'),
      conservationStatus: this.extractXMPValue(xmpData, 'marine:ConservationStatus'),
      behaviorObserved: this.extractXMPValue(xmpData, 'marine:BehaviorObserved'),
      estimatedSize: this.extractXMPValue(xmpData, 'marine:EstimatedSize'),
      quantity: parseInt(this.extractXMPValue(xmpData, 'marine:Quantity')) || 1,
      habitat: this.extractXMPValue(xmpData, 'marine:Habitat')
    };

    // Parse associated species array
    const associatedSpeciesStr = this.extractXMPValue(xmpData, 'marine:AssociatedSpecies');
    if (associatedSpeciesStr) {
      marineLife.associatedSpecies = associatedSpeciesStr.split(',').map(s => s.trim());
    }

    // Auto-populate scientific name and conservation status if available
    if (marineLife.commonName && !marineLife.scientificName) {
      const speciesData = this.findSpeciesData(marineLife.commonName);
      if (speciesData) {
        marineLife.scientificName = speciesData.scientific;
        marineLife.conservationStatus = marineLife.conservationStatus || speciesData.conservation;
      }
    }

    return marineLife;
  }

  /**
   * Parse research/scientific metadata
   */
  parseResearchMetadata(xmpData) {
    return {
      studyId: this.extractXMPValue(xmpData, 'research:StudyId'),
      researchInstitution: this.extractXMPValue(xmpData, 'research:Institution'),
      principalInvestigator: this.extractXMPValue(xmpData, 'research:PrincipalInvestigator'),
      specimenId: this.extractXMPValue(xmpData, 'research:SpecimenId'),
      measurements: this.parseJSONField(this.extractXMPValue(xmpData, 'research:Measurements')),
      environmentalData: this.parseJSONField(this.extractXMPValue(xmpData, 'research:EnvironmentalData')),
      samplingMethod: this.extractXMPValue(xmpData, 'research:SamplingMethod')
    };
  }

  /**
   * Parse rights and copyright metadata
   */
  parseRightsMetadata(xmpData) {
    return {
      photographer: this.extractXMPValue(xmpData, 'dc:creator') || this.extractXMPValue(xmpData, 'tiff:Artist'),
      copyright: this.extractXMPValue(xmpData, 'dc:rights') || this.extractXMPValue(xmpData, 'tiff:Copyright'),
      license: this.extractXMPValue(xmpData, 'xmpRights:UsageTerms'),
      usage: this.extractXMPValue(xmpData, 'plus:LicensorURL'),
      restrictions: this.extractXMPValue(xmpData, 'xmpRights:WebStatement')
    };
  }

  /**
   * Parse custom project-specific metadata
   */
  parseCustomMetadata(xmpData) {
    const custom = {
      projectName: this.extractXMPValue(xmpData, 'custom:ProjectName'),
      clientName: this.extractXMPValue(xmpData, 'custom:ClientName'),
      purpose: this.extractXMPValue(xmpData, 'custom:Purpose')
    };

    // Parse keywords array
    const keywordsStr = this.extractXMPValue(xmpData, 'dc:subject');
    if (keywordsStr) {
      custom.keywords = keywordsStr.split(',').map(k => k.trim());
    }

    return custom;
  }

  /**
   * Embed comprehensive metadata into image file
   */
  async embedMetadata(file, metadata) {
    const xmpData = this.buildXMPData(metadata);
    return this.writeXMPToFile(file, xmpData);
  }

  /**
   * Build XMP data structure from metadata object
   */
  buildXMPData(metadata) {
    const xmp = [];

    // Build dive metadata
    if (metadata.dive) {
      Object.entries(metadata.dive).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          xmp.push(`dive:${this.capitalizeFirst(key)}="${value}"`);
        }
      });
    }

    // Build equipment metadata
    if (metadata.equipment) {
      this.flattenObject(metadata.equipment, 'equipment').forEach(([key, value]) => {
        if (value) xmp.push(`equipment:${key}="${value}"`);
      });
    }

    // Build marine life metadata
    if (metadata.marineLife) {
      Object.entries(metadata.marineLife).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            xmp.push(`marine:${this.capitalizeFirst(key)}="${value.join(', ')}"`);
          } else {
            xmp.push(`marine:${this.capitalizeFirst(key)}="${value}"`);
          }
        }
      });
    }

    // Build research metadata
    if (metadata.research) {
      Object.entries(metadata.research).forEach(([key, value]) => {
        if (value) {
          if (typeof value === 'object') {
            xmp.push(`research:${this.capitalizeFirst(key)}="${JSON.stringify(value)}"`);
          } else {
            xmp.push(`research:${this.capitalizeFirst(key)}="${value}"`);
          }
        }
      });
    }

    // Build rights metadata
    if (metadata.rights) {
      if (metadata.rights.photographer) xmp.push(`dc:creator="${metadata.rights.photographer}"`);
      if (metadata.rights.copyright) xmp.push(`dc:rights="${metadata.rights.copyright}"`);
      if (metadata.rights.license) xmp.push(`xmpRights:UsageTerms="${metadata.rights.license}"`);
    }

    // Build custom metadata
    if (metadata.custom) {
      Object.entries(metadata.custom).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            xmp.push(`dc:subject="${value.join(', ')}"`);
          } else {
            xmp.push(`custom:${this.capitalizeFirst(key)}="${value}"`);
          }
        }
      });
    }

    return xmp.join('\n');
  }

  /**
   * Process GPS data according to privacy settings
   */
  processGPSData({ lat, lon }) {
    if (this.privacySettings.gps.stripLocation) {
      return null;
    }

    if (this.privacySettings.gps.approximateLocation) {
      const precision = this.privacySettings.gps.precision / 111320; // Convert meters to degrees
      return {
        lat: Math.round(lat / precision) * precision,
        lon: Math.round(lon / precision) * precision,
        approximated: true
      };
    }

    return { lat, lon, approximated: false };
  }

  /**
   * Find species data in marine life database
   */
  findSpeciesData(commonName) {
    const normalizedName = commonName.toLowerCase();
    
    for (const category of Object.values(this.marineLifeDatabase)) {
      for (const [name, data] of Object.entries(category)) {
        if (name.toLowerCase().includes(normalizedName) || 
            normalizedName.includes(name.toLowerCase())) {
          return data;
        }
      }
    }
    
    return null;
  }

  /**
   * Validate metadata against schema
   */
  validateMetadata(metadata) {
    const errors = [];
    const warnings = [];

    const validateSection = (section, schema, path = '') => {
      for (const [field, rules] of Object.entries(schema)) {
        const value = section[field];
        const fieldPath = path ? `${path}.${field}` : field;

        if (rules.required && (value === null || value === undefined || value === '')) {
          errors.push(`Required field missing: ${fieldPath}`);
          continue;
        }

        if (value !== null && value !== undefined && value !== '') {
          if (rules.type === 'number' && isNaN(Number(value))) {
            errors.push(`Invalid number format: ${fieldPath}`);
          } else if (rules.type === 'enum' && !rules.values.includes(value)) {
            errors.push(`Invalid enum value: ${fieldPath}. Must be one of: ${rules.values.join(', ')}`);
          } else if (rules.format === 'iso8601' && !this.isValidISODate(value)) {
            errors.push(`Invalid ISO 8601 date format: ${fieldPath}`);
          }
        }
      }
    };

    // Validate each section
    Object.entries(this.metadataSchema).forEach(([sectionName, schema]) => {
      const section = metadata[sectionName];
      if (section && typeof section === 'object') {
        validateSection(section, schema, sectionName);
      }
    });

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Update privacy settings
   */
  updatePrivacySettings(settings) {
    this.privacySettings = { ...this.privacySettings, ...settings };
  }

  /**
   * Get metadata template for project type
   */
  getMetadataTemplate(projectType = 'general') {
    const templates = {
      general: {
        dive: { siteLocation: '', depth: null, waterTemperature: null },
        marineLife: { primarySubject: '', commonName: '' },
        rights: { photographer: '', copyright: '' }
      },
      scientific: {
        dive: { siteLocation: '', depth: null, waterTemperature: null, visibility: null },
        marineLife: { 
          primarySubject: '', 
          scientificName: '', 
          conservationStatus: '',
          behaviorObserved: '',
          quantity: 1
        },
        research: {
          studyId: '',
          researchInstitution: '',
          principalInvestigator: '',
          specimenId: ''
        },
        rights: { photographer: '', copyright: '', license: 'CC BY-SA 4.0' }
      },
      commercial: {
        dive: { siteLocation: '', depth: null },
        marineLife: { primarySubject: '', commonName: '' },
        rights: { 
          photographer: '', 
          copyright: '', 
          license: 'All Rights Reserved',
          usage: 'Commercial use permitted',
          restrictions: 'Contact for licensing'
        },
        custom: { clientName: '', projectName: '', purpose: '' }
      }
    };

    return templates[projectType] || templates.general;
  }

  // Helper methods
  extractXMPValue(xmpData, field, defaultValue = null) {
    if (!xmpData) return defaultValue;
    const pattern = new RegExp(`${field.replace(':', ':')}="([^"]*)"`, 'i');
    const match = xmpData.match(pattern);
    return match ? match[1] : defaultValue;
  }

  parseJSONField(str) {
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  flattenObject(obj, prefix = '') {
    const flattened = [];
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        flattened.push(...this.flattenObject(value, `${prefix}${this.capitalizeFirst(key)}`));
      } else if (value !== null && value !== undefined && value !== '') {
        flattened.push([`${prefix}${this.capitalizeFirst(key)}`, value]);
      }
    }
    return flattened;
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  isValidISODate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && dateString.includes('T');
  }

  // Placeholder methods for actual file operations
  async extractExifData(file) {
    // This would use a library like piexifjs or exif-js in a real implementation
    return {
      make: 'Canon',
      model: 'EOS R5',
      focalLength: '24mm',
      lensModel: 'RF 15-35mm f/2.8 L IS USM'
    };
  }

  async extractXMPData(file) {
    // This would extract actual XMP data from the file
    return '';
  }

  async writeXMPToFile(file, xmpData) {
    // This would write XMP data back to the file
    return file;
  }
}

export default new MetadataService();