import { useState, useRef, type FC, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloud, AlertCircle, Loader2, CheckCircle2, X, Sparkles, ArrowRight } from 'lucide-react';
import { MOCK_REPORTS, type MockReport } from '../../data/mockReports';
import { analyzeReport } from '../../services/api';
import type { ReportAnalyzeResponse } from '../../types/report';

interface UploadViewProps {
  onReportLoaded: (reportKey: string, customFileName?: string, customReportData?: MockReport) => void;
  onCancel: () => void;
}

export const UploadView: FC<UploadViewProps> = ({ onReportLoaded, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successFile, setSuccessFile] = useState<string | null>(null);
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
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = async (file: File) => {
    setError(null);
    setSuccessFile(null);

    // 1. Validate file extension
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !validExtensions.includes(ext)) {
      setError(`Unsupported file format ('.${ext || 'unknown'}'). Please upload a PDF, JPG, or PNG document.`);
      return;
    }

    // 2. Validate file size (10 MB)
    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File is too large (${fileSizeMB} MB). Maximum allowed file size is ${MAX_SIZE_MB} MB.`);
      return;
    }

    // 3. Send file to real Python FastAPI Backend
    setLoading(true);
    setSuccessFile(file.name);

    try {
      setLoadingStage('Uploading document to FastAPI backend...');
      await new Promise((r) => setTimeout(r, 300));

      setLoadingStage('Extracting text (PDF Stream & Tesseract OCR)...');
      const response: ReportAnalyzeResponse = await analyzeReport(file);

      setLoadingStage('Structuring biomarkers & generating plain-language insights...');
      await new Promise((r) => setTimeout(r, 300));

      // Transform backend response into presentation model
      const attentionBiomarkers = response.biomarkers.filter((b) => ['High', 'Low', 'Borderline'].includes(b.status));
      const normalBiomarkers = response.biomarkers.filter((b) => b.status === 'Normal');
      const unknownBiomarkers = response.biomarkers.filter((b) => b.status === 'Unknown');

      const customReport: MockReport = {
        id: `custom-${Date.now()}`,
        title: response.report_title || 'Laboratory Test Report',
        patientInfo: {
          age: 'Patient Demographics Redacted',
          gender: 'Confidential',
          sampleDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          sampleType: `${response.extraction_method.toUpperCase()} (${response.page_count} page)`,
        },
        summary: response.summary,
        keyHighlights: {
          attentionCount: attentionBiomarkers.length,
          normalCount: normalBiomarkers.length,
          headline: attentionBiomarkers.length > 0
            ? `${attentionBiomarkers.length} biomarker(s) flagged for doctor discussion.`
            : unknownBiomarkers.length > 0
            ? `Reference status could not be read for ${unknownBiomarkers.length} biomarker(s).`
            : normalBiomarkers.length > 0
            ? 'All classified biomarkers are within the report ranges or flags.'
            : 'No biomarker values could be classified from this report.',
        },
        biomarkers: response.biomarkers.map((b, idx) => ({
          id: `bm-${idx}`,
          name: b.name,
          category: 'Extracted Metrics',
          value: b.value,
          unit: b.unit || '',
          reference_range: b.reference_range || 'Not specified on report',
          status: b.status,
          analogy: b.plain_explanation,
          plain_explanation: b.plain_explanation,
          what_it_means: b.what_it_means,
        })),
        questionsForDoctor: response.questions_for_doctor.map((q, idx) => ({
          id: `q-${idx}`,
          topic: q.topic,
          question: q.question,
          context: q.context,
        })),
        educationalTips: response.lifestyle_tips.length > 0
          ? response.lifestyle_tips
          : [
              'Stay well-hydrated throughout the day.',
              'Discuss personalized dietary adjustments with your physician.',
              'Prioritize consistent restorative sleep and physical movement.',
            ],
      };

      onReportLoaded('custom', file.name, customReport);
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the document.');
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* View Header White Neon Card */}
      <div className="neon-white-surface text-center space-y-2 p-6 sm:p-8 rounded-3xl border-2 border-slate-900">
        <h2 className="black-neon-heading text-2xl sm:text-3xl font-black">
          Upload Laboratory Report
        </h2>
        <p className="text-slate-600 font-medium text-sm">
          Upload your blood test, cholesterol panel, or metabolic report in PDF, JPG, or PNG format.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="neon-white-card rounded-3xl p-6 sm:p-8 space-y-6 border-2 border-slate-900">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 ${
            loading
              ? 'border-cyan-500 bg-cyan-50/40 cursor-wait'
              : isDragging
              ? 'border-cyan-600 bg-cyan-100/50 scale-[1.01] cursor-pointer'
              : 'border-slate-400 hover:border-slate-900 bg-slate-50/70 hover:bg-cyan-50/30 cursor-pointer shadow-inner'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileInput}
            disabled={loading}
          />

          {loading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center space-y-4 py-2">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-black animate-spin" />
                <Loader2 className="w-8 h-8 text-black absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <p className="black-neon-heading text-base font-black">{loadingStage}</p>
                <p className="text-xs text-slate-600 font-semibold">
                  Processing <span className="underline decoration-2 font-black">{successFile}</span> via FastAPI & Tesseract OCR
                </p>
              </div>
            </div>
          ) : (
            /* Idle / Empty State */
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-black text-cyan-400 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <UploadCloud className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <p className="black-neon-heading text-base sm:text-lg font-black">
                  Drag and drop your report here, or{' '}
                  <span className="underline decoration-cyan-500 decoration-2 underline-offset-4 cursor-pointer text-cyan-700">
                    browse files
                  </span>
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  Accepted formats: <strong className="text-black">PDF, JPG, PNG</strong> (Max size: <strong className="text-black">10 MB</strong>)
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-50 text-cyan-950 border-1.5 border-slate-900 text-[11px] font-black uppercase shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 stroke-[2.5]" />
                Patient name & identifiers are masked for confidentiality
              </div>
            </div>
          )}
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border-2 border-red-500 text-red-900 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-md animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-black uppercase tracking-wider">File Processing Issue</p>
                <p className="text-red-800 mt-0.5 font-semibold">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-black p-1 rounded-md"
              title="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Realistic Demo Shortcut Buttons */}
        <div className="pt-2 border-t-2 border-slate-100 space-y-3">
          <div className="flex items-center gap-2 font-black text-xs text-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>Don't have a file ready? Load a clinical sample report:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {Object.entries(MOCK_REPORTS).map(([key, report]) => (
              <button
                key={key}
                type="button"
                onClick={() => onReportLoaded(key)}
                className="p-3.5 text-left rounded-xl bg-white hover:bg-cyan-50/70 text-black border-2 border-slate-900 transition-all text-xs group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between font-black tracking-wide uppercase mb-1">
                  <span className="truncate">{report.title.split('(')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 font-medium">
                  {report.keyHighlights.headline}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cancel button */}
      <div className="text-center">
        <button
          onClick={onCancel}
          className="text-xs font-bold text-slate-600 hover:text-black underline underline-offset-4"
        >
          Cancel and return to home
        </button>
      </div>
    </div>
  );
};
