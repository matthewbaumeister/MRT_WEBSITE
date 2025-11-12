"use client";

import { useState, useEffect } from "react";

interface AdvancedQueryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSection: string | null;
  selectedSectionId: string | null;
  sectionQueryHistory: Record<string, { query: string; result: string }>;
  onQuery: (query: string, mergeInstructions?: string) => Promise<string>;
  onClearSection?: () => void;
  onMergeStart?: () => void;
  onMergeEnd?: () => void;
}

// Helper to parse markdown with better formatting support
function parseMarkdown(text: string): string {
  let html = text;
  
  // LaTeX math blocks \[ ... \] - render as code blocks
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, (match, formula) => {
    return `<div class="bg-gray-900 rounded px-3 py-2 my-2 font-mono text-xs text-green-300 overflow-x-auto">${formula.trim()}</div>`;
  });
  
  // LaTeX inline math \( ... \)
  html = html.replace(/\\\((.*?)\\\)/g, (match, formula) => {
    return `<code class="bg-gray-900 rounded px-2 py-0.5 text-green-300 font-mono text-xs">${formula}</code>`;
  });
  
  // Headers (must come before other replacements)
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-white">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2 text-white">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2 text-white">$1</h1>');
  
  // Bold (before italic to handle ** before *)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // Split into lines for list processing
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inOrderedList = false;
  let inUnorderedList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Numbered lists (1. 2. 3. etc.)
    if (/^\d+\.\s+(.+)/.test(line)) {
      const match = line.match(/^\d+\.\s+(.+)/);
      if (match) {
        if (!inOrderedList) {
          processedLines.push('<ol class="list-decimal list-inside space-y-2 my-3 ml-4">');
          inOrderedList = true;
        }
        processedLines.push(`<li class="text-gray-300">${match[1]}</li>`);
      }
    } 
    // Bullet lists (-, *, •)
    else if (/^[-*•]\s+(.+)/.test(line)) {
      const match = line.match(/^[-*•]\s+(.+)/);
      if (match) {
        if (inOrderedList) {
          processedLines.push('</ol>');
          inOrderedList = false;
        }
        if (!inUnorderedList) {
          processedLines.push('<ul class="list-disc list-inside space-y-2 my-3 ml-4">');
          inUnorderedList = true;
        }
        processedLines.push(`<li class="text-gray-300">${match[1]}</li>`);
      }
    } 
    // Regular line
    else {
      if (inOrderedList) {
        processedLines.push('</ol>');
        inOrderedList = false;
      }
      if (inUnorderedList) {
        processedLines.push('</ul>');
        inUnorderedList = false;
      }
      
      // Only add <br/> for non-empty lines that aren't HTML tags
      if (line.trim() && !line.trim().startsWith('<')) {
        processedLines.push(line + '<br/>');
      } else if (line.trim().startsWith('<')) {
        processedLines.push(line);
      } else {
        processedLines.push('<br/>');
      }
    }
  }
  
  // Close any open lists
  if (inOrderedList) processedLines.push('</ol>');
  if (inUnorderedList) processedLines.push('</ul>');
  
  return processedLines.join('\n');
}

export default function AdvancedQueryPanel({
  isOpen,
  onClose,
  selectedSection,
  selectedSectionId,
  sectionQueryHistory,
  onQuery,
  onClearSection,
  onMergeStart,
  onMergeEnd,
}: AdvancedQueryPanelProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  const [mergeInstructions, setMergeInstructions] = useState("");
  const [dataSources, setDataSources] = useState<{supabaseTables: number; webResults: boolean} | null>(null);
  const [mergeSuccess, setMergeSuccess] = useState(false);
  
  // Load query history when section changes (in useEffect to prevent blocking input)
  useEffect(() => {
    const historyKey = selectedSectionId || "whole-report";
    const currentHistory = sectionQueryHistory[historyKey];
    
    if (currentHistory) {
      setQuery(currentHistory.query);
      setResult(currentHistory.result);
      setShowMerge(true);
    } else {
      // Clear query when switching to a section with no history
      setQuery("");
      setResult("");
      setShowMerge(false);
    }
  }, [selectedSectionId, sectionQueryHistory]);

  const handleQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResult("");

    try {
      const response = await onQuery(query);
      setResult(response);
      setShowMerge(true);
    } catch (error) {
      setResult("Error: Failed to process query");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMerge = async () => {
    if (!result) return;

    setIsLoading(true);
    
    // Notify parent that merge is starting
    if (onMergeStart) {
      onMergeStart();
    }
    
    try {
      console.log("[MERGE] Starting merge with instructions:", mergeInstructions || "(using query as is)");
      await onQuery(query, mergeInstructions || query); // Pass query if no specific instructions
      console.log("[MERGE] ✅ Merge complete - section should be updating now");
      
      // Show success state
      setMergeSuccess(true);
      setMergeInstructions("");
      
      // Clear everything after 2 seconds (gives user time to see success)
      setTimeout(() => {
        setShowMerge(false);
        setQuery("");
        setResult("");
        setDataSources(null);
        setMergeSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("[MERGE] ❌ Merge error:", error);
      setMergeSuccess(false);
      alert("Merge failed. Please check the console for details.");
    } finally {
      setIsLoading(false);
      
      // Notify parent that merge is complete
      if (onMergeEnd) {
        onMergeEnd();
      }
    }
  };

  return (
    <>
      {/* Overlay */}
      {/* Panel - Flex item, not overlay */}
      <div className="w-96 bg-gray-950 border-l border-gray-800 flex-shrink-0 flex flex-col">
        {/* Header - Aligned height with other panels */}
        <div className="flex flex-col justify-center p-4 border-b border-gray-800 h-[73px]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Advanced Query
              </h2>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                {selectedSection ? (
                  <>
                    Querying: <span className="text-primary-400">{selectedSection}</span>
                    {onClearSection && (
                      <button
                        onClick={onClearSection}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                        title="Clear section - Query entire report"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </>
                ) : (
                  "Query entire research report"
                )}
              </p>
            </div>
            
            {/* Close Panel Button */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-all hover:bg-gray-800 p-2 rounded-lg"
              title="Close Advanced Query"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Query Entire Report Button */}
        {selectedSection && onClearSection && (
          <div className="px-4 pt-4">
            <button
              onClick={onClearSection}
              className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Query Entire Report
            </button>
          </div>
        )}

        {/* Query Input */}
        <div className="p-4 border-b border-gray-800">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Query
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              selectedSection
                ? `Ask a specific question about ${selectedSection}...`
                : "Query entire research report..."
            }
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
          <button
            onClick={handleQuery}
            disabled={!query.trim() || isLoading}
            onMouseMove={(e) => {
              if (!query.trim() || isLoading) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
              e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
            }}
            className="mt-3 w-full px-4 py-2 relative overflow-hidden bg-gradient-to-r from-accent-500 to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium group"
            style={
              {
                '--mouse-x': '50%',
                '--mouse-y': '50%',
              } as React.CSSProperties
            }
          >
            <span className="relative z-10">{isLoading ? "Querying..." : "Run Query"}</span>
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), rgb(99 102 241), rgb(124 58 237))`,
              }}
            />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center space-y-3">
                <svg
                  className="w-8 h-8 text-primary-500 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-sm text-gray-400">Analyzing...</span>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">
                  Query Result:
                </h3>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div 
                    className="text-sm text-gray-300 leading-relaxed prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(result) }}
                  />
                </div>
              </div>

              {/* Merge Section */}
              {showMerge && (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowMerge(!showMerge)}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                      e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
                    }}
                    className="w-full px-4 py-2 relative overflow-hidden bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg transition-all font-medium flex items-center justify-center space-x-2 group"
                    style={
                      {
                        '--mouse-x': '50%',
                        '--mouse-y': '50%',
                      } as React.CSSProperties
                    }
                  >
                    <svg
                      className="w-4 h-4 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                    <span className="relative z-10">Merge to Report</span>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), rgb(99 102 241), rgb(124 58 237))`,
                      }}
                    />
                  </button>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Merge Instructions (optional)
                    </label>
                    <textarea
                      value={mergeInstructions}
                      onChange={(e) => setMergeInstructions(e.target.value)}
                      placeholder="e.g., Add this data to the competition section with emphasis on market leaders..."
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleMerge}
                    disabled={isLoading || mergeSuccess}
                    onMouseMove={(e) => {
                      if (isLoading || mergeSuccess) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                      e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
                    }}
                    className={`w-full px-4 py-2 relative overflow-hidden ${
                      mergeSuccess 
                        ? 'bg-green-600' 
                        : 'bg-gradient-to-r from-primary-600 to-primary-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium flex items-center justify-center space-x-2 group`}
                    style={
                      !mergeSuccess ? {
                        '--mouse-x': '50%',
                        '--mouse-y': '50%',
                      } as React.CSSProperties : {}
                    }
                  >
                    {mergeSuccess ? (
                      <>
                        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="relative z-10">Merged Successfully! Check report section →</span>
                      </>
                    ) : isLoading ? (
                      <span className="relative z-10">Merging into report...</span>
                    ) : (
                      <>
                        <span className="relative z-10">Apply Merge to Report</span>
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-accent-500 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), rgb(245 158 11), rgb(234 179 8))`,
                          }}
                        />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {!result && !isLoading && (
            <div className="flex items-center justify-center py-8 text-center">
              <div className="text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-sm">
                  Run a query to see results here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

