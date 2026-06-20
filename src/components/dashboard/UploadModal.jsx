import { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, X, CheckCircle, Loader2 } from 'lucide-react';

export default function UploadModal({ onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [statusText, setStatusText] = useState('Checking for missing values...');
  const inputRef = useRef(null);

  const statuses = [
    'Checking for missing values...',
    'Correcting formatting...',
    'Detecting column types...',
    'Generating data summary...',
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (validTypes.includes(file.type) || hasValidExtension) {
      setError('');
      return true;
    } else {
      setError('Invalid file type. Please upload a CSV or XLSX file.');
      return false;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setUploadState('processing');
    
    // Simulate rotating status text
    let statusIndex = 0;
    const intervalId = setInterval(() => {
      statusIndex = (statusIndex + 1) % statuses.length;
      setStatusText(statuses[statusIndex]);
    }, 800);

    // Simulate processing delay
    setTimeout(() => {
      clearInterval(intervalId);
      setUploadState('success');
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-scrim backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 transform transition-all">
        {uploadState === 'idle' && (
          <div className="flex flex-col">
            <h2 className="font-serif text-3xl font-semibold mb-2 text-black">Let's get your data ready</h2>
            <p className="text-taupe mb-8">Upload a CSV or Excel file to begin analyzing your data with AI.</p>

            <div
              className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-colors ${
                dragActive ? 'border-taupe bg-blush/20' : 'border-gray-300 hover:border-taupe bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleChange}
              />
              
              {!selectedFile ? (
                <>
                  <UploadCloud className="w-12 h-12 text-taupe mb-4" />
                  <p className="text-black font-medium mb-1">Drag and drop your file here</p>
                  <p className="text-sm text-taupe mb-4">Supported formats: CSV, XLSX</p>
                  <button 
                    onClick={onButtonClick}
                    className="secondary-button !min-h-10 !py-2 !px-4"
                  >
                    Browse files
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center space-x-3 bg-white p-4 rounded-md shadow-sm border border-gray-200 w-full mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-black" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">{selectedFile.name}</p>
                      <p className="text-xs text-taupe">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      className="p-1 text-taupe hover:text-black transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="mt-3 text-sm font-medium text-red-600 notice-error p-2 rounded text-center">
                {error}
              </p>
            )}

            <div className="mt-8">
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`w-full primary-button ${!selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Upload & Analyze
              </button>
            </div>
          </div>
        )}

        {uploadState === 'processing' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-black animate-spin mb-6" />
            <h3 className="font-serif text-2xl font-semibold mb-2">Cleaning your data...</h3>
            <p className="text-taupe transition-all duration-300">{statusText}</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-8 overflow-hidden">
              <div className="bg-black h-1.5 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        )}

        {uploadState === 'success' && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-blush rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>
            <h3 className="font-serif text-3xl font-semibold mb-3">Your data is ready!</h3>
            <div className="flex space-x-4 mb-8 text-sm text-taupe bg-gray-50 px-6 py-3 rounded-md border border-gray-100">
              <span><strong>1,204</strong> rows</span>
              <span>•</span>
              <span><strong>8</strong> columns</span>
              <span>•</span>
              <span className="text-black"><strong>3</strong> issues auto-fixed</span>
            </div>
            <button
              onClick={() => onUploadComplete(selectedFile)}
              className="w-full primary-button"
            >
              Start Analyzing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
