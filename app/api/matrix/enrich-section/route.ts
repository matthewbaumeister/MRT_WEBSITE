import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

/**
 * POST /api/matrix/enrich-section
 * Enrich a SINGLE section with public data using GPT-4o
 * Called per-section for more thorough and visible enrichment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sectionId, sectionTitle, sectionContent, topic, companiesInSection, maxMode } = body;

    if (!sectionId || !sectionTitle || !sectionContent || !topic) {
      return NextResponse.json(
        { error: "Section details and topic are required" },
        { status: 400 }
      );
    }
    
    // MAX MODE: Already using GPT-4o by default, but could increase tokens/depth
    const modelToUse = 'gpt-4o'; // Always use GPT-4o for enrichment
    const maxTokens = maxMode ? 3000 : 2000; // More tokens in MAX MODE

    // Get API keys
    const openAIApiKey = process.env.OPENAI_API_KEY;
    const serperApiKey = process.env.SERPER_API_KEY;

    if (!openAIApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    console.log(`[ENRICH SECTION] ${sectionTitle}`);

    // Step 1: Extract companies from this section with improved patterns
    const companyPatterns = [
      // Full company names with suffixes
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Inc|LLC|Corp|Corporation|Systems|Technologies|Solutions|Group|Industries|Federal|International|Global|Aerospace|Defense|Technologies|Services|Consulting|Associates)))/g,
      // Common defense contractors
      /(Lockheed Martin|Raytheon|Northrop Grumman|General Dynamics|Boeing|L3Harris|Leidos|Booz Allen|CACI|ManTech|ECS Federal|SAIC|Huntington Ingalls)/gi,
      // Company names in quotes or after "such as"
      /(?:such as|including|like|e\.g\.|for example)[\s:]+([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Corporation|Systems|Technologies|Solutions|Group|Industries|Federal)?)/gi,
    ];
    
    const companies = new Set<string>();
    const excludeWords = new Set(['The', 'This', 'That', 'These', 'Those', 'What', 'When', 'Where', 'Phase', 'Table', 'Figure', 'Section', 'DOD', 'USG', 'US', 'USA', 'Army', 'Navy', 'Air Force', 'Space Force', 'Marines']);
    
    companyPatterns.forEach(pattern => {
      const matches = sectionContent.match(pattern) || [];
      matches.forEach(match => {
        const cleaned = match.trim().replace(/^["']|["']$/g, ''); // Remove quotes
        if (cleaned.length > 3 && 
            !excludeWords.has(cleaned) && 
            !cleaned.match(/^(The|This|That|These|Those|What|When|Where|Phase|Table|Figure|Section)\b/i) &&
            cleaned.split(' ').length <= 5) { // Max 5 words for company name
          companies.add(cleaned);
        }
      });
    });

    // Also extract from companiesInSection if provided
    if (companiesInSection && Array.isArray(companiesInSection)) {
      companiesInSection.forEach((company: string) => {
        if (company && typeof company === 'string' && company.trim().length > 0) {
          companies.add(company.trim());
        }
      });
    }

    const companyList = Array.from(companies).slice(0, 8); // Increased to 8 companies
    console.log(`[ENRICH SECTION] Found ${companyList.length} companies:`, companyList);

    // Step 2: Search for company info with VERIFIED sources only (if Serper is configured)
    let webContext = "";
    const verifiedUrls = new Set<string>(); // Track verified URLs to prevent duplicates
    
    if (serperApiKey && companyList.length > 0) {
      console.log(`[ENRICH SECTION] Searching web for VERIFIED company intelligence...`);
      
      for (const company of companyList) {
        try {
          // More targeted searches for verified information
          const queries = [
            `${company} official website`,
            `${company} CEO president leadership team`,
            `${company} headquarters location address`,
            `${company} employees headcount workforce size`,
            `${company} revenue financial information`,
            `${company} defense contracts DOD awards`,
            `${company} government contractor GSA CAGE code`,
            `${company} recent news 2024 2025`,
          ];

          for (const query of queries) {
            const response = await fetch('https://google.serper.dev/search', {
              method: 'POST',
              headers: {
                'X-API-KEY': serperApiKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ q: query, num: 3 }), // Get 3 results per query
            });

            const data = await response.json();
            if (data.organic && data.organic.length > 0) {
              // Only include results with valid, non-placeholder URLs
              const validResults = data.organic.filter((result: any) => {
                if (!result.link) return false;
                // Validate URL - reject placeholders
                try {
                  const url = new URL(result.link);
                  // Reject placeholder domains
                  const invalidDomains = ['exact-url.com', 'example.com', 'placeholder.com', 'test.com', 'localhost'];
                  if (invalidDomains.some(domain => url.hostname.includes(domain))) {
                    return false;
                  }
                  // Must be http or https
                  if (!['http:', 'https:'].includes(url.protocol)) {
                    return false;
                  }
                  // Must have valid hostname
                  if (!url.hostname || url.hostname.length < 3) {
                    return false;
                  }
                  // Track verified URLs
                  verifiedUrls.add(result.link);
                  return true;
                } catch {
                  return false; // Invalid URL format
                }
              });

              if (validResults.length > 0) {
                webContext += `\n=== ${company} - ${query} ===\n`;
                validResults.slice(0, 3).forEach((result: any) => {
                  webContext += `TITLE: ${result.title}\n`;
                  webContext += `VERIFIED URL: ${result.link}\n`;
                  webContext += `CONTENT: ${result.snippet || ''}\n`;
                  if (result.date) webContext += `DATE: ${result.date}\n`;
                  webContext += `\n`;
                });
              }
            }
          }
        } catch (err) {
          console.error(`[ENRICH SECTION] Error searching ${company}:`, err);
        }
      }
      
      console.log(`[ENRICH SECTION] Collected ${verifiedUrls.size} verified URLs`);
    } else {
      console.log(`[ENRICH SECTION] Serper API not configured, skipping web search`);
    }

    // Step 3: Ask GPT-4o to enrich this section
    console.log(`[ENRICH SECTION] Calling GPT-4o for intelligence synthesis...`);
    
    const openai = await import('openai');
    const client = new openai.default({ apiKey: openAIApiKey });

    const prompt = `You are a defense industry research analyst enriching a market research report section with public intelligence.

RESEARCH TOPIC: ${topic}

SECTION: ${sectionTitle}

CURRENT SECTION CONTENT:
${sectionContent}

${webContext ? `ADDITIONAL PUBLIC INTELLIGENCE:\n${webContext}` : ''}

CRITICAL WRITING STYLE REQUIREMENTS:
- Write in ACADEMIC RESEARCH STYLE (PhD-level quality)
- Use PARAGRAPH FORM primarily - write flowing, analytical paragraphs
- AVOID excessive bullet points - only use bullets for true lists (e.g., "Key market segments include: X, Y, Z")
- Use TABLES only when presenting structured data (e.g., financial comparisons, competitive matrices)
- Write in third person, objective, analytical tone
- Use transitional phrases to connect ideas between paragraphs
- Each paragraph should develop a complete thought with evidence and analysis
- Integrate data points naturally into sentences rather than listing them
- Convert any bullet-heavy sections into flowing paragraph form

FORMATTING REQUIREMENTS:
- Use ## for major section headers (not ###)
- Use ### only for subsections within a major section (sparingly)
- Use **bold** for emphasis on key terms, company names, or important figures
- Ensure proper markdown formatting - no broken headers or formatting errors

TASK:
Enhance this section by adding comprehensive company intelligence where relevant, integrated into flowing paragraphs:

FOR EACH COMPANY MENTIONED, ADD (integrated into paragraphs):
- Website URL (if found) - MUST include the full working URL
- Company size (employees, revenue)
- Headquarters location
- Key executives (CEO, CTO, etc.) - VERIFY EXACT NAMES from official sources only
- Government contractor status (GSA, CAGE, small business certs)
- Recent contracts or awards
- Funding information (if applicable)
- Recent news or developments

CRITICAL: For ECS Federal specifically, the CEO is John Hengan (NOT George Wilson). Verify all executive information from official company websites or verified news sources.

CRITICAL CITATION REQUIREMENTS - ZERO TOLERANCE FOR PLACEHOLDERS:
1. EVERY SINGLE FACT-BASED STATEMENT MUST HAVE A VERIFIED SOURCE CITATION - no exceptions
2. YOU MUST ONLY USE URLs FROM THE "VERIFIED URL:" LINES IN THE WEB SEARCH RESULTS ABOVE
3. DO NOT create, invent, or guess any URLs - ONLY use URLs explicitly marked as "VERIFIED URL:" in the search results
4. Use format: [Source: Company Name](VERIFIED_URL_FROM_SEARCH_RESULTS) for company websites
5. Use format: [Source: Article Title](VERIFIED_URL_FROM_SEARCH_RESULTS) for news articles
6. Use format: [Source: DOD Contracts](VERIFIED_URL_FROM_SEARCH_RESULTS) for contract information
7. Extract URLs ONLY from lines starting with "VERIFIED URL:" in the web search results above
8. ABSOLUTELY FORBIDDEN: Using placeholder URLs like "https://exact-url.com/", "https://example.com", "https://companyname.com" (without www), or any URL not explicitly listed as "VERIFIED URL:"
9. ABSOLUTELY FORBIDDEN: Making up URLs, guessing URLs, or using generic URLs
10. If a fact cannot be verified with a VERIFIED URL from the search results, you MUST either:
    a) Omit the fact entirely, OR
    b) Use format: [Source: Unverified - needs confirmation] and clearly state the information is unverified
11. Every URL you cite MUST appear in the "VERIFIED URL:" lines above - cross-reference before using
12. URLs must be complete, functional, and match EXACTLY what appears after "VERIFIED URL:" in the search results
13. For company information (CEO, employees, revenue), ONLY use information from official company websites (look for "official website" in search results) or verified news sources
14. VERIFY ALL INFORMATION - if you cannot verify a fact with a VERIFIED URL from the search results, DO NOT include it
15. DO NOT make up or guess information - only use verified facts from the VERIFIED URLs provided above
16. If the search results do not contain a VERIFIED URL for a piece of information, that information should NOT be included in your response

REQUIREMENTS:
1. Seamlessly integrate the intelligence into the existing content in paragraph form
2. Add specific data points (numbers, URLs, names) integrated naturally into sentences - BUT ONLY if verified with VERIFIED URLs
3. Maintain professional, academic market research tone
4. ALWAYS cite sources with VERIFIED URLs in [Source: Label](VERIFIED_URL) format - ONLY use URLs from "VERIFIED URL:" lines
5. Focus on information relevant to "${sectionTitle}"
6. Do NOT add generic conclusions or introductions
7. Do NOT repeat the section title
8. Return ONLY the enhanced content (no preamble)
9. Extract and use ONLY the URLs from "VERIFIED URL:" lines in the web search results - NO OTHER URLs
10. Convert any bullet lists into flowing paragraph form where possible
11. If you cannot find a VERIFIED URL for information, DO NOT include that information
12. Quality over quantity - only include verified, cited information

VALIDATION CHECKLIST BEFORE INCLUDING ANY INFORMATION:
- [ ] Is there a VERIFIED URL for this fact in the search results above?
- [ ] Does the URL appear in a "VERIFIED URL:" line?
- [ ] Is the URL complete and functional (not a placeholder)?
- [ ] Can I cite this fact with [Source: Label](VERIFIED_URL) format?

If any answer is NO, DO NOT include that information.

Return the enhanced section content with integrated intelligence in academic paragraph form with proper VERIFIED URL citations.`;

    const response = await client.chat.completions.create({
      model: modelToUse,
      messages: [
        {
          role: 'system',
          content: 'You are a defense market research analyst who enhances reports with verified public intelligence. You write in PhD-level academic style with flowing paragraphs, minimal bullets, and proper citations with VERIFIED URLs ONLY. You provide specific, actionable data integrated naturally into analytical prose. You MUST verify all facts before including them and ensure every statement has a VERIFIED source citation from the search results. You are FORBIDDEN from using placeholder URLs, making up URLs, or including any information without a VERIFIED URL citation. If information cannot be verified with a VERIFIED URL from the search results, you must omit it entirely.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: maxMode ? 0.2 : 0.3, // More precise in MAX MODE
      max_tokens: maxTokens,
    });

    let enhancedContent = response.choices[0].message.content || sectionContent;

    // Post-process to remove any placeholder URLs that might have slipped through
    const { validateCitationUrl } = await import('@/lib/url-validation');
    
    // Remove invalid URLs from citations
    enhancedContent = enhancedContent.replace(
      /\[Source:\s*([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/gi,
      (match, label, url) => {
        const validUrl = validateCitationUrl(url);
        if (!validUrl) {
          // Invalid URL - remove the link, keep just the citation
          console.warn(`[ENRICH SECTION] Removed invalid URL: ${url}`);
          return `[Source: ${label}]`;
        }
        return match; // Keep valid URLs
      }
    );

    // Remove standalone invalid URLs
    enhancedContent = enhancedContent.replace(
      /(https?:\/\/[^\s<>"\)\[\]]+)/gi,
      (match, url) => {
        const validUrl = validateCitationUrl(url);
        if (!validUrl && !match.includes('href=') && !match.includes('data-url=')) {
          // Invalid standalone URL - remove it
          console.warn(`[ENRICH SECTION] Removed invalid standalone URL: ${url}`);
          return '';
        }
        return match;
      }
    );

    console.log(`[ENRICH SECTION] ✅ Enhanced ${sectionTitle} (+${enhancedContent.length - sectionContent.length} chars)`);
    console.log(`[ENRICH SECTION] Verified ${verifiedUrls.size} URLs from web search`);

    return NextResponse.json({
      success: true,
      sectionId,
      enhancedContent,
      companiesFound: companyList.length,
      webSearchPerformed: !!serperApiKey,
      verifiedUrlsCount: verifiedUrls.size,
    });
  } catch (error: any) {
    console.error("[ENRICH SECTION] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

