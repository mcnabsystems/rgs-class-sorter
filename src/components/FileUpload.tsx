import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  description: string;
  onFileLoad: (content: string) => void;
  isLoaded: boolean;
  recordCount?: number;
}

export function FileUpload({ label, description, onFileLoad, isLoaded, recordCount }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileName(file.name);
        onFileLoad(content);
      };
      reader.readAsText(file);
    }
  }, [onFileLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`upload-zone ${isDragging ? 'upload-zone-active' : ''} ${isLoaded ? 'border-success bg-success/5' : ''}`}
    >
      <div className="flex flex-col items-center gap-3">
        {isLoaded ? (
          <>
            <CheckCircle className="w-10 h-10 text-success" />
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{fileName}</span>
            </div>
            {recordCount !== undefined && (
              <span className="text-xs text-muted-foreground">
                {recordCount} records loaded
              </span>
            )}
          </>
        ) : (
          <>
            <Upload className="w-10 h-10 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">{label}</p>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Click or drag and drop a CSV file
            </p>
          </>
        )}
      </div>
    </div>
  );
}
