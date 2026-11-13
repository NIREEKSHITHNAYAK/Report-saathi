import { useState, useRef, type FC, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloud, AlertCircle, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ExtractionResponse } from '../../types/report';
import { extractDocument } from '../../services/api';

interface FileDropzoneProps {
  onExtractionSuccess: (result: ExtractionResponse) => void;
  onSampleSelect: (sampleName: string) => void;
}

export const FileDropzone: FC<FileDropzoneProps> = ({ onExtractionSuccess, onSampleSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setSelectedFile(file);

    // Validate size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds 15MB limit. Please upload a smaller scan or image.');
      return;
    }

    // Validate extension
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !validExtensions.includes(ext)) {
      setErrorMessage('Invalid file format. Please upload a PDF or image (PNG, JPG, WEBP).');
      return;
    }

    try {
      setIsLoading(true);
      setLoadingStep('Uploading document securely...');
      await new Promise((r) => setTimeout(r, 400));

      setLoadingStep('Running OCR and extracting lab metrics...');
      const result = await extractDocument(file);

      setLoadingStep('Masking private patient data (PII)...');
      await new Promise((r) => setTimeout(r, 400));

      onExtractionSuccess(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while extracting text from the document.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/60 scale-[1.01]'
            : 'border-slate-300 hover:border-emerald-400 bg-white hover:bg-slate-50/50 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isLoading}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
              <Loader2 className="w-8 h-8 text-emerald-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-800">{loadingStep}</p>
              <p className="text-xs text-slate-500">
                Processing {selectedFile?.name} using Tesseract OCR & PDF text parser
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-100 text-emerald-700 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-900">
                Drop your lab report here, or <span className="text-emerald-600 hover:underline">browse files</span>
              </p>
              <p className="text-xs text-slate-500">
                Supports PDF, PNG, JPG, JPEG, WEBP (Scanned & Digital, Up to 15MB)
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Names & personal IDs are automatically masked for privacy
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Extraction issue</p>
            <p className="text-rose-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Quick Sample Reports for Easy Testing */}
      <div className="bg-slate-100/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-xs sm:text-sm">Don't have a report handy? Try a demo sample:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSampleSelect('cbc');
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs"
          >
            Complete Blood Count (CBC)
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSampleSelect('lipid');
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs"
          >
            Lipid Profile (Cholesterol)
          </button>
        </div>
      </div>
    </div>
  );
};
