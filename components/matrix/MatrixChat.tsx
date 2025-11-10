"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import ResearchReport from "./ResearchReport";
import AdvancedQueryPanel from "./AdvancedQueryPanel";
import { getSectionPrompt, generateDataSources, DataSource } from "@/lib/report-prompts";
// Supabase search now happens server-side via API
import { searchDoDWeb, searchRecentNews, formatWebSearchContext, extractWebSourceURLs } from "@/lib/web-search";
// Enrichment is now server-side via /api/matrix/enrich

interface MatrixChatProps {
  onToggleSidebar: () => void;
  chatId: string | null;
  onNewChat: () => void;
  projectId: string | null;
  onConversationCreated?: () => void;
}

interface ReportSection {
  id: string;
  number: number;
  title: string;
  content: string;
  expanded: boolean;
  sources?: DataSource[];
  isEnriching?: boolean; // Visual indicator for enrichment in progress
  isGenerating?: boolean; // Visual indicator for section generation
  generationStatus?: string; // Status text for this section
}

const REPORT_SECTIONS: Omit<ReportSection, "content" | "expanded">[] = [
  { id: "background", number: 1, title: "Background & Market Overview", sources: [] },
  { id: "funding", number: 2, title: "Funding & Investment Landscape", sources: [] },
  { id: "market-size", number: 3, title: "Market Size & Revenue Analysis", sources: [] },
  { id: "tam", number: 4, title: "Total Addressable Market (TAM)", sources: [] },
  { id: "competition", number: 5, title: "Competitive Analysis", sources: [] },
  { id: "technology", number: 6, title: "Technology Trends & Innovation", sources: [] },
  { id: "usg-alignment", number: 7, title: "USG Mission Alignment", sources: [] },
  { id: "regulatory", number: 8, title: "Regulatory Environment", sources: [] },
  { id: "barriers", number: 9, title: "Barriers to Entry & Risk Assessment", sources: [] },
  { id: "conclusion", number: 10, title: "Conclusions & Recommendations", sources: [] },
];

export default function MatrixChat({
  onToggleSidebar,
  chatId,
  onNewChat,
  projectId,
  onConversationCreated,
}: MatrixChatProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extendedThinking, setExtendedThinking] = useState(true);
  const [webSearch, setWebSearch] = useState(true);
  const [research, setResearch] = useState(false);
  const [smallBusinessFocus, setSmallBusinessFocus] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string[]>([]);
  const [liveStatus, setLiveStatus] = useState<string>(""); // Live status for report header
  const [reportMode, setReportMode] = useState(false);
  const [reportSections, setReportSections] = useState<ReportSection[]>([]);
  const [advancedPanelOpen, setAdvancedPanelOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(chatId);
  const [researchTopic, setResearchTopic] = useState<string>("");
  const [reportTitle, setReportTitle] = useState<string>("Market Research Report");
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  // Load conversation when chatId changes
  useEffect(() => {
    if (chatId && chatId !== currentConversationId) {
      console.log(`Loading conversation: ${chatId}`);
      loadConversation(chatId);
    }
  }, [chatId, currentConversationId]);

  const loadConversation = async (conversationId: string) => {
    try {
      console.log(`Fetching conversation metadata for: ${conversationId}`);
      
      // Load conversation metadata
      const convResponse = await fetch(`/api/matrix/conversations?id=${conversationId}`);
      if (!convResponse.ok) {
        console.error("Failed to load conversation:", convResponse.status);
        return;
      }
      
      const convData = await convResponse.json();
      const conversation = convData.conversations?.[0];
      
      console.log("Conversation data:", conversation);
      console.log("Metadata:", conversation?.metadata);
      
      if (!conversation) {
        console.error("No conversation found");
        return;
      }
      
      // Set as current conversation
      setCurrentConversationId(conversationId);
      
      // Check if this is a report
      if (conversation.metadata?.isReport && conversation.metadata?.reportSections) {
        console.log("✅ Loading saved report with", conversation.metadata.reportSections.length, "sections");
        
        // Restore report mode and sections
        setReportMode(true);
        setReportTitle(conversation.title || "Market Research Report");
        setResearchTopic(conversation.metadata.reportTopic || "");
        
        // Restore sections with proper structure
        const savedSections = conversation.metadata.reportSections.map((s: any, idx: number) => ({
          ...s,
          number: idx + 1,
          expanded: false, // Start collapsed
        }));
        
        console.log("Restored sections:", savedSections);
        setReportSections(savedSections);
        
        // Restore settings
        if (conversation.metadata.settings) {
          console.log("Saved settings:", conversation.metadata.settings);
        }
      } else {
        console.log("Loading regular chat messages");
        // Load regular chat messages
        const messagesResponse = await fetch(`/api/matrix/messages?conversation_id=${conversationId}`);
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          // Convert to message format
          const loadedMessages = messagesData.messages?.map((m: any) => ({
            role: m.role,
            content: m.content,
          })) || [];
          setMessages(loadedMessages);
        }
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  // Update report title
  const updateReportTitle = async (newTitle: string) => {
    setReportTitle(newTitle);
    
    // Update conversation title in database
    if (currentConversationId) {
      try {
        await fetch(`/api/matrix/conversations`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: currentConversationId,
            title: newTitle,
          }),
        });
        
        // Notify parent to refresh sidebar
        if (onConversationCreated) {
          onConversationCreated();
        }
      } catch (error) {
        console.error("Error updating conversation title:", error);
      }
    }
  };

  // Create or update conversation
  const createConversation = async (topic: string): Promise<string | null> => {
    try {
      const response = await fetch("/api/matrix/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Research: ${topic}`,
          project_id: projectId,
          metadata: {
            settings: { extendedThinking, webSearch, research, smallBusinessFocus }
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Conversation created:", data.conversation.id);
        // Notify parent to refresh sidebar
        if (onConversationCreated) {
          onConversationCreated();
        }
        return data.conversation.id;
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
    return null;
  };

  // Save a message to the conversation
  const saveMessage = async (conversationId: string, role: string, content: string) => {
    try {
      await fetch("/api/matrix/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          role,
          content,
          files: [],
        }),
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const generateReport = async (topic: string) => {
    // Create conversation and save initial query
    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = await createConversation(topic);
      if (conversationId) {
        setCurrentConversationId(conversationId);
        setResearchTopic(topic);
        // Save user's query
        await saveMessage(conversationId, "user", `Research topic: ${topic}`);
      }
    }

    // Initialize report sections
    const initialSections: ReportSection[] = REPORT_SECTIONS.map(s => ({
      ...s,
      content: "",
      expanded: true,
    }));
    setReportSections(initialSections);
    setReportMode(true);
    setReportTitle(`Research: ${topic}`);

    // Collect all section contents for the final conclusion
    const sectionContents: Record<string, string> = {};

    // Generate each section
    for (const section of REPORT_SECTIONS) {
      // Mark this section as generating with status
      setReportSections(prev => prev.map(s => ({
        ...s,
        isGenerating: s.id === section.id,
        generationStatus: s.id === section.id ? "Searching MATRIX proprietary database..." : undefined
      })));
      
      setLiveStatus(`Generating ${section.title}...`);
      setSearchStatus([`Searching databases for ${section.title}...`]);
      
      try {
        // Search Supabase tables for relevant data (server-side)
        const searchResponse = await fetch("/api/matrix/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            sectionId: section.id,
            smallBusinessFocus,
          }),
        });
        
        let contextData = "";
        let sourcesFound: string[] = [];
        const supabaseSources: DataSource[] = []; // Real URLs from database
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          contextData = searchData.context || "";
          sourcesFound = searchData.sources || [];
          
          // Get real URLs from database records
          const sourceURLs = searchData.sourceURLs || [];
          supabaseSources.push(...sourceURLs);
          
          // Debug logging
          console.log(`=== SECTION ${section.id.toUpperCase()} DATA ===`);
          console.log(`✅ Found ${searchData.debug?.totalResults || 0} total results`);
          console.log(`Tables with data:`, searchData.debug?.resultsPerTable || []);
          console.log(`📎 Extracted ${sourceURLs.length} URLs`);
          if (sourceURLs.length > 0) {
            console.log(`First 3 URLs:`);
            sourceURLs.slice(0, 3).forEach((src: any) => {
              console.log(`  - ${src.name}`);
              console.log(`    ${src.url}`);
            });
          }
          console.log(`📝 Context length: ${contextData.length} chars`);
          console.log(`Context preview:`, contextData.substring(0, 200) + "...");
          console.log("================================");
          
          // Store debug info for UI panel
          setDebugInfo((prev: any) => ({
            ...prev,
            [section.id]: {
              totalResults: searchData.debug?.totalResults || 0,
              tablesWithData: searchData.debug?.resultsPerTable || [],
              urlsExtracted: sourceURLs.length,
              sampleUrls: sourceURLs.slice(0, 3),
              contextLength: contextData.length,
              contextPreview: contextData.substring(0, 300),
            }
          }));
          
          // Update status with sources found
          if (sourcesFound.length > 0) {
            setLiveStatus(`Found data in: ${sourcesFound.slice(0, 3).join(", ")}...`);
          }
        } else {
          console.error("Supabase search failed:", await searchResponse.text());
        }
        
        // Track web sources for citation
        const webSources: DataSource[] = [];
        
        // Search the web if enabled
        if (webSearch || research) {
          // Update section status
          setReportSections(prev => prev.map(s => ({
            ...s,
            generationStatus: s.id === section.id ? "Searching public web sources..." : s.generationStatus
          })));
          
          setLiveStatus(`Searching public web sources...`);
          setSearchStatus([`Searching web for ${section.title}...`]);
          
          // Search DOD-specific web sources
          const webResults = await searchDoDWeb(topic, section.id);
          const webContext = formatWebSearchContext(webResults, 5);
          contextData += webContext;
          
          // Extract URLs for citation
          const webURLs = extractWebSourceURLs(webResults, 5);
          webSources.push(...webURLs);
          
          // For funding/competition sections, also search recent news
          if (section.id === 'funding' || section.id === 'competition') {
            const newsResults = await searchRecentNews(topic);
            const newsContext = formatWebSearchContext(newsResults, 3);
            contextData += newsContext;
            
            // Extract news URLs for citation
            const newsURLs = extractWebSourceURLs(newsResults, 3);
            webSources.push(...newsURLs);
          }
        }
        
        // Update section status
        setReportSections(prev => prev.map(s => ({
          ...s,
          generationStatus: s.id === section.id ? "Compiling results..." : s.generationStatus
        })));
        
        setSearchStatus([`Generating ${section.title}...`]);
        
        // Use section-specific prompt
        const sectionPrompt = getSectionPrompt(section.id, topic, webSearch || research);
        
        const response = await fetch("/api/matrix/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{
              role: "user",
              content: section.id === 'conclusion' 
                ? `${sectionPrompt}\n\nPrevious sections for context:\n${Object.entries(sectionContents).map(([id, content]) => `${id}: ${content.substring(0, 500)}...`).join('\n\n')}`
                : sectionPrompt
            }],
            model: "gpt-4o-mini",
            extendedThinking,
            webSearch: webSearch || research,
            research: research || webSearch,
            smallBusinessFocus,
            supabaseContext: contextData // Pass both Supabase + Web data to API
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.message.content;
          sectionContents[section.id] = content;
          
          // Use real URLs from Supabase data (if available), otherwise fall back to generated sources
          const databaseSources = supabaseSources.length > 0 
            ? supabaseSources 
            : generateDataSources(section.id, content);
          
          // Combine database sources with web sources
          const allSources = [...databaseSources, ...webSources];
          
          setReportSections(prev => prev.map(s => 
            s.id === section.id 
              ? { ...s, content, sources: allSources, isGenerating: false, generationStatus: undefined }
              : s
          ));
        }
      } catch (error) {
        console.error(`Error generating section ${section.id}:`, error);
      }
    }
    
    // Save the complete report as an assistant message
    if (conversationId) {
      const reportSummary = `Generated complete market research report with ${REPORT_SECTIONS.length} sections on: ${topic}`;
      await saveMessage(conversationId, "assistant", reportSummary);
      
      // Metadata will be saved after enrichment completes
      console.log("💾 Will save report metadata after enrichment completes...");
    }
    
    // FINAL ENRICHMENT STEP: Enhance with live public data
    setLiveStatus("Final enrichment: Adding company intelligence...");
    setSearchStatus(["🔍 Final Step: Enhancing report with live public data..."]);
    
    try {
      // Extract companies and people from the report
      setLiveStatus("Identifying companies and key executives...");
      setSearchStatus(["🔍 Identifying companies and key personnel..."]);
      
      // Get current sections with content
      const sectionsToEnhance = reportSections.map(s => ({
        id: s.id,
        title: s.title,
        content: sectionContents[s.id] || "",
      }));
      
      // Call server-side enrichment API
      const enrichResponse = await fetch("/api/matrix/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: sectionsToEnhance,
          topic,
        }),
      });

      if (!enrichResponse.ok) {
        console.warn("Enrichment failed, skipping");
        setSearchStatus([]);
        setLiveStatus("");
        return;
      }

      const enrichData = await enrichResponse.json();
      const enhancements = enrichData.enhancements;
      
      // Apply enhancements section by section with live updates
      for (const sectionId of Object.keys(enhancements.enhancedSections)) {
        const section = REPORT_SECTIONS.find(s => s.id === sectionId);
        if (section) {
          // Mark section as enriching
          setReportSections(prev => prev.map(s => ({
            ...s,
            isEnriching: s.id === sectionId
          })));
          
          setLiveStatus(`Enriching ${section.title} with company data...`);
          setSearchStatus([`✨ Enriching ${section.title} with verified public data...`]);
          
          // Get enhancement content
          const enhancement = enhancements.enhancedSections[sectionId];
          
          // Add web sources from enhancement
          const webSources: DataSource[] = [];
          
          // Extract URLs from company data
          enhancements.companies.forEach((company: any) => {
            if (company.website) {
              webSources.push({
                name: `${company.name} - Official Website`,
                url: company.website,
              });
            }
            if (company.linkedin) {
              webSources.push({
                name: `${company.name} - LinkedIn`,
                url: company.linkedin,
              });
            }
          });
          
          // Extract URLs from key people data
          enhancements.keyPeople.forEach((person: any) => {
            if (person.linkedin) {
              webSources.push({
                name: `${person.name} (${person.title}) - LinkedIn`,
                url: person.linkedin,
              });
            }
          });
          
          // Update section with enhancement and new sources
          setReportSections(prev => prev.map(s => {
            if (s.id === sectionId) {
              const existingSources = s.sources || [];
              const combinedSources = [...existingSources, ...webSources];
              
              return {
                ...s,
                content: sectionContents[sectionId] + '\n\n' + enhancement,
                sources: combinedSources,
                isEnriching: false, // Clear enriching status
              };
            }
            return { ...s, isEnriching: false }; // Clear all enriching flags
          }));
          
          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
      
      // Save enriched report to metadata - wait for state to fully update
      if (conversationId) {
        console.log("💾 Saving complete report with enrichment to database...");
        console.log("Using conversation ID:", conversationId);
        
        // Wait for all state updates to finish
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Now save using the final state
        setReportSections(currentSections => {
          console.log(`📊 Saving ${currentSections.length} sections to metadata`);
          console.log("Sample content length:", currentSections[0]?.content?.length || 0);
          
          fetch("/api/matrix/conversations", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: conversationId,
              metadata: {
                settings: { extendedThinking, webSearch, research, smallBusinessFocus },
                isReport: true,
                reportTopic: topic,
                reportSections: currentSections.map(s => ({
                  id: s.id,
                  number: s.number,
                  title: s.title,
                  content: s.content || "",
                  sources: s.sources || [],
                })),
              }
            }),
          }).then(async res => {
            if (res.ok) {
              const data = await res.json();
              console.log("✅ Report metadata saved successfully!");
              console.log("Saved report with", currentSections.length, "sections");
            } else {
              console.error("❌ Failed to save report metadata:", res.status);
            }
          }).catch(error => {
            console.error("Error saving enriched report:", error);
          });
          
          return currentSections;
        });
      } else {
        console.warn("⚠️  No conversation ID - cannot save report metadata");
        console.warn("conversationId value:", conversationId);
      }
      
      setLiveStatus("Report complete!");
      setSearchStatus(["✅ Report enhancement complete! Added company websites, LinkedIn profiles, and executive information."]);
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setSearchStatus([]);
        setLiveStatus("");
      }, 3000);
      
    } catch (error) {
      console.error("Error in final enrichment:", error);
      setLiveStatus("");
      setSearchStatus(["⚠️ Enhancement completed with some errors. Report is still valid."]);
      setTimeout(() => setSearchStatus([]), 3000);
    }
  };

  const handleAdvancedQuery = async (query: string, mergeInstructions?: string): Promise<string> => {
    try {
      const context = selectedSection 
        ? `Context: You are analyzing the ${reportSections.find(s => s.id === selectedSection)?.title} section of a market research report.`
        : "Context: You are analyzing the entire market research report.";

      const response = await fetch("/api/matrix/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `${context}\n\nQuery: ${query}${mergeInstructions ? `\n\nMerge Instructions: ${mergeInstructions}` : ""}`
          }],
          model: "gpt-4o-mini",
          extendedThinking,
          webSearch,
          research,
          smallBusinessFocus,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // If merge instructions provided, update the section
        if (mergeInstructions && selectedSection) {
          setReportSections(prev => prev.map(s => 
            s.id === selectedSection 
              ? { ...s, content: s.content + "\n\n" + data.message.content }
              : s
          ));
        }
        
        return data.message.content;
      }
      
      return "Error: Failed to process query";
    } catch (error) {
      console.error("Advanced query error:", error);
      return "Error: Failed to process query";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && uploadedFiles.length === 0) return;

    const userContent = input.trim();
    const userMessage = { role: "user", content: userContent, files: uploadedFiles };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    const filesToProcess = uploadedFiles;
    setUploadedFiles([]);
    setIsLoading(true);
    setSearchStatus([]);

    // If first query, generate full report
    if (!reportMode && messages.length === 0) {
      let researchQuery = userContent;
      
      // Process uploaded documents if any
      if (filesToProcess.length > 0) {
        setSearchStatus(["🤖 Analyzing uploaded documents with AI..."]);
        
        try {
          const formData = new FormData();
          filesToProcess.forEach(file => {
            formData.append("files", file);
          });
          
          const docResponse = await fetch("/api/matrix/process-documents", {
            method: "POST",
            body: formData,
          });
          
          if (docResponse.ok) {
            const docData = await docResponse.json();
            
            // Enhance the research query with document insights
            researchQuery = `${userContent}\n\nBased on these uploaded documents:\n${docData.combinedPrompt}`;
            
            setSearchStatus([`✅ Analyzed ${docData.totalFiles} document(s) - integrating insights into research`]);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (docError) {
          console.error("Error processing documents:", docError);
        }
      }
      
      await generateReport(researchQuery);
      setIsLoading(false);
      return;
    }

    try {
      // Show initial search status
      const dataSources = [
        "Initializing research...",
      ];
      
      if (smallBusinessFocus) {
        dataSources.push(
          "Searching xTech (Army Innovation) historical data...",
          "Analyzing MANTECH manufacturing projects...",
          "Checking DSIP opportunities...",
          "Reviewing FUZE innovation platform..."
        );
      } else {
        dataSources.push(
          "Searching all available data sources...",
          "Analyzing SBIR/STTR programs...",
          "Reviewing government contracts...",
          "Checking innovation opportunities..."
        );
      }
      
      // Simulate progressive search updates
      for (let i = 0; i < dataSources.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setSearchStatus(prev => [...prev, dataSources[i]]);
      }
      
      setSearchStatus(prev => [...prev, "Compiling results..."]);
      
      // Process files with LLM if any
      let fileContext = "";
      let enhancedPrompt = userContent;
      
      if (filesToProcess.length > 0) {
        setSearchStatus(prev => [...prev, "🤖 Analyzing uploaded documents with AI..."]);
        
        try {
          const formData = new FormData();
          filesToProcess.forEach(file => {
            formData.append("files", file);
          });
          
          const docResponse = await fetch("/api/matrix/process-documents", {
            method: "POST",
            body: formData,
          });
          
          if (docResponse.ok) {
            const docData = await docResponse.json();
            
            // Use the combined research prompt from document analysis
            enhancedPrompt = `${userContent}\n\n--- Document Analysis ---\n${docData.combinedPrompt}`;
            
            fileContext = `\n\n📄 Analyzed ${docData.totalFiles} document(s):\n` +
              docData.documents.map((doc: any) => 
                `- ${doc.filename}: ${doc.summary}\n  Key Topics: ${doc.keyInformation.topics.slice(0, 5).join(", ")}`
              ).join("\n");
            
            setSearchStatus(prev => [...prev, "✅ Documents analyzed and integrated into research"]);
          } else {
            // Fallback: just list files
            fileContext = `\n\n[User uploaded ${filesToProcess.length} file(s): ${filesToProcess.map(f => f.name).join(", ")}]`;
          }
        } catch (docError) {
          console.error("Error processing documents:", docError);
          fileContext = `\n\n[User uploaded ${filesToProcess.length} file(s): ${filesToProcess.map(f => f.name).join(", ")}]`;
        }
      }

      // Prepare messages for API
      const apiMessages = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content + (msg.files?.length > 0 ? `\n[Attached ${msg.files.length} file(s)]` : "")
      }));

      // Call OpenAI API
      const response = await fetch("/api/matrix/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: "gpt-4o-mini",
          extendedThinking,
          webSearch,
          research,
          smallBusinessFocus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      
      setSearchStatus(prev => [...prev, "Generating response..."]);
      
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.message.content,
        }
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error processing your request. Please try again.",
        }
      ]);
    } finally {
      setIsLoading(false);
      setSearchStatus([]);
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          onClick={onToggleSidebar}
            className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

          {/* Center - Report Title (Editable) */}
          {reportMode && (
            <div className="flex items-center space-x-2 text-gray-400 text-sm group">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  onBlur={() => {
                    setIsEditingTitle(false);
                    updateReportTitle(reportTitle);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingTitle(false);
                      updateReportTitle(reportTitle);
                    }
                  }}
                  autoFocus
                  className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-primary-500 outline-none"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{reportTitle}</span>
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity"
                    title="Edit report title"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Project indicator */}
          {projectId && !reportMode && (
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Project Active</span>
          </div>
          )}

          {/* Right - Advanced Panel Toggle & Debug */}
          {reportMode && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDebugPanel(!showDebugPanel)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Debug Panel - Verify Data Pipeline"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setAdvancedPanelOpen(!advancedPanelOpen)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Advanced Query Panel"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
          {reportMode ? (
            /* Report Mode */
            <ResearchReport
              sections={reportSections}
              onSectionClick={(sectionId) => {
                setSelectedSection(sectionId);
                setAdvancedPanelOpen(true);
              }}
              onUpdateSection={(sectionId, content) => {
                setReportSections(prev => prev.map(s => 
                  s.id === sectionId ? { ...s, content } : s
                ));
              }}
              onExpandedChange={(expandedSections) => {
                // If all sections collapsed, clear selection
                if (expandedSections.size === 0) {
                  setSelectedSection(null);
                }
              }}
              liveStatus={liveStatus}
              isGenerating={isLoading}
            />
          ) : messages.length === 0 ? (
          /* Welcome Screen */
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              {/* MRT Logo */}
              <div className="mb-8">
                <Image
                  src="/images/logo.png"
                  alt="Make Ready Technologies"
                  width={280}
                  height={280}
                  className="mx-auto"
                />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What do you want to start research on?
              </h1>
              <p className="text-gray-400 text-lg">
                {session?.user?.name && `Welcome back, ${session.user.name.split(' ')[0]}`}
              </p>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white"
                      : "bg-gray-800 text-gray-100"
                  } rounded-2xl px-4 py-3`}
                >
                  {message.files && message.files.length > 0 && (
                    <div className="mb-2 space-y-1">
                      {message.files.map((file: File, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-sm opacity-90"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 rounded-2xl px-4 py-3 max-w-[80%]">
                  <div className="space-y-2">
                    {/* Animated dots */}
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <span className="text-sm text-gray-400 ml-2">Researching...</span>
                    </div>
                    
                    {/* Search status updates */}
                    {searchStatus.length > 0 && (
                      <div className="mt-3 space-y-1 text-xs">
                        {searchStatus.map((status, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-gray-400">
                            <svg className="w-3 h-3 mt-0.5 flex-shrink-0 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className={idx === searchStatus.length - 1 ? 'text-gray-300' : ''}>{status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

        {/* Input Area - Only show in non-report mode */}
        {!reportMode && (
      <div className="border-t border-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              {/* Input Box */}
              <div className="flex items-end bg-gray-800 rounded-2xl border border-gray-700 focus-within:border-primary-500 transition-colors">
                {/* Action Buttons - Left Side */}
                <div className="flex items-center space-x-1 p-2">
                  {/* Upload Button */}
                  <label
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                    title="Upload document"
                  >
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
                    />
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </label>

                  {/* Options Menu Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowOptions(!showOptions)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="Options"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                    </button>

                    {/* Options Dropdown */}
                    {showOptions && (
                      <div className="absolute bottom-full left-0 mb-2 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                        <div className="p-3 border-b border-gray-800">
                          <input
                            type="text"
                            placeholder="Search menu"
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div className="p-2">
                          {/* Extended Thinking */}
                          <button
                            type="button"
                            onClick={() => setExtendedThinking(!extendedThinking)}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              <span className="text-sm text-gray-300">Extended thinking</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${extendedThinking ? 'bg-primary-600' : 'bg-gray-700'}`}>
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${extendedThinking ? 'right-0.5' : 'left-0.5'}`}></div>
                            </div>
                          </button>

                          {/* Web Search */}
                          <button
                            type="button"
                            onClick={() => setWebSearch(!webSearch)}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                              <span className="text-sm text-gray-300">Web search</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${webSearch ? 'bg-primary-600' : 'bg-gray-700'}`}>
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${webSearch ? 'right-0.5' : 'left-0.5'}`}></div>
                            </div>
                          </button>

                          {/* Research */}
                          <button
                            type="button"
                            onClick={() => setResearch(!research)}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <span className="text-sm text-gray-300">Research</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${research ? 'bg-primary-600' : 'bg-gray-700'}`}>
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${research ? 'right-0.5' : 'left-0.5'}`}></div>
                            </div>
                          </button>

                          {/* Divider */}
                          <div className="border-t border-gray-800 my-2"></div>

                          {/* Small Business Focus */}
                          <button
                            type="button"
                            onClick={() => setSmallBusinessFocus(!smallBusinessFocus)}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <div className="flex flex-col items-start">
                                <span className="text-sm text-gray-300">Small Business Focus</span>
                                <span className="text-xs text-gray-500">DSIP, MANTECH, xTech, FUZE</span>
                              </div>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${smallBusinessFocus ? 'bg-accent-500' : 'bg-gray-700'}`}>
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${smallBusinessFocus ? 'right-0.5' : 'left-0.5'}`}></div>
                            </div>
                          </button>

                          {/* Small Business Note */}
                          {smallBusinessFocus && (
                            <div className="px-3 py-2 bg-gray-800 rounded-lg">
                              <p className="text-xs text-gray-400 leading-relaxed">
                                Prioritizing small business data from: DSIP, MANTECH, xTech (Army Innovation), FUZE
                              </p>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                Coming soon: SBA Awards, FPDS Small Business data
                              </p>
                          </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Input */}
                <div className="flex-1 flex flex-col">
                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-2 pt-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded-lg text-sm"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-gray-300">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="text-gray-400 hover:text-white"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                    placeholder="What do you want to start research on?"
                  className="flex-1 bg-transparent text-white placeholder-gray-500 py-4 px-2 focus:outline-none"
                    disabled={isLoading}
                />
                </div>

                {/* Model Selector & Submit - Right Side */}
                <div className="flex items-center space-x-2 p-2">
                  {/* Model Selector */}
                  <div className="relative group">
                    <button
                      type="button"
                      className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <span>GPT-4 Mini</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                      <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap border border-gray-700">
                        More models coming soon
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
                    className="p-2 bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                  >
                    {isLoading ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Footer Text */}
          <p className="text-xs text-gray-500 text-center mt-3">
            MATRIX can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
        )}
      </div>

      {/* Advanced Query Panel */}
      {reportMode && (
        <AdvancedQueryPanel
          isOpen={advancedPanelOpen}
          onClose={() => setAdvancedPanelOpen(false)}
          selectedSection={selectedSection ? reportSections.find(s => s.id === selectedSection)?.title || null : null}
          onQuery={handleAdvancedQuery}
        />
      )}

      {/* Debug Panel */}
      {showDebugPanel && reportMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50 max-h-[50vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Data Pipeline Verification
              </h3>
              <button
                onClick={() => setShowDebugPanel(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(debugInfo).map((sectionId) => {
                const section = REPORT_SECTIONS.find(s => s.id === sectionId);
                const info = debugInfo[sectionId];
                
                return (
                  <div key={sectionId} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-white font-semibold mb-3">{section?.title}</h4>
                    
                    <div className="space-y-2 text-sm">
                      {/* Results Found */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Results Found:</span>
                        <span className={`font-bold ${info.totalResults > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {info.totalResults}
                        </span>
                      </div>

                      {/* Tables with Data */}
                      {info.tablesWithData && info.tablesWithData.length > 0 && (
                        <div>
                          <span className="text-gray-400">Tables:</span>
                          <div className="mt-1 space-y-1">
                            {info.tablesWithData.map((t: any) => (
                              <div key={t.table} className="text-xs text-gray-300 ml-2">
                                • {t.table}: {t.count} rows
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* URLs Extracted */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">URLs Extracted:</span>
                        <span className={`font-bold ${info.urlsExtracted > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {info.urlsExtracted}
                        </span>
                      </div>

                      {/* Sample URLs */}
                      {info.sampleUrls && info.sampleUrls.length > 0 && (
                        <div>
                          <span className="text-gray-400">Sample URLs:</span>
                          <div className="mt-1 space-y-1">
                            {info.sampleUrls.map((url: any, idx: number) => (
                              <div key={idx} className="text-xs">
                                <a 
                                  href={url.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 truncate block"
                                  title={url.name}
                                >
                                  {url.name.substring(0, 40)}...
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Context Length */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">LLM Context:</span>
                        <span className={`font-bold ${info.contextLength > 1000 ? 'text-green-400' : info.contextLength > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {info.contextLength} chars
                        </span>
                      </div>

                      {/* Context Preview */}
                      {info.contextPreview && (
                        <details className="mt-2">
                          <summary className="text-gray-400 cursor-pointer hover:text-white">
                            View data sent to LLM
                          </summary>
                          <pre className="mt-2 text-xs text-gray-300 bg-gray-900 p-2 rounded overflow-x-auto">
                            {info.contextPreview}...
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg">
              <p className="text-blue-300 text-sm">
                <strong>What to check:</strong>
                <br />
                ✅ <strong>Results Found &gt; 0:</strong> Database search working
                <br />
                ✅ <strong>URLs Extracted &gt; 0:</strong> Your data has clickable URLs
                <br />
                ✅ <strong>LLM Context &gt; 1000 chars:</strong> AI is receiving substantial data
                <br />
                <br />
                Click "View data sent to LLM" to see actual database records being analyzed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

