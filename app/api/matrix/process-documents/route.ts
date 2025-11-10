import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import OpenAI from "openai";

/**
 * POST /api/matrix/process-documents
 * Process uploaded documents with LLM to extract key information and generate custom prompts
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Initialize OpenAI
    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: openAIApiKey });

    // Process each file
    const processedDocuments: Array<{
      filename: string;
      summary: string;
      keyInformation: {
        keywords: string[];
        entities: string[];
        topics: string[];
        technicalTerms: string[];
      };
      researchPrompt: string;
    }> = [];

    for (const file of files) {
      try {
        // Read file content
        const content = await file.text();
        
        // Limit content size (OpenAI token limits)
        const truncatedContent = content.substring(0, 50000);

        // Use GPT-4 Mini to analyze the document
        const analysis = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an expert document analyst specializing in defense and government contracting. 
Analyze uploaded documents and extract:
1. A concise summary (2-3 sentences)
2. Key keywords and technical terms
3. Important entities (companies, people, organizations)
4. Main topics and themes
5. A tailored research prompt for market research based on the document

Be specific and actionable. Focus on defense/military/government contracting context.`,
            },
            {
              role: "user",
              content: `Analyze this document and provide a structured response in JSON format:

Filename: ${file.name}
Content: ${truncatedContent}

Return JSON with this structure:
{
  "summary": "2-3 sentence summary",
  "keywords": ["keyword1", "keyword2", ...],
  "entities": ["company/person/org names"],
  "topics": ["main topics"],
  "technicalTerms": ["technical terms specific to this domain"],
  "researchPrompt": "A detailed research prompt that incorporates the key information from this document"
}`,
            },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        });

        const analysisResult = JSON.parse(analysis.choices[0].message.content || "{}");

        processedDocuments.push({
          filename: file.name,
          summary: analysisResult.summary || "Summary not available",
          keyInformation: {
            keywords: analysisResult.keywords || [],
            entities: analysisResult.entities || [],
            topics: analysisResult.topics || [],
            technicalTerms: analysisResult.technicalTerms || [],
          },
          researchPrompt: analysisResult.researchPrompt || truncatedContent.substring(0, 500),
        });
      } catch (fileError: any) {
        console.error(`Error processing file ${file.name}:`, fileError);
        processedDocuments.push({
          filename: file.name,
          summary: "Error processing document",
          keyInformation: {
            keywords: [],
            entities: [],
            topics: [],
            technicalTerms: [],
          },
          researchPrompt: await file.text().then(t => t.substring(0, 500)),
        });
      }
    }

    // Combine all document insights into a master research prompt
    const combinedPrompt = processedDocuments.map((doc, idx) => {
      return `Document ${idx + 1}: ${doc.filename}
Summary: ${doc.summary}
Key Topics: ${doc.keyInformation.topics.join(", ")}
Entities: ${doc.keyInformation.entities.join(", ")}
Keywords: ${doc.keyInformation.keywords.join(", ")}

Research Focus: ${doc.researchPrompt}`;
    }).join("\n\n---\n\n");

    return NextResponse.json({
      success: true,
      documents: processedDocuments,
      combinedPrompt,
      totalFiles: files.length,
    });
  } catch (error: any) {
    console.error("Document processing error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

