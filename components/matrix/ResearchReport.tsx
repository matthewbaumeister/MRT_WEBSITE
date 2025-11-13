"use client";

import { useState } from "react";

interface DataSource {
  name: string;
  url: string;
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

interface ResearchReportProps {
  sections: ReportSection[];
  onSectionClick: (sectionId: string) => void;
  onUpdateSection: (sectionId: string, content: string) => void;
  onExpandedChange?: (expandedSections: Set<string>) => void;
  liveStatus?: string; // Live generation status
  isGenerating?: boolean; // Whether report is still generating
}

// Helper function to parse markdown content
function parseMarkdownContent(content: string): string {
  let html = content;
  
  // 1. Parse tables
  const tableRegex = /\|(.+)\|\n\|([-:\s|]+)\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match, headerRow, separatorRow, bodyRows) => {
    const headers = headerRow.split('|').map((h: string) => h.trim()).filter(Boolean);
    const rows = bodyRows.trim().split('\n').map((row: string) => 
      row.split('|').map((cell: string) => cell.trim()).filter(Boolean)
    );
    
    let tableHTML = '<div class="overflow-x-auto my-4"><table class="min-w-full border border-gray-600">';
    
    // Header
    tableHTML += '<thead class="bg-gray-700"><tr>';
    headers.forEach((header: string) => {
      tableHTML += `<th class="px-4 py-2 border border-gray-600 text-left font-semibold text-white">${header}</th>`;
    });
    tableHTML += '</tr></thead>';
    
    // Body
    tableHTML += '<tbody>';
    rows.forEach((row: string[], idx: number) => {
      tableHTML += `<tr class="${idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'}">`;
      row.forEach((cell: string) => {
        tableHTML += `<td class="px-4 py-2 border border-gray-600 text-gray-300">${cell}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table></div>';
    
    return tableHTML;
  });
  
  // 2. Headers (BEFORE bold/italic to prevent breaking them)
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-white mt-6 mb-3">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mt-8 mb-4">$1</h1>');
  
  // 3. Bold (before italic)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
  
  // 4. Italic
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // 5. URLs - Keep as plain text citations (no hyperlinks)
  // First, clean up any existing broken HTML anchor tags in [Source: ...] citations
  // Handle broken pattern: [Source: URL" target="..." rel="..." class="...">Label]
  // This pattern matches URLs followed by HTML attributes without proper <a> tag
  html = html.replace(
    /\[Source:\s*([^"<>]+)"\s*(?:target="[^"]*"\s*)?(?:rel="[^"]*"\s*)?(?:class="[^"]*"\s*)?>([^\]]+)\]/gi,
    (match, url, label) => {
      // Extract the label from the link text or use the URL
      const cleanLabel = label.trim() || url.trim();
      return `[Source: ${cleanLabel}]`;
    }
  );
  
  // Handle properly formed anchor tags in [Source: ...] citations
  html = html.replace(
    /\[Source:\s*([^<]*?)<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>([^\]]*?)\]/gi,
    (match, before, url, linkText, after) => {
      // Extract the label from the link text or use the URL
      const label = linkText.trim() || url;
      return `[Source: ${before}${label}${after}]`;
    }
  );
  
  // Handle [Source: Label](URL) format - convert to plain text [Source: Label]
  html = html.replace(
    /\[Source:\s*([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/gi,
    (match, label, url) => {
      // Keep as plain text citation with label
      return `[Source: ${label}]`;
    }
  );
  
  // Remove any remaining anchor tags that might be in the text (standalone URLs)
  html = html.replace(
    /<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi,
    (match, url, linkText) => {
      // Replace with just the link text or URL
      return linkText.trim() || url;
    }
  );
  
  // Handle standalone URLs - keep as plain text (no hyperlinks)
  // URLs are already in the text, so we don't need to convert them to links
  
  // 6. Line breaks
  html = html.replace(/\n\n/g, '</p><p class="mb-4">');
  html = html.replace(/\n/g, '<br/>');
  
  return `<p class="mb-4">${html}</p>`;
}

export default function ResearchReport({
  sections,
  onSectionClick,
  onUpdateSection,
  onExpandedChange,
  liveStatus,
  isGenerating = false,
}: ResearchReportProps) {
  // Start with all sections collapsed
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  // Track which sections have sources expanded (default collapsed)
  const [expandedSources, setExpandedSources] = useState<Set<string>>(
    new Set()
  );

  // Add CSS for copied link animation
  if (typeof document !== 'undefined' && !document.getElementById('report-link-styles')) {
    const style = document.createElement('style');
    style.id = 'report-link-styles';
    style.textContent = `
      .markdown-content a.copied::after {
        content: "✓ Copied!";
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        white-space: nowrap;
        animation: fadeInOut 2s ease;
      }
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(5px); }
        20% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-5px); }
      }
    `;
    document.head.appendChild(style);
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
    onExpandedChange?.(newExpanded);
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
    onExpandedChange?.(new Set());
  };

  const expandAll = () => {
    const allIds = new Set(sections.map(s => s.id));
    setExpandedSections(allIds);
    onExpandedChange?.(allIds);
  };

  const toggleSources = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent section toggle
    const newExpandedSources = new Set(expandedSources);
    if (newExpandedSources.has(sectionId)) {
      newExpandedSources.delete(sectionId);
    } else {
      newExpandedSources.add(sectionId);
    }
    setExpandedSources(newExpandedSources);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      {/* Report Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white">
              Market Research Report
            </h1>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Generated by MATRIX • {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={expandAll}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Report Sections */}
      {sections.map((section) => {
        const isExpanded = expandedSections.has(section.id);

        return (
          <div
            key={section.id}
            data-section-id={section.id}
            className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden transition-all hover:border-gray-600"
          >
            {/* Section Header */}
            <button
              onClick={() => {
                toggleSection(section.id);
                onSectionClick(section.id);
              }}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-sm">
                  {section.number}
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {section.title}
                </h2>
                {section.isGenerating && section.generationStatus && (
                  <div className="flex items-center gap-2 ml-4">
                    {/* Only show bouncing dots if NOT paused */}
                    {!section.generationStatus.includes('Paused') && (
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    )}
                    <span className="text-blue-400 text-xs font-semibold">
                      {section.generationStatus}
                    </span>
                  </div>
                )}
                {section.isEnriching && (
                  <div className="flex items-center gap-2 ml-4">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                    <span className="text-green-400 text-xs font-semibold">
                      Enriching...
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {section.sources && section.sources.length > 0 && (
                  <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">
                    {section.sources.length} sources
                  </span>
                )}
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {/* Section Content */}
            {isExpanded && (
              <div className="p-6 border-t border-gray-700 bg-gray-850">
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed">
                    {section.content ? (
                      <div 
                        className="markdown-content"
                        dangerouslySetInnerHTML={{ 
                          __html: parseMarkdownContent(section.content)
                        }}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-500 italic">
                        <svg
                          className="w-4 h-4 animate-spin"
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
                        <span>Generating content...</span>
                      </div>
                    )}
                  </div>
                </div>
                <style jsx>{`
                  .markdown-content h1, .markdown-content h2, .markdown-content h3 {
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                  }
                  .markdown-content p {
                    margin-bottom: 1em;
                  }
                  .markdown-content strong {
                    font-weight: 600;
                    color: #fff;
                  }
                `}</style>

                {/* Data Sources - Collapsible */}
                {section.sources && section.sources.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <button
                      onClick={(e) => toggleSources(section.id, e)}
                      className="w-full flex items-center justify-between text-sm font-semibold text-gray-400 hover:text-white transition-colors mb-3"
                    >
                      <span className="flex items-center space-x-2">
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            expandedSources.has(section.id) ? "rotate-90" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        <span>Data Sources ({section.sources.length})</span>
                      </span>
                      <span className="text-xs text-gray-500">
                        {expandedSources.has(section.id) ? "Click to collapse" : "Click to view all"}
                      </span>
                    </button>
                    {expandedSources.has(section.id) && (
                      <div className="space-y-1 max-h-96 overflow-y-auto">
                        {section.sources.map((source, idx) => (
                          <div
                            key={idx}
                            className="text-xs flex items-start space-x-2 py-1"
                          >
                            <span className="text-accent-500 mt-0.5">•</span>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-400 hover:text-primary-300 underline transition-colors flex-1"
                            >
                              {source.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

