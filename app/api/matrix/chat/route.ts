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
      research = false 
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
    // - Store settings (extendedThinking, webSearch, research)

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

