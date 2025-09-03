import React, { useState, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { UploadCloud, File as FileIcon, Trash2, Search, ChevronDown, ChevronUp, X, CheckCircle, AlertTriangle } from 'lucide-react';

// Types
interface ParsedFile {
  id: string;
  name: string;
  size: number;
  type: 'excel' | 'csv';
  uploadDate: Date;
  data: any[];
  headers: string[];
}

interface Notification {
  id: number;
  type: 'success' | 'error';
  message: string;
}

const FileManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ParsedFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ParsedFile; direction: 'asc' | 'desc' } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  // Data Viewer State
  const [dataSearch, setDataSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [dataSortConfig, setDataSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 50;

  const addNotification = (type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const handleFileUpload = useCallback(async (uploadedFiles: FileList) => {
    setIsUploading(true);
    let successCount = 0;
    for (const file of Array.from(uploadedFiles)) {
      const fileType = file.name.endsWith('.csv') ? 'csv' : 'excel';
      if (fileType !== 'csv' && !file.name.match(/\.(xlsx|xls)$/)) {
        addNotification('error', `Unsupported file type: ${file.name}`);
        continue;
      }

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;
          let data: any[] = [];
          let headers: string[] = [];

          if (fileType === 'excel' && content) {
            const workbook = XLSX.read(content, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            headers = data.length > 0 ? data[0] : [];
            data = XLSX.utils.sheet_to_json(worksheet);
          } else if (fileType === 'csv' && content) {
            Papa.parse(content as string, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                data = results.data;
                headers = results.meta.fields || [];
              },
            });
          }

          setFiles(prev => [...prev, {
            id: `${Date.now()}-${file.name}`,
            name: file.name,
            size: file.size,
            type: fileType,
            uploadDate: new Date(),
            data,
            headers,
          }]);
          successCount++;
        };
        reader.readAsBinaryString(file);
      } catch (error) {
        addNotification('error', `Failed to process ${file.name}.`);
      }
    }
    
    setTimeout(() => {
      setIsUploading(false);
      if (successCount > 0) {
        addNotification('success', `${successCount} file(s) uploaded successfully!`);
        setActiveTab('library');
      }
    }, 1000); // Simulate upload time
  }, []);

  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
    setDeleteConfirmation(null);
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
    addNotification('success', 'File deleted successfully.');
  };

  const filteredFiles = useMemo(() => {
    let sortableFiles = [...files];
    if (sortConfig !== null) {
      sortableFiles.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableFiles.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [files, searchTerm, sortConfig]);

  // Data Viewer Logic
  const filteredData = useMemo(() => {
    if (!selectedFile) return [];
    
    let data = selectedFile.data;

    // Global search
    if (dataSearch) {
      data = data.filter(row => 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(dataSearch.toLowerCase())
        )
      );
    }

    // Column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        data = data.filter(row => 
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Sorting
    if (dataSortConfig) {
      data.sort((a, b) => {
        const aVal = a[dataSortConfig.key];
        const bVal = b[dataSortConfig.key];
        if (aVal < bVal) return dataSortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return dataSortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [selectedFile, dataSearch, columnFilters, dataSortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);

  const requestSort = (key: keyof ParsedFile) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const requestDataSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (dataSortConfig && dataSortConfig.key === key && dataSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setDataSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const UploadComponent = () => (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFileUpload(e.dataTransfer.files);
      }}
      className="mt-6 border-2 border-dashed border-emerald-300 rounded-lg p-12 text-center hover:border-emerald-400 transition-colors"
    >
      <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <UploadCloud className="h-8 w-8" />
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Drag & drop files here</p>
      <p className="mt-1 text-sm text-gray-500">or</p>
      <label htmlFor="file-upload" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer">
        Browse files
      </label>
      <input id="file-upload" type="file" className="hidden" multiple onChange={(e) => e.target.files && handleFileUpload(e.target.files)} accept=".csv, .xlsx, .xls" />
      <p className="mt-4 text-xs text-gray-400">Supported formats: CSV, XLSX, XLS</p>
      {isUploading && <p className="mt-4 text-emerald-600 animate-pulse">Processing files...</p>}
    </div>
  );

  const LibraryComponent = () => (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFiles.map(file => (
          <div key={file.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-center mb-3">
                <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${file.type === 'excel' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  <FileIcon className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800 truncate" title={file.name}>{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Uploaded: {file.uploadDate.toLocaleDateString()}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setDeleteConfirmation(file.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
              <button onClick={() => setSelectedFile(file)} className="px-3 py-1 text-sm font-semibold text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredFiles.length === 0 && <p className="text-center text-gray-500 mt-8">No files found. Try uploading some!</p>}
    </div>
  );

  const DataViewerComponent = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        <header className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 truncate">{selectedFile?.name}</h3>
          <button onClick={() => setSelectedFile(null)} className="p-2 rounded-full hover:bg-gray-200">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </header>
        <div className="p-4 flex-shrink-0">
          <input
            type="text"
            placeholder="Search all columns..."
            value={dataSearch}
            onChange={(e) => { setDataSearch(e.target.value); setCurrentPage(1); }}
            className="w-full max-w-sm pl-4 pr-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {selectedFile?.headers.map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-between">
                      <span className="flex-1 truncate">{header}</span>
                      <button onClick={() => requestDataSort(header)} className="ml-2">
                        {dataSortConfig?.key === header ? (dataSortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />) : <ChevronDown className="h-4 w-4 text-gray-300" />}
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Filter..."
                      value={columnFilters[header] || ''}
                      onChange={(e) => {
                        setColumnFilters(prev => ({ ...prev, [header]: e.target.value }));
                        setCurrentPage(1);
                      }}
                      className="mt-1 w-full text-sm border-gray-300 rounded-md"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {selectedFile?.headers.map(header => (
                    <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 truncate max-w-xs">{String(row[header] ?? '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-600">Showing {paginatedData.length} of {filteredData.length} results</p>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-md disabled:opacity-50">Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
          </div>
        </footer>
      </div>
    </div>
  );

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => setActiveTab('upload')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upload' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Upload Files
          </button>
          <button onClick={() => setActiveTab('library')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'library' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            File Library
          </button>
        </nav>
      </div>

      {activeTab === 'upload' && <UploadComponent />}
      {activeTab === 'library' && <LibraryComponent />}
      {selectedFile && <DataViewerComponent />}

      {/* Notifications */}
      <div className="fixed top-20 right-5 z-[70] space-y-3">
        {notifications.map(n => (
          <div key={n.id} className={`flex items-center p-4 rounded-lg shadow-lg text-white ${n.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
            {n.type === 'success' ? <CheckCircle className="h-6 w-6 mr-3" /> : <AlertTriangle className="h-6 w-6 mr-3" />}
            {n.message}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[70] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Delete File</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Are you sure you want to delete this file? This action cannot be undone.</p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button onClick={() => handleDeleteFile(deleteConfirmation)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">
                Delete
              </button>
              <button onClick={() => setDeleteConfirmation(null)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
