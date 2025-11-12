"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Link from "next/link";

export default function SharedKnowledgeBasePage() {
  const params = useParams();
  const router = useRouter();
  const shareId = params?.shareId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareConfig, setShareConfig] = useState<any>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Drag to scroll
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (shareId) {
      loadSharedView();
    }
  }, [shareId, currentPage]);

  const loadSharedView = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First, get the share configuration
      const configResponse = await fetch(`/api/matrix/knowledge-base/shared/${shareId}`);
      
      if (!configResponse.ok) {
        throw new Error("Share link not found or expired");
      }

      const config = await configResponse.json();
      setShareConfig(config);

      // Then load the data
      const params = new URLSearchParams({
        table: config.table_name,
        page: currentPage.toString(),
        limit: (config.page_size || 50).toString(),
      });

      if (config.search_query) {
        params.append("query", config.search_query);
      }
      if (config.sort_column) {
        params.append("sortColumn", config.sort_column);
        params.append("sortDirection", config.sort_direction || "asc");
      }

      const dataResponse = await fetch(`/api/matrix/knowledge-base/table?${params}`);
      
      if (!dataResponse.ok) {
        throw new Error("Failed to load data");
      }

      const data = await dataResponse.json();
      setTableData(data.data || []);
      setColumns(data.columns || []);
      setTotalRows(data.total || 0);
    } catch (error: any) {
      console.error("Error loading shared view:", error);
      setError(error.message || "Failed to load shared view");
    } finally {
      setIsLoading(false);
    }
  };

  // Drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableScrollRef.current) return;
    setIsDragging(true);
    setDragStart({ x: e.pageX, y: e.pageY });
    setScrollStart({
      x: tableScrollRef.current.scrollLeft,
      y: tableScrollRef.current.scrollTop,
    });
    tableScrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tableScrollRef.current) return;
    e.preventDefault();
    const dx = e.pageX - dragStart.x;
    const dy = e.pageY - dragStart.y;
    tableScrollRef.current.scrollLeft = scrollStart.x - dx;
    tableScrollRef.current.scrollTop = scrollStart.y - dy;
  };

  const handleMouseUp = () => {
    if (!tableScrollRef.current) return;
    setIsDragging(false);
    tableScrollRef.current.style.cursor = 'grab';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-white">Loading shared view...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0f1e]">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Shared View</h2>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const ROWS_PER_PAGE = shareConfig?.page_size || 50;

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Shared Knowledge Base View</h1>
              <p className="text-gray-400">View-only access • {shareConfig?.table_name?.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Limited Access - View Only</h3>
              <p className="text-gray-300 text-sm mb-3">
                You're viewing a shared data snapshot. To search, filter, and explore the full Knowledge Base, create an account.
              </p>
              <div className="flex space-x-3">
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Create Account
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div>
              Showing {((currentPage - 1) * ROWS_PER_PAGE) + 1} - {Math.min(currentPage * ROWS_PER_PAGE, totalRows)} of {totalRows} records
            </div>
            {shareConfig?.search_query && (
              <div className="text-gray-500">
                Filtered by: "{shareConfig.search_query}"
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        {tableData.length > 0 ? (
          <>
            <div 
              ref={tableScrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="bg-gray-900 rounded-lg border border-gray-800 overflow-auto mb-8 max-h-[70vh] cursor-grab"
            >
              <table className="w-full min-w-max">
                <thead className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
                  <tr>
                    {columns.filter(col => col !== 'id').slice(0, 7).map((column) => (
                      <th
                        key={column}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {column.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {tableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                      {columns.filter(col => col !== 'id').slice(0, 7).map((column) => (
                        <td key={column} className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                          <div className="max-w-xs overflow-hidden text-ellipsis" title={String(row[column] || '')}>
                            {row[column] !== null && row[column] !== undefined
                              ? String(row[column]).substring(0, 100)
                              : '-'}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalRows > ROWS_PER_PAGE && (
              <div className="flex items-center justify-center space-x-4 mb-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-400">
                  Page {currentPage} of {Math.ceil(totalRows / ROWS_PER_PAGE)}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalRows / ROWS_PER_PAGE), p + 1))}
                  disabled={currentPage >= Math.ceil(totalRows / ROWS_PER_PAGE)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
            <p className="text-gray-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

