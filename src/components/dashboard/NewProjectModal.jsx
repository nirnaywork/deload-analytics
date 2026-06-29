import { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, X, CheckCircle, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function NewProjectModal({ onClose, onCreate }) {
  const { currentUser } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [statusText, setStatusText] = useState('Parsing dataset...');
  const [createdProject, setCreatedProject] = useState(null);
  const inputRef = useRef(null);

  const statuses = [
    'Parsing dataset...',
    'Uploading to secure storage...',
    'Analyzing data schema...',
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
    const validTypes = ['text/csv', 'application/vnd.ms-excel'];
    const hasValidExtension = file.name.toLowerCase().endsWith('.csv');
    
    if (validTypes.includes(file.type) || hasValidExtension) {
      setError('');
      return true;
    } else {
      setError('Invalid file type. Please upload a CSV file.');
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
        if (!projectName.trim()) {
          setProjectName(file.name.replace(/\.[^/.]+$/, ""));
        }
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        if (!projectName.trim()) {
          setProjectName(file.name.replace(/\.[^/.]+$/, ""));
        }
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    if (!selectedFile || !projectName.trim()) return;
    
    setUploadState('processing');
    
    // Simulate rotating status text for UX
    let statusIndex = 0;
    const intervalId = setInterval(() => {
      statusIndex = (statusIndex + 1) % statuses.length;
      setStatusText(statuses[statusIndex]);
    }, 1500);

    try {
      // 1. Parse CSV Client Side
      const parsedData = await new Promise((resolve, reject) => {
        Papa.parse(selectedFile, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: resolve,
          error: reject
        });
      });

      const rows = parsedData.data;
      const headers = parsedData.meta.fields;
      
      // Calculate enriched schema summary
      const sampleRows = rows.slice(0, 10);
      
      const schemaSummary = {
        rowCount: rows.length,
        columnCount: headers.length,
        sampleData: sampleRows,
        columns: headers.map(header => {
          // Detect type by checking first non-null value
          let type = 'string';
          for(let i=0; i<Math.min(rows.length, 50); i++) {
            if (rows[i][header] !== null && rows[i][header] !== undefined) {
              type = typeof rows[i][header];
              break;
            }
          }
          
          let stats = {};
          if (type === 'number') {
            let min = Infinity;
            let max = -Infinity;
            let sum = 0;
            let count = 0;
            for (const row of rows) {
              const val = row[header];
              if (typeof val === 'number') {
                if (val < min) min = val;
                if (val > max) max = val;
                sum += val;
                count++;
              }
            }
            stats = {
              min: count > 0 ? min : null,
              max: count > 0 ? max : null,
              mean: count > 0 ? Number((sum / count).toFixed(2)) : null
            };
          } else {
            const uniqueValues = new Set();
            for (const row of rows) {
              if (row[header] !== null && row[header] !== undefined) {
                uniqueValues.add(String(row[header]));
              }
              if (uniqueValues.size > 100) break; // limit tracking for high cardinality
            }
            stats = { uniqueCount: uniqueValues.size > 100 ? '100+' : uniqueValues.size };
          }
          
          return { name: header, type, stats };
        })
      };

      // 2. Upload to Supabase Storage
      const filePath = `${currentUser.id}/${Date.now()}_${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('datasets')
        .upload(filePath, selectedFile);
        
      if (uploadError) throw new Error(`Storage error: ${uploadError.message}`);

      // 3. Create Project Record in Supabase
      const { data: projectData, error: dbError } = await supabase
        .from('projects')
        .insert({
          user_id: currentUser.id,
          name: projectName.trim(),
          file_name: selectedFile.name,
          file_path: filePath,
          file_size: selectedFile.size,
          schema_summary: schemaSummary
        })
        .select()
        .single();

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      clearInterval(intervalId);
      setCreatedProject({ ...projectData, rawData: rows }); // Pass rawData for immediate UI rendering
      setUploadState('success');
      
    } catch (err) {
      clearInterval(intervalId);
      setError(err.message);
      setUploadState('idle');
    }
  };

  const handleFinish = () => {
    onCreate(createdProject);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-scrim backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 transform transition-all relative">
        
        {uploadState === 'idle' && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-taupe hover:text-black rounded-full hover:bg-grey-light transition-colors"
            title="Back to Home"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {uploadState === 'idle' && (
          <div className="flex flex-col">
            <h2 className="font-serif text-3xl font-semibold mb-2 text-black">New Project</h2>
            <p className="text-taupe mb-8">Upload a CSV dataset to start analyzing.</p>

            <div className="mb-6">
              <label htmlFor="projectName" className="block text-sm font-medium text-black mb-2">
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Q3 Sales Data"
                className="w-full px-4 py-3 bg-grey-light border border-grey-light rounded-lg focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe text-sm text-black"
              />
            </div>

            <div
              className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${
                dragActive ? 'border-taupe bg-blush/20' : 'border-grey-light hover:border-taupe bg-grey-light'
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
                accept=".csv"
                onChange={handleChange}
              />
              
              {!selectedFile ? (
                <>
                  <UploadCloud className="w-10 h-10 text-taupe mb-3" />
                  <p className="text-black text-sm font-medium mb-1">Drag and drop your file here</p>
                  <p className="text-xs text-taupe mb-4">Supported formats: CSV</p>
                  <button 
                    onClick={() => inputRef.current.click()}
                    className="secondary-button !min-h-10 !py-2 !px-4 text-xs"
                  >
                    Browse files
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-md shadow-sm border border-grey-light w-full mb-2">
                    <FileSpreadsheet className="w-6 h-6 text-black" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">{selectedFile.name}</p>
                      <p className="text-xs text-taupe">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      className="p-1 text-taupe hover:text-black transition-colors"
                    >
                      <X className="w-4 h-4" />
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
                onClick={handleSubmit}
                disabled={!selectedFile || !projectName.trim()}
                className={`w-full primary-button ${(!selectedFile || !projectName.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Create Project
              </button>
            </div>
          </div>
        )}

        {uploadState === 'processing' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-black animate-spin mb-6" />
            <h3 className="font-serif text-2xl font-semibold mb-2">Analyzing your data...</h3>
            <p className="text-taupe transition-all duration-300">{statusText}</p>
            <div className="w-full bg-grey-light rounded-full h-1.5 mt-8 overflow-hidden">
              <div className="bg-black h-1.5 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        )}

        {uploadState === 'success' && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-blush rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>
            <h3 className="font-serif text-3xl font-semibold mb-3">Project created!</h3>
            <p className="text-taupe mb-8">"{projectName}" is ready for analysis.</p>
            <button
              onClick={handleFinish}
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
