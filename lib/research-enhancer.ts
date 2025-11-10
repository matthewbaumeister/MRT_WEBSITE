/**
 * Final Research Enhancement Layer
 * 
 * After generating the initial report from internal databases,
 * this module uses OpenAI + web search to:
 * - Verify data with public sources
 * - Find company websites, LinkedIn profiles
 * - Identify executives and key personnel
 * - Add recent news and updates
 * - Enrich report with real-time public information
 */

import { searchDoDWeb, searchRecentNews, formatWebSearchContext } from './web-search';

interface CompanyInfo {
  name: string;
  context: string; // Where it was mentioned in report
}

interface PersonInfo {
  name: string;
  title?: string;
  company?: string;
  context: string;
}

interface EnhancedData {
  companies: Array<{
    name: string;
    website?: string;
    linkedin?: string;
    executives?: string[];
    recentNews?: string[];
    additionalInfo?: string;
  }>;
  keyPeople: Array<{
    name: string;
    title?: string;
    company?: string;
    linkedin?: string;
    additionalInfo?: string;
  }>;
  verificationNotes: string[];
  enhancedSections: Record<string, string>; // section_id -> enhanced content
}

/**
 * Extract company names from report sections
 */
function extractCompanies(sections: Array<{ id: string; content: string }>): CompanyInfo[] {
  const companies: CompanyInfo[] = [];
  const companyPatterns = [
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Inc|LLC|Corp|Corporation|Systems|Technologies|Solutions|Group|Industries)))/g,
    /([A-Z][A-Z]+(?:\s+[A-Z]+)*)/g, // Acronyms like "LOCKHEED MARTIN"
  ];

  sections.forEach(section => {
    companyPatterns.forEach(pattern => {
      const matches = section.content.match(pattern);
      if (matches) {
        matches.forEach(name => {
          // Filter out common false positives
          if (name.length > 3 && !name.match(/^(The|This|That|These|Those|What|When|Where|Phase|Table|Figure)\b/)) {
            companies.push({
              name: name.trim(),
              context: section.id,
            });
          }
        });
      }
    });
  });

  // Deduplicate
  const uniqueCompanies = Array.from(new Set(companies.map(c => c.name)))
    .map(name => companies.find(c => c.name === name)!);

  return uniqueCompanies.slice(0, 20); // Limit to top 20 companies
}

/**
 * Extract people names and titles from report sections
 */
function extractPeople(sections: Array<{ id: string; content: string }>): PersonInfo[] {
  const people: PersonInfo[] = [];
  
  // Pattern for "Name, Title" or "Title Name"
  const peoplePatterns = [
    /([A-Z][a-z]+\s+[A-Z][a-z]+),\s*(CEO|CTO|CFO|President|Director|Manager|VP|Vice President|Founder|Co-Founder)/gi,
    /(CEO|CTO|CFO|President|Director|VP)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/gi,
  ];

  sections.forEach(section => {
    peoplePatterns.forEach(pattern => {
      const matches = section.content.matchAll(pattern);
      for (const match of matches) {
        people.push({
          name: match[2] || match[1],
          title: match[1] || match[2],
          context: section.id,
        });
      }
    });
  });

  // Deduplicate
  const uniquePeople = Array.from(new Set(people.map(p => p.name)))
    .map(name => people.find(p => p.name === name)!);

  return uniquePeople.slice(0, 15); // Limit to top 15 people
}

/**
 * Search for company information online
 */
async function searchCompanyInfo(company: string): Promise<any> {
  try {
    // Search for company website, LinkedIn, news
    const queries = [
      `${company} official website`,
      `${company} LinkedIn company page`,
      `${company} CEO founder executives`,
      `${company} defense contractor government`,
      `${company} recent news 2024`,
    ];

    const results: any = {
      name: company,
      sources: [],
    };

    // Use Serper API for web search
    const SERPER_API_KEY = process.env.SERPER_API_KEY;
    if (!SERPER_API_KEY) {
      return results;
    }

    for (const query of queries) {
      try {
        const response = await fetch('https://google.serper.dev/search', {
          method: 'POST',
          headers: {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ q: query, num: 3 }),
        });

        const data = await response.json();
        if (data.organic) {
          results.sources.push(...data.organic.slice(0, 2));
        }
      } catch (err) {
        console.error(`Error searching for ${company}:`, err);
      }
    }

    return results;
  } catch (error) {
    console.error(`Error in searchCompanyInfo for ${company}:`, error);
    return { name: company, sources: [] };
  }
}

/**
 * Search for person information online
 */
async function searchPersonInfo(person: PersonInfo): Promise<any> {
  try {
    const SERPER_API_KEY = process.env.SERPER_API_KEY;
    if (!SERPER_API_KEY) {
      return { name: person.name, sources: [] };
    }

    const query = `${person.name} ${person.title || ''} ${person.company || ''} LinkedIn`;
    
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query, num: 3 }),
    });

    const data = await response.json();
    return {
      name: person.name,
      title: person.title,
      company: person.company,
      sources: data.organic ? data.organic.slice(0, 2) : [],
    };
  } catch (error) {
    console.error(`Error in searchPersonInfo for ${person.name}:`, error);
    return { name: person.name, sources: [] };
  }
}

/**
 * Main enhancement function
 * Called after all report sections are generated
 */
export async function enhanceReportWithPublicData(
  sections: Array<{ id: string; title: string; content: string }>,
  researchTopic: string,
  openAIApiKey: string
): Promise<EnhancedData> {
  console.log('🔍 Starting final research enhancement...');

  const enhancedData: EnhancedData = {
    companies: [],
    keyPeople: [],
    verificationNotes: [],
    enhancedSections: {},
  };

  try {
    // Step 1: Extract entities from report
    const companies = extractCompanies(sections);
    const people = extractPeople(sections);

    console.log(`Found ${companies.length} companies and ${people.length} people to research`);

    // Step 2: Search for company information
    const companySearches = companies.slice(0, 10).map(c => searchCompanyInfo(c.name));
    const companyResults = await Promise.all(companySearches);

    // Step 3: Search for people information
    const peopleSearches = people.slice(0, 5).map(p => searchPersonInfo(p));
    const peopleResults = await Promise.all(peopleSearches);

    // Step 4: Format results for OpenAI
    let enhancementContext = "=== ADDITIONAL PUBLIC INFORMATION ===\n\n";
    
    enhancementContext += "COMPANIES MENTIONED:\n";
    companyResults.forEach(result => {
      if (result.sources && result.sources.length > 0) {
        enhancementContext += `\n${result.name}:\n`;
        result.sources.forEach((source: any) => {
          enhancementContext += `- ${source.title}\n  ${source.link}\n  ${source.snippet || ''}\n`;
        });
      }
    });

    enhancementContext += "\n\nKEY PEOPLE MENTIONED:\n";
    peopleResults.forEach(result => {
      if (result.sources && result.sources.length > 0) {
        enhancementContext += `\n${result.name} (${result.title || 'Unknown'}):\n`;
        result.sources.forEach((source: any) => {
          enhancementContext += `- ${source.title}\n  ${source.link}\n  ${source.snippet || ''}\n`;
        });
      }
    });

    enhancementContext += "\n=== END ADDITIONAL INFORMATION ===\n";

    // Step 5: Send to OpenAI for enhancement
    console.log('🤖 Asking OpenAI to enhance report with public data...');
    
    const openai = await import('openai');
    const client = new openai.default({ apiKey: openAIApiKey });

    const enhancementPrompt = `You are a research analyst reviewing a market research report. You have been provided with additional public information about companies and people mentioned in the report.

TASK:
1. Review the additional public information below
2. For each report section, identify where this new information should be added
3. Add specific details like:
   - Company websites and LinkedIn pages
   - Executive names and titles
   - Recent company news or developments
   - Contact information if available
4. Verify facts mentioned in the report against public sources
5. Note any discrepancies or additional context

ORIGINAL RESEARCH TOPIC: ${researchTopic}

CURRENT REPORT SECTIONS:
${sections.map(s => `\n### ${s.title}\n${s.content.substring(0, 500)}...`).join('\n')}

${enhancementContext}

Please provide:
1. A list of key enhancements to make (company websites, LinkedIn, executives found)
2. Specific additions for each relevant section
3. Any verification notes or corrections

Format as JSON:
{
  "companies": [{"name": "...", "website": "...", "linkedin": "...", "executives": [...], "additionalInfo": "..."}],
  "keyPeople": [{"name": "...", "title": "...", "company": "...", "linkedin": "...", "additionalInfo": "..."}],
  "verificationNotes": ["..."],
  "sectionEnhancements": {
    "section_id": "Additional content to add..."
  }
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a research analyst who enhances reports with verified public information.',
        },
        {
          role: 'user',
          content: enhancementPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const enhancementResult = JSON.parse(response.choices[0].message.content || '{}');

    enhancedData.companies = enhancementResult.companies || [];
    enhancedData.keyPeople = enhancementResult.keyPeople || [];
    enhancedData.verificationNotes = enhancementResult.verificationNotes || [];
    enhancedData.enhancedSections = enhancementResult.sectionEnhancements || {};

    // Extract actual URLs from search results and add to companies/people data
    companyResults.forEach((result, idx) => {
      if (enhancedData.companies[idx] && result.sources && result.sources.length > 0) {
        // Find website URL
        const websiteSource = result.sources.find((s: any) => 
          s.link && !s.link.includes('linkedin.com')
        );
        if (websiteSource) {
          enhancedData.companies[idx].website = websiteSource.link;
        }
        
        // Find LinkedIn URL
        const linkedinSource = result.sources.find((s: any) => 
          s.link && s.link.includes('linkedin.com/company')
        );
        if (linkedinSource) {
          enhancedData.companies[idx].linkedin = linkedinSource.link;
        }
      }
    });

    peopleResults.forEach((result, idx) => {
      if (enhancedData.keyPeople[idx] && result.sources && result.sources.length > 0) {
        // Find LinkedIn URL for person
        const linkedinSource = result.sources.find((s: any) => 
          s.link && s.link.includes('linkedin.com/in')
        );
        if (linkedinSource) {
          enhancedData.keyPeople[idx].linkedin = linkedinSource.link;
        }
      }
    });

    console.log('✅ Enhancement complete!');
    console.log(`- Enhanced ${Object.keys(enhancedData.enhancedSections).length} sections`);
    console.log(`- Found info on ${enhancedData.companies.length} companies`);
    console.log(`- Found info on ${enhancedData.keyPeople.length} people`);
    console.log(`- Extracted ${enhancedData.companies.filter(c => c.website).length} company websites`);
    console.log(`- Extracted ${enhancedData.companies.filter(c => c.linkedin).length} company LinkedIn pages`);

    return enhancedData;
  } catch (error) {
    console.error('Error in enhanceReportWithPublicData:', error);
    return enhancedData;
  }
}

/**
 * Apply enhancements to report sections
 */
export function applyEnhancements(
  sections: Array<{ id: string; title: string; content: string; sources: any[] }>,
  enhancements: EnhancedData
): Array<{ id: string; title: string; content: string; sources: any[] }> {
  const enhancedSections = sections.map(section => {
    const sectionEnhancement = enhancements.enhancedSections[section.id];
    
    if (sectionEnhancement) {
      return {
        ...section,
        content: section.content + '\n\n' + sectionEnhancement,
      };
    }
    
    return section;
  });

  return enhancedSections;
}

