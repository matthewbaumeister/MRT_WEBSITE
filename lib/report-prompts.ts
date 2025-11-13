// Section-specific prompts for market research reports
// Each section is tailored to generate focused, data-driven content without generic conclusions

export const SECTION_PROMPTS: Record<string, string> = {
  background: `Provide a comprehensive background and market overview in academic paragraph form. Cover:
- Industry definition and scope (analytical paragraph)
- Current market landscape (synthesize data into flowing paragraphs)
- Key market segments (integrate into narrative, use bullets only if truly necessary for a list)
- Historical context and evolution (chronological narrative)
- Major market drivers (analytical paragraphs with supporting evidence)
- Recent significant developments (paragraph-based analysis)

Write in PhD-level academic style with flowing paragraphs. Focus on factual analysis with specific data points, companies, and statistics. Cite specific sources from xTech awards, MANTECH projects, DSIP opportunities when available.`,

  funding: `Analyze the funding and investment landscape in academic paragraph form. Synthesize:
- Total funding amounts and trends (analytical paragraphs with data integration)
- Major investors and investment firms (narrative paragraphs)
- Recent significant funding rounds (paragraph-based analysis)
- SBIR/STTR award amounts and recipients (integrate into narrative)
- Government contract values (analytical paragraphs)
- Venture capital activity (synthesize into flowing text)

Write in PhD-level academic style. Provide specific dollar amounts, company names, dates, and funding sources integrated naturally into paragraphs. Reference actual SBIR/STTR awards, xTech prizes, and contract values from the databases.`,

  "market-size": `Analyze market size and revenue in academic paragraph form. Synthesize:
- Current market size in dollars (analytical paragraphs with data integration)
- Historical growth rates (past 3-5 years) (narrative paragraphs with trends)
- Projected growth rates (analytical paragraphs)
- Revenue by segment (integrate into narrative, use table only if comparing multiple segments)
- Key revenue-generating companies and their figures (paragraph-based analysis)
- Market share distribution (synthesize into flowing text)

Write in PhD-level academic style. Use specific numbers and percentages integrated naturally into paragraphs. Reference actual contract values, award amounts, and company revenues from the databases.`,

  tam: `Calculate and present the Total Addressable Market (TAM) in academic paragraph form. Synthesize:
- TAM calculation methodology (analytical paragraphs explaining approach)
- Top-down market sizing (paragraph-based analysis with calculations)
- Bottom-up market sizing (analytical paragraphs)
- Serviceable Addressable Market (SAM) (integrate into narrative)
- Serviceable Obtainable Market (SOM) (paragraph form)
- TAM for DOD/Federal sector specifically (analytical paragraphs)

Write in PhD-level academic style. Provide clear dollar figures and percentages integrated naturally into paragraphs. Be concise and data-focused.`,

  competition: `Provide a detailed competitive analysis in academic paragraph form. Synthesize:
- Top 10-15 competitors by market share (analytical paragraphs, use table only if comparing multiple dimensions)
- Recent contract wins (integrate company, value, date into narrative paragraphs)
- Competitive positioning (analytical paragraphs with evidence)
- Key differentiators (paragraph-based analysis)
- Strengths and weaknesses of major players (synthesize into flowing text)
- Recent M&A activity (narrative paragraphs)

Write in PhD-level academic style. Name specific companies with their contract values, SBIR/STTR awards, and xTech wins integrated naturally into paragraphs. Include actual data from MANTECH, Army Innovation, and DSIP databases.`,

  technology: `Analyze technology trends and innovation in academic paragraph form. Synthesize:
- Emerging technologies in this space (analytical paragraphs)
- Technology maturity levels (paragraph-based analysis)
- Key innovations from xTech and MANTECH (integrate into narrative)
- R&D investment trends (analytical paragraphs with data)
- Technology adoption rates (synthesize into flowing text)
- Future technology roadmap (narrative paragraphs)

Write in PhD-level academic style. Reference specific technologies being developed, actual xTech projects, MANTECH initiatives, and innovation programs integrated naturally into paragraphs. Name companies and their specific tech developments.`,

  "usg-alignment": `Analyze alignment with USG missions in academic paragraph form. Synthesize:
- Relevant DOD priorities and strategies (analytical paragraphs)
- Alignment with Army, Navy, Air Force, Space Force missions (paragraph-based analysis)
- National security implications (integrate into narrative)
- Recent USG initiatives and programs (analytical paragraphs)
- Congressional interest and funding (synthesize into flowing text)
- Interagency applications (narrative paragraphs)

Write in PhD-level academic style. Reference specific DOD priorities, Army Modernization priorities, xTech focus areas, and actual government programs integrated naturally into paragraphs. Include specific budget lines if available.`,

  regulatory: `Analyze the regulatory environment in academic paragraph form. Synthesize:
- Relevant federal regulations (FAR, DFARS, ITAR, etc.) (analytical paragraphs)
- Compliance requirements (paragraph-based analysis)
- Recent regulatory changes (integrate into narrative)
- Certification requirements (analytical paragraphs)
- Export control considerations (synthesize into flowing text)
- Cybersecurity requirements (CMMC, etc.) (narrative paragraphs)

Write in PhD-level academic style. Be specific about actual regulations, compliance frameworks, and requirements integrated naturally into paragraphs. No generic regulatory overview - focus on what's specifically applicable.`,

  barriers: `Identify barriers to entry and assess risks in academic paragraph form. Synthesize:
- Capital requirements (analytical paragraphs with quantification)
- Technical barriers (paragraph-based analysis)
- Regulatory barriers (integrate into narrative)
- Competitive barriers (analytical paragraphs)
- Supply chain risks (synthesize into flowing text)
- Technology risks (narrative paragraphs)
- Market risks (paragraph-based analysis)
- Mitigation strategies (analytical paragraphs)

Write in PhD-level academic style. Be specific and analytical. Quantify barriers where possible (e.g., "$50M+ capital required") integrated naturally into paragraphs. Focus on actionable risk assessment.`,

  conclusion: `Synthesize ALL previous sections into comprehensive conclusions and recommendations in academic paragraph form. This section should:
- Summarize key findings from ALL 9 previous sections (synthesize into flowing analytical paragraphs)
- Provide strategic recommendations based on the complete analysis (paragraph-based recommendations)
- Identify immediate opportunities (integrate into narrative)
- Suggest market entry strategies (analytical paragraphs)
- Recommend next steps for stakeholders (paragraph form)
- Highlight critical success factors (synthesize into text)
- Reference specific data points from earlier sections (integrate naturally)
- Include specific companies, programs, and opportunities identified (narrative paragraphs)

Write in PhD-level academic style. This is the capstone - integrate insights from Background, Funding, Market Size, TAM, Competition, Technology, USG Alignment, Regulatory, and Barriers sections into flowing, analytical paragraphs. Make specific, actionable recommendations based on the complete data picture.`
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

CRITICAL WRITING STYLE REQUIREMENTS:
- Write in ACADEMIC RESEARCH STYLE (PhD-level quality)
- Use PARAGRAPH FORM primarily - write flowing, analytical paragraphs
- AVOID excessive bullet points - only use bullets for:
  * True lists (e.g., "Key market segments include: X, Y, Z")
  * When data is best presented as a list
- Use TABLES only when presenting structured data (e.g., financial comparisons, competitive matrices)
- Write in third person, objective, analytical tone
- Use transitional phrases to connect ideas between paragraphs
- Each paragraph should develop a complete thought with evidence and analysis
- Integrate data points naturally into sentences rather than listing them

FORMATTING REQUIREMENTS:
- Use ## for major section headers (not ###)
- Use ### only for subsections within a major section (sparingly)
- Use **bold** for emphasis on key terms, company names, or important figures
- Ensure proper markdown formatting - no broken headers or formatting errors

CONTENT REQUIREMENTS:
- Be extremely specific with data: company names, dollar amounts, dates, program names
- Reference actual programs: cite specific xTech competitions, MANTECH projects, SBIR/STTR awards, DSIP opportunities
- No generic filler content - only data-driven analysis
${useWebSearch ? '- Include recent public information from web sources' : ''}
- Cite data sources inline with exact URLs: [Source: Company Name](https://exact-url.com)
- EVERY SINGLE FACT-BASED STATEMENT MUST HAVE A SOURCE CITATION - no exceptions
- DO NOT use placeholder URLs like "https://exact-url.com/" or "https://example.com" - these are invalid
- If you cannot verify a fact with a source, do not include it or clearly mark it as unverified
- For company information (CEO, employees, revenue), use official company websites or verified news sources only
- DO NOT make up or guess information - only use verified facts from provided sources
- Write comprehensive, analytical paragraphs that synthesize information rather than listing facts
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

