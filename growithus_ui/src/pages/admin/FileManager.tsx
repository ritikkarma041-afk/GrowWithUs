import React, { useState, useRef } from 'react';
import { Upload, File, FileText, Search, Filter, Download, Trash2, Eye, Calendar, ArrowUpDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface FileData {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  type: 'excel' | 'csv';
  data: any[][];
  headers: string[];
}

interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
}

const FileManager = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'viewer'>('upload');
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isUploading, setIsUploading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalSearch, setGlobalSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<{[key: string]: string}>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rowsPerPage = 50;

  const addNotification = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const parseFile = async (file: File): Promise<{ data: any[][], headers: string[] }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          
          if (file.name.endsWith('.csv')) {
            Papa.parse(data as string, {
              complete: (result) => {
                const headers = result.data[0] as string[];
                const rows = result.data.slice(1) as any[][];
                resolve({ data: rows, headers });
              },
              error: (error) => reject(error)
            });
          } else {
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
            const headers = jsonData[0] as string[];
            const rows = jsonData.slice(1);
            resolve({ data: rows, headers });
          }
        } catch (error) {
          reject(error);
        }
      };
      
      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  const handleFileUpload = async (uploadedFiles: FileList) => {
    setIsUploading(true);
    
    try {
      const newFiles: FileData[] = [];
      
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        
        if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
          addNotification('error', `${file.name} is not a supported file type`);
          continue;
        }
        
        const { data, headers } = await parseFile(file);
        
        const newFile: FileData = {
          id: Date.now().toString() + i,
          name: file.name,
          size: file.size,
          uploadDate: new Date(),
          type: file.name.endsWith('.csv') ? 'csv' : 'excel',
          data,
          headers
        };
        
        newFiles.push(newFile);
      }
      
      setFiles(prev => [...prev, ...newFiles]);
      addNotification('success', `Successfully uploaded ${newFiles.length} file(s)`);
      
    } catch (error) {
      addNotification('error', 'Error uploading files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    addNotification('success', 'File deleted successfully');
    setShowDeleteConfirm(null);
  };

  const getFilteredData = () => {
    if (!selectedFile) return [];
    
    return selectedFile.data.filter(row => {
      const matchesGlobalSearch = globalSearch === '' || 
        row.some((cell: any) => 
          cell?.toString().toLowerCase().includes(globalSearch.toLowerCase())
        );
      
      const matchesColumnFilters = Object.entries(columnFilters).every(([colIndex, filter]) => {
        if (!filter) return true;
        const cellValue = row[parseInt(colIndex)]?.toString().toLowerCase() || '';
        return cellValue.includes(filter.toLowerCase());
      });
      
      return matchesGlobalSearch && matchesColumnFilters;
    });
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this file? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => deleteFile(showDeleteConfirm)}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <File className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
            <p className="text-gray-600">Upload, manage and analyze your Excel & CSV files</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'upload'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Files</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'library'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <File className="w-4 h-4" />
            <span>File Library</span>
          </button>
          <button
            onClick={() => setActiveTab('viewer')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'viewer'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Data Viewer</span>
          </button>
        </div>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-600 mb-4">Support for Excel (.xlsx, .xls) and CSV files</p>
            {isUploading && (
              <div className="flex items-center justify-center space-x-2 text-emerald-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                <span>Processing files...</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".xlsx,.xls,.csv"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      {/* File Library Tab */}
      {activeTab === 'library' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="size">Sort by Size</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
              <p className="text-gray-600">Upload some Excel or CSV files to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      file.type === 'excel' ? 'bg-emerald-100' : 'bg-blue-100'
                    }`}>
                      {file.type === 'excel' ? (
                        <FileText className={`w-5 h-5 ${file.type === 'excel' ? 'text-emerald-600' : 'text-blue-600'}`} />
                      ) : (
                        <File className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      file.type === 'excel' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {file.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-1 truncate" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{formatFileSize(file.size)}</p>
                  <p className="text-sm text-gray-600 mb-1">{file.data.length} rows</p>
                  <p className="text-xs text-gray-500 mb-3">
                    {file.uploadDate.toLocaleDateString()}
                  </p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedFile(file);
                        setActiveTab('viewer');
                      }}
                      className="flex-1 bg-emerald-500 text-white py-1.5 px-3 rounded text-sm hover:bg-emerald-600 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(file.id)}
                      className="bg-red-500 text-white py-1.5 px-3 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Data Viewer Tab */}
      {activeTab === 'viewer' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          {!selectedFile ? (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No file selected</h3>
              <p className="text-gray-600">Select a file from the library to view its data</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedFile.name}
                </h3>
                <span className="text-sm text-gray-600">
                  {filteredData.length} of {selectedFile.data.length} rows
                </span>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search all data..."
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {selectedFile.headers.map((header, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="space-y-2">
                            <span>{header}</span>
                            <input
                              type="text"
                              placeholder="Filter..."
                              value={columnFilters[index] || ''}
                              onChange={(e) => setColumnFilters(prev => ({
                                ...prev,
                                [index]: e.target.value
                              }))}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cell || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * rowsPerPage) + 1} to{' '}
                    {Math.min(currentPage * rowsPerPage, filteredData.length)} of{' '}
                    {filteredData.length} rows
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                      {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileManager;
