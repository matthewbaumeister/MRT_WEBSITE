// Section-specific prompts for market research reports
// Each section is tailored to generate focused, data-driven content without generic conclusions

export const SECTION_PROMPTS: Record<string, string> = {
  background: `Provide a comprehensive background and market overview. Include:
- Industry definition and scope
- Current market landscape
- Key market segments
- Historical context and evolution
- Major market drivers
- Recent significant developments

Focus on factual analysis with specific data points, companies, and statistics. Cite specific sources from xTech awards, MANTECH projects, DSIP opportunities when available.`,

  funding: `Analyze the funding and investment landscape. Include:
- Total funding amounts and trends
- Major investors and investment firms
- Recent significant funding rounds
- SBIR/STTR award amounts and recipients
- Government contract values
- Venture capital activity

Provide specific dollar amounts, company names, dates, and funding sources. Reference actual SBIR/STTR awards, xTech prizes, and contract values from the databases.`,

  "market-size": `Analyze market size and revenue. Provide:
- Current market size in dollars
- Historical growth rates (past 3-5 years)
- Projected growth rates
- Revenue by segment
- Key revenue-generating companies and their figures
- Market share distribution

Use specific numbers and percentages. Reference actual contract values, award amounts, and company revenues from the databases.`,

  tam: `Calculate and present the Total Addressable Market (TAM). Include:
- TAM calculation methodology
- Top-down market sizing
- Bottom-up market sizing
- Serviceable Addressable Market (SAM)
- Serviceable Obtainable Market (SOM)
- TAM for DOD/Federal sector specifically

Provide clear dollar figures and percentages. Be concise and data-focused. No introductory or concluding paragraphs needed - just the TAM analysis.`,

  competition: `Provide a detailed competitive analysis. Include:
- Top 10-15 competitors by market share
- Recent contract wins (company, value, date)
- Competitive positioning matrix
- Key differentiators
- Strengths and weaknesses of major players
- Recent M&A activity

Name specific companies with their contract values, SBIR/STTR awards, and xTech wins. Include actual data from MANTECH, Army Innovation, and DSIP databases.`,

  technology: `Analyze technology trends and innovation. Cover:
- Emerging technologies in this space
- Technology maturity levels
- Key innovations from xTech and MANTECH
- R&D investment trends
- Technology adoption rates
- Future technology roadmap

Reference specific technologies being developed, actual xTech projects, MANTECH initiatives, and innovation programs. Name companies and their specific tech developments.`,

  "usg-alignment": `Analyze alignment with USG missions. Include:
- Relevant DOD priorities and strategies
- Alignment with Army, Navy, Air Force, Space Force missions
- National security implications
- Recent USG initiatives and programs
- Congressional interest and funding
- Interagency applications

Reference specific DOD priorities, Army Modernization priorities, xTech focus areas, and actual government programs. Include specific budget lines if available.`,

  regulatory: `Analyze the regulatory environment. Cover:
- Relevant federal regulations (FAR, DFARS, ITAR, etc.)
- Compliance requirements
- Recent regulatory changes
- Certification requirements
- Export control considerations
- Cybersecurity requirements (CMMC, etc.)

Be specific about actual regulations, compliance frameworks, and requirements. No generic regulatory overview - focus on what's specifically applicable.`,

  barriers: `Identify barriers to entry and assess risks. Include:
- Capital requirements
- Technical barriers
- Regulatory barriers
- Competitive barriers
- Supply chain risks
- Technology risks
- Market risks
- Mitigation strategies

Be specific and analytical. Quantify barriers where possible (e.g., "$50M+ capital required"). Focus on actionable risk assessment.`,

  conclusion: `Synthesize ALL previous sections into comprehensive conclusions and recommendations. This section should:
- Summarize key findings from ALL 9 previous sections
- Provide strategic recommendations based on the complete analysis
- Identify immediate opportunities
- Suggest market entry strategies
- Recommend next steps for stakeholders
- Highlight critical success factors
- Reference specific data points from earlier sections
- Include specific companies, programs, and opportunities identified

This is the capstone - integrate insights from Background, Funding, Market Size, TAM, Competition, Technology, USG Alignment, Regulatory, and Barriers sections. Make specific, actionable recommendations based on the complete data picture.`
};

// Web search augmentation prompts
export const WEB_SEARCH_PROMPT = (topic: string, section: string) => `
Search the web for current, publicly available information about ${topic} related to ${section}.

Focus on:
- Recent news and announcements (last 6 months)
- Company press releases
- Government websites (.gov, .mil)
- Industry publications
- Financial reports
- Recent contracts and awards

Return specific, verifiable information with sources that can supplement our internal databases.
`;

// Generate section-specific prompt
export function getSectionPrompt(sectionId: string, topic: string, useWebSearch: boolean = false): string {
  const basePrompt = SECTION_PROMPTS[sectionId] || "Provide detailed analysis for this section.";
  
  return `You are generating the ${sectionId.replace(/-/g, ' ')} section of a DOD/USG market research report on: ${topic}

${basePrompt}

IMPORTANT:
- Be extremely specific with data: company names, dollar amounts, dates, program names
- Reference actual programs: cite specific xTech competitions, MANTECH projects, SBIR/STTR awards, DSIP opportunities
- Use bullet points for lists, tables where appropriate
- No generic filler content - only data-driven analysis
${useWebSearch ? '- Include recent public information from web sources' : ''}
- Cite data sources inline (e.g., "According to Army xTech Competition 2024...")
- Format with markdown: **bold** for emphasis, ## for sub-headers
`;
}

// Data source with URL
export interface DataSource {
  name: string;
  url: string;
}

// URL mappings for data sources
const SOURCE_URLS: Record<string, string> = {
  'Army xTech Competition Database': 'https://www.ausa.org/army-xtech',
  'Army Innovation Programs': 'https://armyfuturescommand.com/army-applications-laboratory/',
  'MANTECH Projects Database': 'https://www.dodmantech.com/',
  'MANTECH SBIR Transitions': 'https://www.dodmantech.com/sbir',
  'DSIP': 'https://www.defenseinnovation.mil/',
  'Small Business Innovation Research Program': 'https://www.sbir.gov/',
  'FUZE Innovation Platform': 'https://armyfuturescommand.com/fuze/',
  'Navy SBIR/STTR': 'https://www.navysbir.com/',
  'Air Force Innovation': 'https://www.afwerx.com/',
  'AFWERX Programs': 'https://www.afwerx.com/',
  'Federal Procurement Data System': 'https://www.fpds.gov/',
  'USA Spending Database': 'https://www.usaspending.gov/',
  'DOD Budget Documents': 'https://comptroller.defense.gov/',
  'Defense Innovation Unit': 'https://www.diu.mil/',
  'SBIR.gov': 'https://www.sbir.gov/',
  'SAM.gov': 'https://sam.gov/',
};

// Generate data sources with URLs based on section content
export function generateDataSources(sectionId: string, content: string): DataSource[] {
  const sources: DataSource[] = [];
  
  // Parse content for mentioned programs and create specific source references
  if (content.includes('xTech') || content.includes('Army Innovation')) {
    sources.push({
      name: 'Army xTech Competition Database - Innovation Submissions 2022-2024',
      url: SOURCE_URLS['Army xTech Competition Database']
    });
    sources.push({
      name: 'Army Innovation Programs - Active Opportunities',
      url: SOURCE_URLS['Army Innovation Programs']
    });
  }
  
  if (content.includes('MANTECH') || content.includes('manufacturing')) {
    sources.push({
      name: 'MANTECH Projects Database - Manufacturing Technology Transitions',
      url: SOURCE_URLS['MANTECH Projects Database']
    });
    sources.push({
      name: 'MANTECH SBIR Transitions - Technology Pipeline',
      url: SOURCE_URLS['MANTECH SBIR Transitions']
    });
  }
  
  if (content.includes('SBIR') || content.includes('STTR')) {
    sources.push({
      name: 'DSIP - Defense SBIR/STTR Awards FY2020-2024',
      url: SOURCE_URLS['DSIP']
    });
    sources.push({
      name: 'Small Business Innovation Research Program Database',
      url: SOURCE_URLS['Small Business Innovation Research Program']
    });
  }
  
  if (content.includes('FUZE') || content.includes('innovation')) {
    sources.push({
      name: 'FUZE Innovation Platform - Active Challenges',
      url: SOURCE_URLS['FUZE Innovation Platform']
    });
  }
  
  if (content.includes('Navy') || content.includes('Naval')) {
    sources.push({
      name: 'Navy SBIR/STTR Topics and Awards Database',
      url: SOURCE_URLS['Navy SBIR/STTR']
    });
  }
  
  if (content.includes('Air Force') || content.includes('AFWERX')) {
    sources.push({
      name: 'Air Force Innovation Database - AFWERX Programs',
      url: SOURCE_URLS['AFWERX Programs']
    });
  }
  
  // Add generic sources if not enough specific ones
  if (sources.length < 5) {
    sources.push({
      name: 'Federal Procurement Data System (FPDS) - Contract Awards',
      url: SOURCE_URLS['Federal Procurement Data System']
    });
    sources.push({
      name: 'USA Spending Database - Federal Contracts and Grants',
      url: SOURCE_URLS['USA Spending Database']
    });
    sources.push({
      name: 'DOD Budget Documents - RDT&E Funding Lines',
      url: SOURCE_URLS['DOD Budget Documents']
    });
  }
  
  return sources;
}

