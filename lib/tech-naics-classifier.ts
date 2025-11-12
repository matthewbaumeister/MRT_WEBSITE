// ============================================
// Tech NAICS Code Classifier
// ============================================
// Identifies technology-related contracts for DOD scraping

// ============================================
// Tech NAICS Codes - Organized by Category
// ============================================

export const TECH_NAICS_CODES = {
  // Software Development & IT Services
  software_it: [
    '541511', // Custom Computer Programming Services
    '541512', // Computer Systems Design Services
    '541513', // Computer Facilities Management Services
    '541519', // Other Computer Related Services
    '511210', // Software Publishers
  ],
  
  // Data & Cloud Services
  data_cloud: [
    '518210', // Data Processing, Hosting, and Related Services
    '519130', // Internet Publishing and Broadcasting and Web Search Portals
    '541690', // Other Scientific and Technical Consulting Services (includes data science)
  ],
  
  // Cybersecurity & Information Security
  cybersecurity: [
    '541512', // Computer Systems Design (includes security)
    '541519', // Other Computer Related (includes security consulting)
    '561621', // Security Systems Services
  ],
  
  // Engineering & Technical Services
  engineering: [
    '541330', // Engineering Services
    '541380', // Testing Laboratories
    '541620', // Environmental Consulting Services
    '541690', // Other Scientific and Technical Consulting
  ],
  
  // R&D
  research_dev: [
    '541712', // Research and Development in Physical, Engineering, Life Sciences (except Biotech)
    '541715', // Research and Development in Physical, Engineering, Life Sciences
    '541713', // Research and Development in Nanotechnology
    '541714', // Research and Development in Biotechnology
  ],
  
  // Computer & Electronics Manufacturing
  hardware_manufacturing: [
    '334111', // Electronic Computer Manufacturing
    '334112', // Computer Storage Device Manufacturing
    '334118', // Computer Terminal and Other Computer Peripheral Equipment Manufacturing
    '334210', // Telephone Apparatus Manufacturing
    '334220', // Radio and Television Broadcasting and Wireless Communications Equipment Manufacturing
    '334290', // Other Communications Equipment Manufacturing
    '334310', // Audio and Video Equipment Manufacturing
    '334411', // Electron Tube Manufacturing
    '334412', // Bare Printed Circuit Board Manufacturing
    '334413', // Semiconductor and Related Device Manufacturing
    '334414', // Electronic Capacitor Manufacturing
    '334415', // Electronic Resistor Manufacturing
    '334416', // Electronic Coil, Transformer, and Other Inductor Manufacturing
    '334417', // Electronic Connector Manufacturing
    '334418', // Printed Circuit Assembly (Electronic Assembly) Manufacturing
    '334419', // Other Electronic Component Manufacturing
    '334511', // Search, Detection, Navigation, Guidance, Aeronautical Systems
    '334512', // Automatic Environmental Control Manufacturing
    '334513', // Instruments and Related Products Manufacturing for Measuring, Displaying, and Controlling Industrial Process Variables
    '334514', // Totalizing Fluid Meter and Counting Device Manufacturing
    '334515', // Instrument Manufacturing for Measuring and Testing Electricity and Electrical Signals
    '334516', // Analytical Laboratory Instrument Manufacturing
    '334517', // Irradiation Apparatus Manufacturing
    '334519', // Other Measuring and Controlling Device Manufacturing
    '334610', // Manufacturing and Reproducing Magnetic and Optical Media
  ],
  
  // Telecommunications
  telecommunications: [
    '517110', // Wired Telecommunications Carriers
    '517210', // Wireless Telecommunications Carriers
    '517311', // Wired Telecommunications Carriers
    '517312', // Wireless Telecommunications Carriers
    '517410', // Satellite Telecommunications
    '517911', // Telecommunications Resellers
    '517919', // All Other Telecommunications
  ],
  
  // Aerospace & Defense Tech
  aerospace_defense: [
    '336411', // Aircraft Manufacturing
    '336412', // Aircraft Engine and Engine Parts Manufacturing
    '336413', // Other Aircraft Parts and Auxiliary Equipment Manufacturing
    '336414', // Guided Missile and Space Vehicle Manufacturing
    '336415', // Guided Missile and Space Vehicle Propulsion Unit and Propulsion Unit Parts Manufacturing
    '336419', // Other Guided Missile and Space Vehicle Parts and Auxiliary Equipment Manufacturing
  ],
  
  // Scientific Instruments
  scientific_instruments: [
    '334510', // Electromedical and Electrotherapeutic Apparatus Manufacturing
    '334511', // Search, Detection, Navigation, Guidance, Aeronautical Systems
    '334516', // Analytical Laboratory Instrument Manufacturing
    '334519', // Other Measuring and Controlling Device Manufacturing
  ],
  
  // Management & Technical Consulting
  consulting: [
    '541611', // Administrative Management and General Management Consulting Services
    '541612', // Human Resources Consulting Services
    '541613', // Marketing Consulting Services
    '541614', // Process, Physical Distribution, and Logistics Consulting Services
    '541618', // Other Management Consulting Services
    '541690', // Other Scientific and Technical Consulting Services
  ]
};

// ============================================
// Flattened List for Quick Lookup
// ============================================

export const ALL_TECH_NAICS_CODES = Object.values(TECH_NAICS_CODES).flat();

// ============================================
// DOD-Specific PSC Codes (Product/Service Codes)
// ============================================

export const DOD_TECH_PSC_CODES = {
  // IT & Cybersecurity
  it_cyber: [
    'D302', // Cyber Security and Data Backup
    'D307', // IT and Telecom - Cloud Computing Services
    'D308', // IT and Telecom - Data Center Hosting
    'D310', // IT and Telecom - Cyber Security
    'D311', // IT and Telecom - Systems Development
    'D312', // IT and Telecom - Software Engineering
    'D313', // IT and Telecom - Software Maintenance
    'D316', // IT and Telecom - Telecommunications Network Management
    'D317', // IT and Telecom - Automated Information Systems Design, Development, and Integration
    'D318', // IT and Telecom - IT Strategy and Architecture
    'D320', // IT and Telecom - Systems Analysis
    'D321', // IT and Telecom - Facility Operation and Maintenance
    'D399', // IT and Telecom - Other IT and Telecommunications
  ],
  
  // R&D Services
  research: [
    'A111', // R&D - Defense System: Aircraft and Related
    'A112', // R&D - Defense System: Missile and Space Systems
    'A113', // R&D - Defense System: Ships and Marine Equipment
    'A114', // R&D - Defense System: Ground Defense
    'A115', // R&D - Defense System: Defense Electronics and Communications
    'A116', // R&D - Defense System: Weapons
    'A119', // R&D - Defense System: Other Research
    'A121', // R&D - Space/General: Basic Research
    'A122', // R&D - Space/General: Applied Research
    'A123', // R&D - Space/General: Development
    'A124', // R&D - Space/General: Operational Systems Development
  ],
  
  // Engineering & Technical Services
  engineering: [
    'C211', // Architect and Engineering - General
    'C212', // Architect and Engineering - Surveying and Mapping
    'C213', // Architect and Engineering - Construction
    'C214', // Architect and Engineering - Marine Engineering
    'C215', // Architect and Engineering - Transportation
    'C216', // Architect and Engineering - Industrial
    'C219', // Architect and Engineering - Other
    'R408', // Professional Services - Program Management/Support Services
    'R421', // Professional Services - Technical Assistance
    'R423', // Professional Services - Intelligence Services
    'R425', // Professional Services - Engineering and Technical Services
  ],
  
  // AI/ML/Data Science (often classified under IT or R&D)
  ai_data: [
    'D302', // Overlaps with cyber but includes AI security
    'D307', // Cloud services for AI/ML
    'D311', // Systems development for AI
    'A119', // R&D that includes AI/ML
  ]
};

export const ALL_TECH_PSC_CODES = Object.values(DOD_TECH_PSC_CODES).flat();

// ============================================
// Tech Keywords for Description Filtering
// ============================================

export const TECH_KEYWORDS = {
  software: [
    'software', 'application', 'app', 'saas', 'platform',
    'code', 'programming', 'development', 'developer',
    'api', 'web service', 'microservice', 'backend', 'frontend'
  ],
  
  ai_ml: [
    'artificial intelligence', 'machine learning', 'deep learning',
    'neural network', 'computer vision', 'natural language',
    'nlp', 'ai', 'ml', 'ai/ml', 'predictive analytics',
    'data science', 'data analytics', 'big data'
  ],
  
  cloud: [
    'cloud', 'aws', 'azure', 'google cloud', 'gcp',
    'infrastructure as a service', 'iaas', 'paas', 'saas',
    'cloud computing', 'cloud infrastructure', 'cloud migration'
  ],
  
  cyber: [
    'cybersecurity', 'cyber security', 'information security',
    'infosec', 'network security', 'security operations',
    'threat detection', 'penetration test', 'vulnerability',
    'zero trust', 'encryption', 'authentication'
  ],
  
  data: [
    'database', 'data warehouse', 'data lake', 'etl',
    'data pipeline', 'data integration', 'data migration',
    'data processing', 'data storage', 'data management'
  ],
  
  modern_tech: [
    'blockchain', 'cryptocurrency', 'quantum computing',
    'edge computing', 'iot', 'internet of things',
    '5g', 'augmented reality', 'virtual reality', 'ar/vr'
  ],
  
  devops: [
    'devops', 'ci/cd', 'continuous integration', 'continuous deployment',
    'containerization', 'docker', 'kubernetes', 'microservices',
    'automation', 'infrastructure as code'
  ]
};

export const ALL_TECH_KEYWORDS = Object.values(TECH_KEYWORDS).flat();

// ============================================
// Classification Functions
// ============================================

export function isTechNAICS(naicsCode: string | null | undefined): boolean {
  if (!naicsCode) return false;
  
  // Check exact match
  if (ALL_TECH_NAICS_CODES.includes(naicsCode)) {
    return true;
  }
  
  // Check prefix match (e.g., "334" matches all "334xxx" codes)
  return ALL_TECH_NAICS_CODES.some(code => 
    naicsCode.startsWith(code) || code.startsWith(naicsCode.substring(0, 3))
  );
}

export function isTechPSC(pscCode: string | null | undefined): boolean {
  if (!pscCode) return false;
  
  // Check exact match or prefix match
  return ALL_TECH_PSC_CODES.some(code => 
    pscCode === code || pscCode.startsWith(code)
  );
}

export function hasTechKeywords(description: string | null | undefined): boolean {
  if (!description) return false;
  
  const lowerDesc = description.toLowerCase();
  return ALL_TECH_KEYWORDS.some(keyword => 
    lowerDesc.includes(keyword.toLowerCase())
  );
}

export function classifyTechContract(contract: any): {
  isTech: boolean;
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
  categories: string[];
} {
  const reasons: string[] = [];
  const categories: string[] = [];
  let score = 0;
  
  // Check NAICS (highest weight)
  if (isTechNAICS(contract.naics_code)) {
    reasons.push(`Tech NAICS code: ${contract.naics_code}`);
    score += 40;
    
    // Identify specific categories
    Object.entries(TECH_NAICS_CODES).forEach(([category, codes]) => {
      if (codes.some(code => contract.naics_code?.startsWith(code))) {
        categories.push(category);
      }
    });
  }
  
  // Check PSC (medium weight)
  if (isTechPSC(contract.psc_code)) {
    reasons.push(`Tech PSC code: ${contract.psc_code}`);
    score += 30;
  }
  
  // Check description keywords (lower weight but still valuable)
  if (hasTechKeywords(contract.description_of_requirement)) {
    const desc = contract.description_of_requirement?.toLowerCase() || '';
    const foundKeywords: string[] = [];
    
    Object.entries(TECH_KEYWORDS).forEach(([category, keywords]) => {
      if (keywords.some(kw => desc.includes(kw.toLowerCase()))) {
        foundKeywords.push(category);
      }
    });
    
    if (foundKeywords.length > 0) {
      reasons.push(`Tech keywords: ${foundKeywords.join(', ')}`);
      score += 15 * foundKeywords.length; // More keywords = higher confidence
      categories.push(...foundKeywords);
    }
  }
  
  // Check if vendor name suggests tech company
  const vendorName = contract.vendor_name?.toLowerCase() || '';
  const techVendorKeywords = ['tech', 'software', 'systems', 'solutions', 'digital', 'cyber', 'data', 'cloud'];
  if (techVendorKeywords.some(kw => vendorName.includes(kw))) {
    reasons.push('Vendor name suggests tech company');
    score += 10;
  }
  
  // Determine confidence based on score
  let confidence: 'high' | 'medium' | 'low';
  if (score >= 60) {
    confidence = 'high';
  } else if (score >= 30) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }
  
  const isTech = score >= 30; // Threshold for classification
  
  return {
    isTech,
    confidence,
    reasons,
    categories: [...new Set(categories)] // Remove duplicates
  };
}

// ============================================
// DOD Agency Filtering
// ============================================

export const DOD_AGENCIES = {
  main: [
    'Department of Defense',
    'Defense Logistics Agency',
    'Missile Defense Agency',
    'Defense Advanced Research Projects Agency',
    'Defense Information Systems Agency',
    'Defense Intelligence Agency',
    'National Security Agency',
    'Defense Threat Reduction Agency',
    'Defense Contract Management Agency'
  ],
  
  military_branches: [
    'Department of the Army',
    'Department of the Navy',
    'Department of the Air Force',
    'United States Marine Corps',
    'United States Space Force'
  ],
  
  commands: [
    'United States Special Operations Command',
    'United States Cyber Command',
    'United States Strategic Command',
    'United States Transportation Command'
  ]
};

export const ALL_DOD_AGENCIES = [
  ...DOD_AGENCIES.main,
  ...DOD_AGENCIES.military_branches,
  ...DOD_AGENCIES.commands
];

export function isDODContract(contract: any): boolean {
  const agencyName = contract.contracting_agency_name?.toLowerCase() || '';
  const fundingAgencyName = contract.funding_agency_name?.toLowerCase() || '';
  
  return ALL_DOD_AGENCIES.some(agency => 
    agencyName.includes(agency.toLowerCase()) || 
    fundingAgencyName.includes(agency.toLowerCase())
  );
}

// ============================================
// Export Combined Filter
// ============================================

export function isDODTechContract(contract: any): {
  isMatch: boolean;
  isDOD: boolean;
  isTech: boolean;
  techClassification: ReturnType<typeof classifyTechContract>;
} {
  const isDOD = isDODContract(contract);
  const techClassification = classifyTechContract(contract);
  
  return {
    isMatch: isDOD && techClassification.isTech,
    isDOD,
    isTech: techClassification.isTech,
    techClassification
  };
}

