import { useState, type FC } from 'react';
import { FileText, ShieldCheck, RefreshCw, ArrowRight, Check, Copy } from 'lucide-react';
import type { ExtractionResponse } from '../../types/report';

interface ExtractedTextPreviewProps {
  extraction: ExtractionResponse;
  onReset: () => void;
  onProceedToAnalyze: (text: string) => void;
  isAnalyzing?: boolean;
}

export const ExtractedTextPreview: FC<ExtractedTextPreviewProps> = ({
  extraction,
  onReset,
  onProceedToAnalyze,
  isAnalyzing = false,
}) => {
  const [editableText, setEditableText] = useState(extraction.extracted_text);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodLabel =
    extraction.method === 'pdf_native'
      ? 'PDF Text Stream'
      : extraction.method === 'ocr_tesseract_pdf'
      ? 'Tesseract OCR (Scanned PDF)'
      : 'Tesseract OCR (Image)';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
      {/* Header bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <span>{extraction.filename}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Extracted
              </span>
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span>Method: <strong className="text-slate-700">{methodLabel}</strong></span>
              <span>•</span>
              <span>{extraction.page_count} page(s)</span>
              <span>•</span>
              <span>{editableText.length} characters</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            PII Redacted
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg text-xs flex items-center gap-1"
            title="Copy text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body / Editable preview */}
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Extracted Report Content (Review or correct any values if needed)
          </label>
          <textarea
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            rows={10}
            className="w-full font-mono text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent leading-relaxed"
            placeholder="Extracted laboratory test text will appear here..."
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Upload a different file
          </button>

          <button
            type="button"
            onClick={() => onProceedToAnalyze(editableText)}
            disabled={isAnalyzing || !editableText.trim()}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to AI Explanation (Phase 3)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
