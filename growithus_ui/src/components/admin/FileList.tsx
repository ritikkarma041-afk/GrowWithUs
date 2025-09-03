import React, { useState } from 'react';
import { Calendar, Search, Download, Trash2, Eye, FileSpreadsheet } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: 'csv' | 'xlsx';
  size: number;
  uploadDate: string;
  path: string;
}

interface FileListProps {
  files: UploadedFile[];
  onFileSelect: (file: UploadedFile) => void;
  onFileDelete: (fileId: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onFileSelect, onFileDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAndSortedFiles = React.useMemo(() => {
    let filtered = files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !selectedDate || 
        new Date(file.uploadDate).toISOString().split('T')[0] === selectedDate;
      return matchesSearch && matchesDate;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [files, searchTerm, selectedDate, sortBy, sortOrder]);

  const handleSort = (field: 'name' | 'date' | 'size') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="size-desc">Size (Largest)</option>
            <option value="size-asc">Size (Smallest)</option>
          </select>
        </div>
      </div>

      {/* File Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredAndSortedFiles.length} file{filteredAndSortedFiles.length !== 1 ? 's' : ''} found
        </p>
        
        {(searchTerm || selectedDate) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDate('');
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Files Grid */}
      {filteredAndSortedFiles.length === 0 ? (
        <div className="text-center py-12">
          <FileSpreadsheet className="mx-auto w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No files found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedFiles.map((file) => (
            <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    file.type === 'xlsx' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <FileSpreadsheet className={`w-5 h-5 ${
                      file.type === 'xlsx' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{file.name}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{formatDate(file.uploadDate)}</span>
                      <span className="uppercase font-medium">{file.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onFileSelect(file)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View data"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      // Mock download
                      console.log('Downloading:', file.name);
                    }}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onFileDelete(file.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;
