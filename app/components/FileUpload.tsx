"use client";

import { useState, useRef } from "react";
import { Upload, File, X, Loader2 } from "lucide-react";
import mixpanel from "mixpanel-browser";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function FileUpload({ onFilesSelected, onAnalyze, isAnalyzing }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const fileArray = Array.from(selectedFiles);
    const newFiles = [...files, ...fileArray];
    setFiles(newFiles);
    onFilesSelected(newFiles);
    
    // Track file upload event
    mixpanel.track("Files Selected", {
      file_count: fileArray.length,
      total_files: newFiles.length,
      file_types: fileArray.map(f => f.type || f.name.split('.').pop())
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
          dragActive
            ? "border-[#00ff88] bg-[#00ff88]/5"
            : "border-[#222222] hover:border-[#00ff88]/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          accept=".pdf,.txt,.md,.sol,.js,.ts,.py"
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="w-12 h-12 text-[#00ff88]" />
          <div className="text-center">
            <p className="text-white font-medium mb-1">
              Drag and drop files here, or click to select
            </p>
            <p className="text-[#888888] text-sm">
              Supports PDF, TXT, MD, and code files (.sol, .js, .ts, .py)
            </p>
          </div>
          <button
            onClick={handleButtonClick}
            className="px-6 py-2 bg-[#00ff88] text-black font-medium rounded hover:bg-[#00cc6a] transition-colors"
          >
            Select Files
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-white font-medium">Selected Files ({files.length})</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#111111] rounded border border-[#222222]"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <File className="w-5 h-5 text-[#00ff88] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{file.name}</p>
                    <p className="text-[#888888] text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 p-1 text-[#888888] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full mt-4 px-6 py-3 bg-[#00ff88] text-black font-semibold rounded-lg hover:bg-[#00cc6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Analyze Project</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
