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

TASK:
Enhance this section by adding comprehensive company intelligence where relevant:

FOR EACH COMPANY MENTIONED, ADD:
- Website URL (if found) - MUST include the full working URL
- Company size (employees, revenue)
- Headquarters location
- Key executives (CEO, CTO, etc.)
- Government contractor status (GSA, CAGE, small business certs)
- Recent contracts or awards
- Funding information (if applicable)
- Recent news or developments

CRITICAL CITATION REQUIREMENTS:
1. ALWAYS include the EXACT, FULL URL when citing sources from the web search results above
2. Use format: [Source: Company Name](https://exact-url-here.com) for company websites
3. Use format: [Source: Article Title](https://exact-news-url.com) for news articles
4. Use format: [Source: DOD Contracts](https://exact-contract-url.com) for contract information
5. Extract URLs from the web search results provided above - look for lines starting with "URL:" and use those EXACT URLs
6. DO NOT use generic or placeholder URLs - only use URLs that were actually found in the search results (marked with "URL:")
7. If a URL is not available in the search results, use format: [Source: Company Name] without a link
8. When you see "URL: https://..." in the web search results, that is the EXACT URL to use in your citation

REQUIREMENTS:
1. Seamlessly integrate the intelligence into the existing content
2. Add specific data points (numbers, URLs, names)
3. Maintain professional market research tone
4. ALWAYS cite sources with exact URLs in [Source: Label](URL) format
5. Focus on information relevant to "${sectionTitle}"
6. Do NOT add generic conclusions or introductions
7. Do NOT repeat the section title
8. Return ONLY the enhanced content (no preamble)
9. Extract and use the exact URLs from the web search results provided

Return the enhanced section content with integrated intelligence and proper URL citations.`;

    const response = await client.chat.completions.create({
      model: modelToUse,
      messages: [
        {
          role: 'system',
          content: 'You are a defense market research analyst who enhances reports with verified public intelligence. You provide specific, actionable data with proper citations.',
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

