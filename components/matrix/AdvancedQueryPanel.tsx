"use client";

import { useState } from "react";

interface AdvancedQueryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSection: string | null;
  onQuery: (query: string, mergeInstructions?: string) => Promise<string>;
  onMergeStart?: () => void;
  onMergeEnd?: () => void;
}

// Helper to parse simple markdown
function parseMarkdown(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    // Line breaks
    .replace(/\n/g, '<br/>');
}

export default function AdvancedQueryPanel({
  isOpen,
  onClose,
  selectedSection,
  onQuery,
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed lg:static inset-y-0 right-0 z-50 w-96 bg-gray-950 border-l border-gray-800 transform transition-transform duration-200 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">
              Advanced Query
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-400">
            {selectedSection ? (
              <>
                Querying: <span className="text-primary-400">{selectedSection}</span>
              </>
            ) : (
              "Query entire research report"
            )}
          </p>
        </div>

        {/* Query Input */}
        <div className="p-4 border-b border-gray-800">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Query
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a specific question about this section..."
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
          <button
            onClick={handleQuery}
            disabled={!query.trim() || isLoading}
            className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium"
          >
            {isLoading ? "Querying..." : "Run Query"}
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
                    className="w-full px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
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
                    <span>Merge to Report</span>
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
                    className={`w-full px-4 py-2 ${
                      mergeSuccess 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-primary-600 hover:bg-primary-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2`}
                  >
                    {mergeSuccess ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Merged Successfully! Check report section →</span>
                      </>
                    ) : isLoading ? (
                      <span>Merging into report...</span>
                    ) : (
                      <span>Apply Merge to Report</span>
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

