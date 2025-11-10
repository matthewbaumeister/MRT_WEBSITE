import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { 
      messages, 
      model = "gpt-4o-mini",
      extendedThinking = false,
      webSearch = false,
      research = false,
      smallBusinessFocus = false
    } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Add system message with capabilities based on settings
    const systemMessage = {
      role: "system",
      content: `You are MATRIX, an AI assistant for Make Ready Technologies. You are helpful, professional, and knowledgeable. 
${extendedThinking ? "Take your time to think through complex problems step by step." : ""}
${webSearch ? "You have access to current information through web search." : ""}
${research ? "You can conduct in-depth research on topics." : ""}
${smallBusinessFocus ? `
SMALL BUSINESS FOCUS MODE: When answering questions, prioritize information from these small business-focused data sources:

Current Data Sources:
- DSIP (Defense SBIR/STTR Innovation Portal)
- MANTECH (Manufacturing Technology) - Tables: mantech_projects, mantech_by_component, mantech_company_mentions, mantech_top_companies, mantech_sbir_transitions, mantech_transition_pipeline, mantech_recent_projects
- xTech (Army Innovation) - Tables: army_innovation_opportunities, army_innovation_programs, army_innovation_submissions, army_innovation_documents, army_innovation_finalists_with_details, army_innovation_winners_with_details, army_innovation_phase_progress, army_innovation_competition_stats, army_innovation_prize_summary, army_innovation_upcoming_deadlines
- FUZE Innovation Platform

Upcoming Data Sources (not yet available):
- SBA Awards (Government API currently down)
- FPDS (Federal Procurement Data System) Small Business data (not yet imported)

Focus on opportunities, contracts, and programs specifically designed for or awarded to small businesses. When broader data is needed, still include it but lead with small business-specific information.
` : ""}

Current user: ${session.user.name} (${session.user.email})`
    };

    const fullMessages = [systemMessage, ...messages];

    // Call OpenAI API with appropriate parameters
    const completionParams: any = {
      model: model,
      messages: fullMessages,
      temperature: extendedThinking ? 0.8 : 0.7,
      max_tokens: extendedThinking ? 4000 : 2000,
    };

    const completion = await openai.chat.completions.create(completionParams);

    const assistantMessage = completion.choices[0]?.message;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // TODO: Save chat history to Supabase
    // - Save conversation
    // - Save messages
    // - Link to user
    // - Store settings (extendedThinking, webSearch, research, smallBusinessFocus)
    
    // TODO: When smallBusinessFocus is enabled, query these Supabase tables:
    // Current:
    //   - mantech_* tables (all mantech data)
    //   - army_innovation_* tables (xTech/Army Innovation data)
    //   - DSIP data (when available)
    //   - FUZE data (when available)
    // Future (once scraped/imported):
    //   - sba_awards table
    //   - fpds_small_business table
    // Use this data to enhance AI responses with real small business opportunities

    return NextResponse.json({
      message: assistantMessage,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

