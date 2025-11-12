"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";

interface TableInfo {
  name: string;
  displayName: string;
  category: string;
  description: string;
}

// All available tables organized by category
const AVAILABLE_TABLES: TableInfo[] = [
  // Army Innovation / xTech
  { name: "army_innovation_opportunities", displayName: "Army Innovation Opportunities", category: "Army xTech", description: "Army innovation challenges and opportunities" },
  { name: "army_innovation_programs", displayName: "Army Innovation Programs", category: "Army xTech", description: "xTech and innovation program details" },
  { name: "army_innovation_submissions", displayName: "Army Innovation Submissions", category: "Army xTech", description: "Submitted proposals and applications" },
  { name: "army_innovation_documents", displayName: "Army Innovation Documents", category: "Army xTech", description: "Supporting documentation and files" },
  
  // ManTech
  { name: "mantech_projects", displayName: "ManTech Projects", category: "ManTech", description: "Manufacturing Technology projects" },
  { name: "mantech_company_mentions", displayName: "ManTech Company Mentions", category: "ManTech", description: "Companies mentioned in ManTech projects" },
  
  // DoD Contracts & News
  { name: "dod_contract_news", displayName: "DoD Contract News", category: "DoD Contracts", description: "Latest DoD contract awards and news" },
  { name: "dvids_military_news", displayName: "DVIDS Military News", category: "DoD Contracts", description: "Defense Visual Information Distribution Service news" },
  
  // SBIR
  { name: "sbir_final", displayName: "SBIR Awards", category: "SBIR", description: "Small Business Innovation Research awards" },
  
  // GSA
  { name: "gsa_labor_categories", displayName: "GSA Labor Categories", category: "GSA", description: "GSA Schedule labor category rates" },
  { name: "gsa_schedule_holders", displayName: "GSA Schedule Holders", category: "GSA", description: "Companies with GSA Schedules" },
  { name: "gsa_price_lists", displayName: "GSA Price Lists", category: "GSA", description: "GSA Schedule pricing information" },
  
  // Financial
  { name: "congressional_stock_trades", displayName: "Congressional Stock Trades", category: "Financial", description: "Congressional stock trading activity" },
  { name: "defense_contractors_tickers", displayName: "Defense Contractor Tickers", category: "Financial", description: "Defense contractor stock information" },
];

export default function KnowledgeBasePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"keyword" | "semantic">("keyword"); // Default to keyword
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [pageSize, setPageSize] = useState(50);
  
  // Smart features state
  const [expandedSmartSearch, setExpandedSmartSearch] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractingKeywords, setExtractingKeywords] = useState(false);
  const [extractedKeywords, setExtractedKeywords] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [findingSimilar, setFindingSimilar] = useState<string | null>(null);
  const [similarRecords, setSimilarRecords] = useState<any[] | null>(null);
  
  const ROWS_PER_PAGE = pageSize;

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load table data when table is selected
  useEffect(() => {
    if (selectedTable) {
      loadTableData();
    }
  }, [selectedTable, currentPage, sortColumn, sortDirection]);

  const loadTableData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        table: selectedTable,
        page: currentPage.toString(),
        limit: ROWS_PER_PAGE.toString(),
      });

      if (sortColumn) {
        params.append("sortColumn", sortColumn);
        params.append("sortDirection", sortDirection);
      }

      const response = await fetch(`/api/matrix/knowledge-base/table?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to load table data");
      }

      const result = await response.json();
      
      setTableData(result.data || []);
      setColumns(result.columns || []);
      setTotalRows(result.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      setTableData([]);
      setColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      if (selectedTable) {
        loadTableData();
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (searchMode === "semantic") {
        // Try semantic search first
        const response = await fetch("/api/matrix/semantic-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            filterTables: selectedTable ? [selectedTable] : undefined,
            matchThreshold: 0.7,
            matchCount: 50,
          }),
        });

        const result = await response.json();
        
        // If semantic search found results, use them
        if (result.success && result.results && result.results.length > 0) {
          const allData = result.results.flatMap((r: any) => r.data);
          setTableData(allData);
          setTotalRows(allData.length);
          
          if (allData.length > 0) {
            setColumns(Object.keys(allData[0]));
          }
        } else {
          // Fallback to keyword search if semantic returns nothing
          console.log("[KB] Semantic search returned no results, falling back to keyword search");
          
          if (!selectedTable) {
            setError("No embeddings found for semantic search. Please select a table and use keyword search, or generate embeddings first.");
            setTableData([]);
            setTotalRows(0);
          } else {
            // Automatically try keyword search on selected table
            const keywordResponse = await fetch(`/api/matrix/knowledge-base/search`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                table: selectedTable,
                query: searchQuery,
                page: currentPage,
                limit: ROWS_PER_PAGE,
              }),
            });

            if (keywordResponse.ok) {
              const keywordResult = await keywordResponse.json();
              setTableData(keywordResult.data || []);
              setColumns(keywordResult.columns || []);
              setTotalRows(keywordResult.total || 0);
              
              if ((keywordResult.data || []).length > 0) {
                setError("Note: Using keyword search fallback (semantic search embeddings not found)");
              } else {
                setError("No results found");
              }
            } else {
              setError("No semantic embeddings found. Please select a table for keyword search.");
              setTableData([]);
            }
          }
        }
      } else {
        // Keyword search - can search all tables or specific table
        if (!selectedTable) {
          // Search across ALL tables
          const response = await fetch(`/api/matrix/knowledge-base/search-all`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: searchQuery,
              limit: ROWS_PER_PAGE,
            }),
          });

          if (!response.ok) {
            throw new Error("Search failed");
          }

          const result = await response.json();
          setTableData(result.data || []);
          setColumns(result.columns || []);
          setTotalRows(result.total || 0);
          
          if (result.tablesSearched > 0) {
            const breakdown = result.tableBreakdown
              ?.slice(0, 3)
              .map((t: any) => `${t.table} (${t.count})`)
              .join(", ");
            setError(`Searched ${result.tablesSearched} tables. Top results from: ${breakdown}`);
          }
        } else {
          // Search specific table
          console.log("[KB] Sending search request:", { table: selectedTable, query: searchQuery });
          
          const response = await fetch(`/api/matrix/knowledge-base/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              table: selectedTable,
              query: searchQuery,
              page: currentPage,
              limit: ROWS_PER_PAGE,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error("[KB] Search error response:", errorData);
            throw new Error(errorData.error || "Search failed");
          }

          const result = await response.json();
          console.log("[KB] Search results:", result);
          setTableData(result.data || []);
          setColumns(result.columns || []);
          setTotalRows(result.total || 0);
        }
      }
    } catch (err: any) {
      console.error("[KB] Search error:", err);
      setError(err.message || "Search failed");
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortColumn(null);
    setSortDirection("asc");
    setCurrentPage(1);
    setExtractedKeywords("");
    setUploadedFile(null);
    if (selectedTable) {
      loadTableData();
    }
  };

  // Handle document upload and keyword extraction
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setExtractingKeywords(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/matrix/knowledge-base/extract-keywords", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract keywords");
      }

      const result = await response.json();
      
      if (result.success && result.keywords) {
        setExtractedKeywords(result.keywords);
        setSearchQuery(result.keywords);
        setError(`Extracted keywords from ${result.documentName}`);
      } else {
        setError("No keywords found in document");
      }
    } catch (err: any) {
      setError(err.message || "Failed to extract keywords");
      setUploadedFile(null);
    } finally {
      setExtractingKeywords(false);
    }
  };

  // Handle Find Similar
  const handleFindSimilar = async (record: any) => {
    if (!selectedTable && !record._source_table) {
      setError("Cannot find similar records without table information");
      return;
    }

    const table = selectedTable || record._source_table;
    setFindingSimilar(record.id);
    setError(null);

    try {
      const response = await fetch("/api/matrix/knowledge-base/find-similar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record,
          table,
          limit: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to find similar records");
      }

      const result = await response.json();
      
      if (result.success) {
        setSimilarRecords(result.results);
        setExpandedRow(record.id);
        if (result.results.length === 0) {
          setError("No similar records found");
        } else {
          setError(`Found ${result.results.length} similar records using ${result.method} search`);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to find similar records");
      setSimilarRecords(null);
    } finally {
      setFindingSimilar(null);
    }
  };

  // Toggle row expansion
  const toggleRowExpansion = (recordId: string) => {
    if (expandedRow === recordId) {
      setExpandedRow(null);
      setSimilarRecords(null);
    } else {
      setExpandedRow(recordId);
      setSimilarRecords(null);
    }
  };

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(AVAILABLE_TABLES.map(t => t.category)))];

  // Filter tables by category
  const filteredTables = selectedCategory === "all" 
    ? AVAILABLE_TABLES 
    : AVAILABLE_TABLES.filter(t => t.category === selectedCategory);

  const totalPages = Math.ceil(totalRows / ROWS_PER_PAGE);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] overflow-y-auto">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base</h1>
              <p className="text-gray-400">Browse and search across all data sources</p>
            </div>
            <button
              onClick={() => router.push("/matrix")}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Back to Matrix
            </button>
          </div>
        </div>

        {/* Data Source Selector - Always Visible */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Data Source {searchMode === "keyword" && <span className="text-gray-500">(optional - leave blank to search all tables)</span>}
            </label>
            <select
              value={selectedTable}
              onChange={(e) => {
                setSelectedTable(e.target.value);
                setCurrentPage(1);
                setSearchQuery("");
              }}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{searchMode === "keyword" ? "All Tables (Keyword Search)" : "-- Select a table --"}</option>
              {AVAILABLE_TABLES.map((table) => (
                <option key={table.name} value={table.name}>
                  {table.displayName} ({table.category}) - {table.description}
                </option>
              ))}
            </select>
            {selectedTable && (
              <p className="mt-2 text-sm text-gray-400">
                Currently browsing: <span className="text-primary-400 font-medium">
                  {AVAILABLE_TABLES.find(t => t.name === selectedTable)?.displayName}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Smart Search Section - Collapsible */}
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-lg border-2 border-green-700/30 mb-6 overflow-hidden">
          <button
            onClick={() => setExpandedSmartSearch(!expandedSmartSearch)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-green-900/10 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-green-400">Smart Search</h2>
              <span className="px-2 py-1 bg-green-700/30 border border-green-600/50 rounded text-xs font-semibold text-green-300">
                NEW
              </span>
              <span className="text-sm text-gray-400 italic">AI-powered document upload & keyword extraction</span>
            </div>
            <svg
              className={`w-5 h-5 text-green-400 transition-transform ${expandedSmartSearch ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSmartSearch && (
            <div className="px-6 pb-6 space-y-4">
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 text-sm text-yellow-300">
                <strong>How it works:</strong> Upload a document (PDF, TXT, DOC) and AI will extract relevant keywords to search across all databases.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Document for Keyword Extraction
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.pdf,.doc,.docx"
                  disabled={extractingKeywords}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-700 file:text-white hover:file:bg-green-600 file:cursor-pointer disabled:opacity-50"
                />
                {uploadedFile && (
                  <p className="mt-2 text-sm text-gray-400">
                    {extractingKeywords ? '🔄 Extracting keywords...' : `✓ Uploaded: ${uploadedFile.name}`}
                  </p>
                )}
              </div>

              {extractedKeywords && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Extracted Keywords:</span>
                    <button
                      onClick={() => {
                        setExtractedKeywords("");
                        setUploadedFile(null);
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-sm text-green-300">{extractedKeywords}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 mb-6 overflow-hidden">
          <button
            onClick={() => setExpandedFilters(!expandedFilters)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white">Search & Filters</h2>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${expandedFilters ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedFilters && (
            <div className="px-6 pb-6 space-y-4">
          <div className="space-y-4">
            {/* Search Mode Toggle */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Search Mode:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSearchMode("keyword")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    searchMode === "keyword"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  Keyword
                </button>
                <button
                  onClick={() => setSearchMode("semantic")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    searchMode === "semantic"
                      ? "bg-accent-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  AI Semantic
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="flex space-x-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={
                  searchMode === "semantic"
                    ? "Describe what you're looking for... (AI will find similar content)"
                    : selectedTable 
                      ? `Search within ${AVAILABLE_TABLES.find(t => t.name === selectedTable)?.displayName}...`
                      : "Search across ALL tables... (or select a table first)"
                }
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 disabled:opacity-50 text-white rounded-lg transition-all font-medium"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>


            {/* Clear Filters */}
            {(searchQuery || sortColumn || selectedTable || extractedKeywords) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Results Info */}
        {selectedTable && !isLoading && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-4">
            <div className="flex items-center justify-between text-sm text-gray-400 flex-wrap gap-3">
              <div>
                Showing {((currentPage - 1) * ROWS_PER_PAGE) + 1} - {Math.min(currentPage * ROWS_PER_PAGE, totalRows)} of {totalRows} records
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Results per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
                {sortColumn && (
                  <div>
                    Sorted by: <span className="text-white">{sortColumn}</span> ({sortDirection})
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Table Display */}
        {isLoading ? (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <svg className="w-12 h-12 text-primary-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-400">Loading data...</span>
            </div>
          </div>
        ) : tableData.length > 0 ? (
          <>
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden mb-8">
              <div className="overflow-x-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table className="w-full min-w-max">
                  <thead className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
                    <tr>
                      {/* Show source table column if searching across multiple tables */}
                      {!selectedTable && tableData.some(row => row._source_table) && (
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                          Source Table
                        </th>
                      )}
                      {columns.filter(col => col !== 'id' && col !== '_source_table').slice(0, 7).map((column) => (
                        <th
                          key={column}
                          onClick={() => handleSort(column)}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-750 transition-colors whitespace-nowrap"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{column.replace(/_/g, ' ')}</span>
                            {sortColumn === column && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                {sortDirection === "asc" ? (
                                  <path d="M5 10l5-5 5 5H5z" />
                                ) : (
                                  <path d="M15 10l-5 5-5-5h10z" />
                                )}
                              </svg>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {tableData.map((row, idx) => (
                      <>
                        <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                          {/* Show source table if searching across multiple tables */}
                          {!selectedTable && row._source_table && (
                            <td className="px-4 py-3 text-xs whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-900/30 text-primary-300 border border-primary-700/50">
                                {row._source_table.replace(/_/g, ' ')}
                              </span>
                            </td>
                          )}
                          {columns.filter(col => col !== 'id' && col !== '_source_table').slice(0, 7).map((column) => (
                            <td key={column} className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                              <div className="max-w-xs overflow-hidden text-ellipsis" title={String(row[column] || '')}>
                                {row[column] !== null && row[column] !== undefined
                                  ? String(row[column]).substring(0, 100)
                                  : '-'}
                              </div>
                            </td>
                          ))}
                          <td className="px-4 py-3 text-sm space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => toggleRowExpansion(row.id)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {expandedRow === row.id ? 'Collapse' : 'Expand'}
                            </button>
                            <button
                              onClick={() => handleFindSimilar(row)}
                              disabled={findingSimilar === row.id}
                              className="text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
                            >
                              {findingSimilar === row.id ? 'Finding...' : 'Find Similar'}
                            </button>
                            <button
                              onClick={() => setSelectedRecord(row)}
                              className="text-primary-400 hover:text-primary-300 transition-colors"
                            >
                              Modal
                            </button>
                          </td>
                        </tr>
                      {/* Expanded Row Details */}
                      {expandedRow === row.id && (
                        <tr className="bg-gray-800/30">
                          <td colSpan={!selectedTable && row._source_table ? 9 : 8} className="px-4 py-4">
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                {columns.filter(col => col !== 'id' && col !== '_source_table').map((column) => (
                                  <div key={column} className="border-b border-gray-700 pb-2">
                                    <dt className="text-xs font-medium text-gray-400 uppercase mb-1">
                                      {column.replace(/_/g, ' ')}
                                    </dt>
                                    <dd className="text-sm text-gray-200">
                                      {row[column] !== null && row[column] !== undefined ? String(row[column]) : '-'}
                                    </dd>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Similar Records Section */}
                              {similarRecords && similarRecords.length > 0 && (
                                <div className="mt-4 border-t border-gray-700 pt-4">
                                  <h4 className="text-sm font-semibold text-green-400 mb-3">
                                    Similar Records ({similarRecords.length}):
                                  </h4>
                                  <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {similarRecords.map((similar, sidx) => (
                                      <div key={sidx} className="bg-gray-900 border border-gray-700 rounded p-3">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            {columns.slice(0, 3).map((col) => (
                                              <div key={col} className="text-xs text-gray-400 truncate">
                                                <strong>{col}:</strong> {String(similar[col] || '-').substring(0, 100)}
                                              </div>
                                            ))}
                                          </div>
                                          {similar._similarity && (
                                            <span className="ml-2 px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded">
                                              {Math.round(similar._similarity * 100)}% match
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : selectedTable && !isLoading ? (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-400">No data found</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400">Select a data source to begin browsing</p>
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-semibold text-white">Record Details</h2>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <dl className="space-y-4">
                {Object.entries(selectedRecord).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-800 pb-3">
                    <dt className="text-sm font-medium text-gray-400 uppercase mb-1">
                      {key.replace(/_/g, ' ')}
                    </dt>
                    <dd className="text-base text-gray-200 whitespace-pre-wrap break-words">
                      {value !== null && value !== undefined ? String(value) : '-'}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="p-6 border-t border-gray-800">
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

