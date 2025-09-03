import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface UploadedFile {
  id: string;
  name: string;
  type: 'csv' | 'xlsx';
  size: number;
  uploadDate: string;
  path: string;
}

interface DataViewerProps {
  file: UploadedFile;
}

interface TableData {
  headers: string[];
  rows: any[][];
}

const DataViewer: React.FC<DataViewerProps> = ({ file }) => {
  const [data, setData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Mock data generation for demo purposes
  useEffect(() => {
    const generateMockData = () => {
      setLoading(true);
      
      // Simulate different data structures based on file name
      let headers: string[];
      let rows: any[][];

      if (file.name.includes('trading')) {
        headers = ['Date', 'Symbol', 'Price', 'Volume', 'Change %', 'Market Cap', 'Sector'];
        rows = Array.from({ length: 500 }, (_, i) => [
          new Date(2025, 0, Math.floor(i / 10) + 1).toISOString().split('T')[0],
          ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'][i % 6],
          (Math.random() * 500 + 100).toFixed(2),
          Math.floor(Math.random() * 1000000),
          (Math.random() * 10 - 5).toFixed(2),
          `${(Math.random() * 1000 + 100).toFixed(1)}B`,
          ['Technology', 'Healthcare', 'Finance', 'Energy'][i % 4]
        ]);
      } else if (file.name.includes('portfolio')) {
        headers = ['User ID', 'Asset', 'Quantity', 'Purchase Price', 'Current Price', 'P&L', 'Allocation %'];
        rows = Array.from({ length: 300 }, (_, i) => [
          `USER_${1000 + i}`,
          ['Bitcoin', 'Ethereum', 'Apple Stock', 'Tesla Stock', 'Google Stock'][i % 5],
          (Math.random() * 100).toFixed(4),
          (Math.random() * 1000 + 50).toFixed(2),
          (Math.random() * 1200 + 60).toFixed(2),
          (Math.random() * 200 - 100).toFixed(2),
          (Math.random() * 30).toFixed(1)
        ]);
      } else {
        headers = ['Transaction ID', 'User', 'Type', 'Amount', 'Currency', 'Status', 'Date'];
        rows = Array.from({ length: 800 }, (_, i) => [
          `TXN_${10000 + i}`,
          `user${Math.floor(Math.random() * 100) + 1}@example.com`,
          ['Buy', 'Sell', 'Deposit', 'Withdrawal'][i % 4],
          (Math.random() * 10000).toFixed(2),
          ['USD', 'EUR', 'BTC', 'ETH'][i % 4],
          ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
          new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString()
        ]);
      }

      setTimeout(() => {
        setData({ headers, rows });
        setLoading(false);
      }, 1000);
    };

    generateMockData();
  }, [file]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!data) return { headers: [], rows: [] };

    let filteredRows = data.rows.filter(row => {
      // Global search
      const globalMatch = searchTerm === '' || 
        row.some(cell => String(cell).toLowerCase().includes(searchTerm.toLowerCase()));

      // Column-specific filters
      const columnMatch = Object.entries(columnFilters).every(([columnName, filterValue]) => {
        if (!filterValue) return true;
        const columnIndex = data.headers.indexOf(columnName);
        if (columnIndex === -1) return true;
        return String(row[columnIndex]).toLowerCase().includes(filterValue.toLowerCase());
      });

      return globalMatch && columnMatch;
    });

    // Sort data
    if (sortColumn) {
      const columnIndex = data.headers.indexOf(sortColumn);
      if (columnIndex !== -1) {
        filteredRows.sort((a, b) => {
          const aVal = a[columnIndex];
          const bVal = b[columnIndex];
          
          // Try to parse as number first
          const aNum = parseFloat(String(aVal).replace(/[^0-9.-]/g, ''));
          const bNum = parseFloat(String(bVal).replace(/[^0-9.-]/g, ''));
          
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
          }
          
          // Fall back to string comparison
          const comparison = String(aVal).localeCompare(String(bVal));
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      }
    }

    return { headers: data.headers, rows: filteredRows };
  }, [data, searchTerm, columnFilters, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.rows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredAndSortedData.rows.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleColumnFilter = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
    setCurrentPage(1);
  };

  const exportData = () => {
    const csvContent = [
      filteredAndSortedData.headers.join(','),
      ...filteredAndSortedData.rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filtered_${file.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading file data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading file: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* File Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">File: {file.name}</h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Total Rows: {data.rows.length.toLocaleString()}</span>
          <span>Columns: {data.headers.length}</span>
          <span>Filtered: {filteredAndSortedData.rows.length.toLocaleString()}</span>
        </div>
      </div>

      {/* Search and Export */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search all columns..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
            <option value={200}>200 rows</option>
          </select>

          <button
            onClick={exportData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {data.headers.map((header, index) => (
                  <th key={index} className="px-4 py-3 text-left">
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSort(header)}
                        className="flex items-center space-x-1 text-xs font-medium text-gray-700 hover:text-gray-900"
                      >
                        <span>{header}</span>
                        {sortColumn === header && (
                          <span className="text-blue-500">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                      <input
                        type="text"
                        placeholder={`Filter ${header}...`}
                        value={columnFilters[header] || ''}
                        onChange={(e) => handleColumnFilter(header, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 text-sm text-gray-900">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredAndSortedData.rows.length)} of {filteredAndSortedData.rows.length} results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataViewer;
