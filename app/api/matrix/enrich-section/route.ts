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

    // Step 1: Extract companies from this section
    const companyPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Inc|LLC|Corp|Corporation|Systems|Technologies|Solutions|Group|Industries)))/g;
    const acronymPattern = /\b([A-Z]{2,}(?:\s+[A-Z]+)*)\b/g;
    
    const companies = new Set<string>();
    const matches1 = sectionContent.match(companyPattern) || [];
    const matches2 = sectionContent.match(acronymPattern) || [];
    
    [...matches1, ...matches2].forEach(name => {
      if (name.length > 3 && !name.match(/^(The|This|That|These|Those|What|When|Where|Phase|Table|Figure|Section)\b/i)) {
        companies.add(name.trim());
      }
    });

    const companyList = Array.from(companies).slice(0, 5); // Max 5 companies per section
    console.log(`[ENRICH SECTION] Found ${companyList.length} companies:`, companyList);

    // Step 2: Search for company info (if Serper is configured)
    let webContext = "";
    
    if (serperApiKey && companyList.length > 0) {
      console.log(`[ENRICH SECTION] Searching web for company intelligence...`);
      
      for (const company of companyList) {
        try {
          // Focused searches for this section's topic
          const queries = [
            `${company} ${topic}`,
            `${company} official website contact`,
            `${company} employees headcount size`,
            `${company} CEO executives leadership`,
            `${company} defense contractor government`,
            `${company} recent news 2024`,
          ];

          for (const query of queries) {
            const response = await fetch('https://google.serper.dev/search', {
              method: 'POST',
              headers: {
                'X-API-KEY': serperApiKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ q: query, num: 2 }),
            });

            const data = await response.json();
            if (data.organic && data.organic.length > 0) {
              webContext += `\n${company} - ${query}:\n`;
              data.organic.slice(0, 2).forEach((result: any) => {
                webContext += `- ${result.title}\n  URL: ${result.link}\n  ${result.snippet || ''}\n`;
              });
            }
          }
        } catch (err) {
          console.error(`[ENRICH SECTION] Error searching ${company}:`, err);
        }
      }
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

CRITICAL CITATION REQUIREMENTS:
1. EVERY SINGLE FACT-BASED STATEMENT MUST HAVE A SOURCE CITATION - no exceptions
2. ALWAYS include the EXACT, FULL URL when citing sources from the web search results above
3. Use format: [Source: Company Name](https://exact-url-here.com) for company websites
4. Use format: [Source: Article Title](https://exact-news-url.com) for news articles
5. Use format: [Source: DOD Contracts](https://exact-contract-url.com) for contract information
6. Extract URLs from the web search results provided above - look for lines starting with "URL:" and use those EXACT URLs
7. DO NOT use generic or placeholder URLs like "https://exact-url.com/" or "https://example.com" - these are invalid
8. DO NOT use generic labels like "DOD Contracts" without an actual URL - if no URL is available, use format: [Source: Company Name] without a link
9. When you see "URL: https://..." in the web search results, that is the EXACT URL to use in your citation
10. Every fact-based statement should have a working URL citation when possible
11. URLs must be complete and functional - test that they would work if clicked
12. If citing a company website, use the exact homepage URL (e.g., https://www.companyname.com, not just "Company Name")
13. If citing a news article, use the exact article URL from the search results
14. If citing a contract, use the exact contract detail page URL from DOD/FPDS sources
15. VERIFY ALL INFORMATION - if you cannot verify a fact with a source, do not include it or clearly mark it as unverified
16. For company information (CEO, employees, revenue), use official company websites or verified news sources only
17. DO NOT make up or guess information - only use verified facts from provided sources

REQUIREMENTS:
1. Seamlessly integrate the intelligence into the existing content in paragraph form
2. Add specific data points (numbers, URLs, names) integrated naturally into sentences
3. Maintain professional, academic market research tone
4. ALWAYS cite sources with exact URLs in [Source: Label](URL) format
5. Focus on information relevant to "${sectionTitle}"
6. Do NOT add generic conclusions or introductions
7. Do NOT repeat the section title
8. Return ONLY the enhanced content (no preamble)
9. Extract and use the exact URLs from the web search results provided
10. Convert any bullet lists into flowing paragraph form where possible

Return the enhanced section content with integrated intelligence in academic paragraph form with proper URL citations.`;

    const response = await client.chat.completions.create({
      model: modelToUse,
      messages: [
        {
          role: 'system',
          content: 'You are a defense market research analyst who enhances reports with verified public intelligence. You write in PhD-level academic style with flowing paragraphs, minimal bullets, and proper citations with exact URLs. You provide specific, actionable data integrated naturally into analytical prose. You MUST verify all facts before including them and ensure every statement has a source citation. You must NOT use placeholder URLs or make up information.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: maxMode ? 0.2 : 0.3, // More precise in MAX MODE
      max_tokens: maxTokens,
    });

    const enhancedContent = response.choices[0].message.content || sectionContent;

    console.log(`[ENRICH SECTION] ✅ Enhanced ${sectionTitle} (+${enhancedContent.length - sectionContent.length} chars)`);

    return NextResponse.json({
      success: true,
      sectionId,
      enhancedContent,
      companiesFound: companyList.length,
      webSearchPerformed: !!serperApiKey,
    });
  } catch (error: any) {
    console.error("[ENRICH SECTION] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

