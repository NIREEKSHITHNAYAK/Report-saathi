import { useState, type FC } from 'react';
import type { MockReport } from '../../data/mockReports';
import { MOCK_REPORTS } from '../../data/mockReports';
import { BiomarkerCard } from './BiomarkerCard';
import { DoctorQuestionsSection } from './DoctorQuestionsSection';
import { EducationalDisclaimer } from '../common/EducationalDisclaimer';
import {
  FileText,
  Printer,
  Upload,
  Calendar,
  User,
  Activity,
  HeartPulse,
  Sparkles,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface ResultsViewProps {
  report: MockReport;
  customFileName?: string;
  onSwitchReport: (reportKey: string) => void;
  onUploadAnother: () => void;
}

export const ResultsView: FC<ResultsViewProps> = ({
  report,
  customFileName,
  onSwitchReport,
  onUploadAnother,
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Attention' | 'Normal'>('All');

  const filteredBiomarkers = report.biomarkers.filter((b) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Attention') return ['High', 'Low', 'Borderline'].includes(b.status);
    if (statusFilter === 'Normal') return b.status === 'Normal';
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 py-4">
      {/* 1. Mandatory Educational Disclaimer */}
      <EducationalDisclaimer />

      {/* 2. Report Overview Header White Neon Card */}
      <section className="neon-white-surface rounded-3xl p-6 sm:p-8 space-y-6 border-2 border-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full bg-cyan-100 text-cyan-950 border-1.5 border-slate-900 shadow-xs">
                {customFileName ? 'Custom Upload Demo' : 'Verified Clinical Sample'}
              </span>
              <span className="text-xs text-slate-600 font-bold">
                Processed via ReportSaathi Educational Engine
              </span>
            </div>

            <h2 className="black-neon-heading text-2xl sm:text-4xl font-black">
              {report.title}
            </h2>

            {customFileName && (
              <p className="text-xs text-slate-700 flex items-center gap-1.5 font-bold">
                <FileText className="w-4 h-4 text-cyan-700 stroke-[2.5]" />
                <span>Source document: <strong className="underline decoration-cyan-500">{customFileName}</strong></span>
              </p>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl bg-white hover:bg-slate-50 text-black border-2 border-slate-900 shadow-xs transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onUploadAnother}
              className="px-4 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl bg-black hover:bg-slate-900 text-white border-2 border-black shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Upload New Report</span>
            </button>
          </div>
        </div>

        {/* Patient / Sample Metadata bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border-2 border-slate-900 shadow-xs">
          <div className="space-y-0.5">
            <span className="text-slate-500 flex items-center gap-1 uppercase font-bold text-[10px]">
              <User className="w-3.5 h-3.5 text-cyan-600" />
              Demographics
            </span>
            <span className="font-black text-black tracking-wide text-xs sm:text-sm">
              {report.patientInfo.age} • {report.patientInfo.gender}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 flex items-center gap-1 uppercase font-bold text-[10px]">
              <Calendar className="w-3.5 h-3.5 text-cyan-600" />
              Collection Date
            </span>
            <span className="font-black text-black tracking-wide text-xs sm:text-sm">{report.patientInfo.sampleDate}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 flex items-center gap-1 uppercase font-bold text-[10px]">
              <Activity className="w-3.5 h-3.5 text-cyan-600" />
              Sample Type
            </span>
            <span className="font-black text-black tracking-wide text-xs sm:text-sm">{report.patientInfo.sampleType}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 flex items-center gap-1 uppercase font-bold text-[10px]">
              <HeartPulse className="w-3.5 h-3.5 text-cyan-600" />
              Biomarkers Parsed
            </span>
            <span className="font-black text-cyan-700 tracking-wide text-xs sm:text-sm">
              {report.biomarkers.length} Lab Indicators
            </span>
          </div>
        </div>

        {/* Reassuring Layman Executive Summary */}
        <div className="p-5 rounded-2xl bg-cyan-50/70 border-2 border-cyan-500/40 space-y-2 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-700 stroke-[2.5]" />
            <h3 className="font-black tracking-wide text-black text-sm uppercase">Overall Health Context</h3>
          </div>
          <p className="text-slate-800 font-semibold text-sm leading-relaxed">{report.summary}</p>
        </div>
      </section>

      {/* 3. Biomarkers Section with Filter Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 neon-white-card p-4 sm:p-5 rounded-2xl border-2 border-slate-900">
          <div>
            <h3 className="black-neon-heading text-xl font-black">Extracted Lab Biomarkers</h3>
            <p className="text-slate-600 text-xs font-semibold">
              Each metric explained with an everyday analogy and safe clinical context.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border-2 border-slate-900 text-xs">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-wide transition-all ${
                statusFilter === 'All'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              All ({report.biomarkers.length})
            </button>

            <button
              onClick={() => setStatusFilter('Attention')}
              className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-wide transition-all ${
                statusFilter === 'Attention'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-red-700'
              }`}
            >
              Needs Attention ({report.keyHighlights.attentionCount})
            </button>

            <button
              onClick={() => setStatusFilter('Normal')}
              className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-wide transition-all ${
                statusFilter === 'Normal'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-700'
              }`}
            >
              Normal ({report.keyHighlights.normalCount})
            </button>
          </div>
        </div>

        {/* Empty filter state */}
        {filteredBiomarkers.length === 0 ? (
          <div className="neon-white-surface rounded-2xl p-8 text-center space-y-3 border-2 border-slate-900">
            <CheckCircle className="w-10 h-10 text-cyan-600 mx-auto stroke-[2.5]" />
            <h4 className="black-neon-heading font-black text-base">No Biomarkers In This Filter</h4>
            <p className="text-slate-600 text-xs max-w-sm mx-auto font-medium">
              There are no metrics matching "{statusFilter}". Reset the filter to view all indicators.
            </p>
            <button
              onClick={() => setStatusFilter('All')}
              className="text-xs font-extrabold text-cyan-700 hover:underline"
            >
              Show all biomarkers
            </button>
          </div>
        ) : (
          /* Biomarker cards list */
          <div className="grid grid-cols-1 gap-4">
            {filteredBiomarkers.map((b) => (
              <BiomarkerCard key={b.id} biomarker={b} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Questions for the Doctor */}
      <DoctorQuestionsSection questions={report.questionsForDoctor} />

      {/* 5. General Educational Wellness Tips */}
      <section className="neon-white-card rounded-3xl p-6 sm:p-8 space-y-4 border-2 border-slate-900">
        <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 border-2 border-slate-900 flex items-center justify-center shadow-xs">
            <HelpCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="black-neon-heading text-lg font-black">General Educational Wellness Tips</h3>
            <p className="text-slate-600 text-xs font-semibold">
              Evidence-based healthy habits you can discuss with your doctor.
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs sm:text-sm">
          {report.educationalTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border-1.5 border-slate-900/60 shadow-xs">
              <span className="w-6 h-6 rounded-full bg-black text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-slate-800 font-semibold leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. Switcher to other demo reports */}
      <div className="neon-white-surface rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs border-2 border-slate-900">
        <div>
          <span className="black-neon-heading font-black block text-sm">
            Want to see how other clinical lab reports look?
          </span>
          <span className="text-slate-600 font-medium text-xs">
            Compare complete blood counts, cholesterol profiles, or metabolic kidney/liver panels.
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(MOCK_REPORTS).map(([key, r]) => (
            <button
              key={key}
              onClick={() => onSwitchReport(key)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide border-2 transition-all shadow-xs ${
                report.id === key
                  ? 'bg-black text-white border-black shadow-[0_0_12px_rgba(0,0,0,0.3)]'
                  : 'bg-white text-black border-slate-900 hover:bg-cyan-50'
              }`}
            >
              {r.title.split('(')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
