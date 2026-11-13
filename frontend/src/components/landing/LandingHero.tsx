import type { FC } from 'react';
import { UploadCloud, Sparkles, BookOpen, Stethoscope, ArrowRight, ShieldCheck, HeartHandshake, Eye, CheckCircle2 } from 'lucide-react';
import { MOCK_REPORTS } from '../../data/mockReports';

interface LandingHeroProps {
  onOpenUpload: () => void;
  onSelectSample: (sampleKey: string) => void;
}

export const LandingHero: FC<LandingHeroProps> = ({ onOpenUpload, onSelectSample }) => {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Header White Neon Card */}
      <section className="neon-white-surface text-center max-w-3xl mx-auto space-y-6 p-8 sm:p-12 rounded-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 text-cyan-950 text-xs font-black tracking-wide border-2 border-slate-900 shadow-xs">
          <Sparkles className="w-4 h-4 text-cyan-600 animate-pulse" />
          <span>Clinical Clarity • Educational Medical Companion</span>
        </div>

        <h1 className="black-neon-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
          Understand your lab tests in{' '}
          <span className="underline decoration-cyan-500 decoration-4 underline-offset-8 text-black">
            plain, reassuring language.
          </span>
        </h1>

        <p className="text-slate-700 font-semibold text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Medical laboratory reports are filled with numbers, acronyms, and clinical reference ranges that can feel overwhelming. ReportSaathi decodes your biomarkers into everyday analogies so you walk into your doctor visit confident and informed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
          <button
            onClick={onOpenUpload}
            className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-extrabold text-white bg-black hover:bg-slate-900 border-2 border-black rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.35),0_0_12px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
          >
            <UploadCloud className="w-5 h-5 stroke-[2.5]" />
            <span>Upload Your Lab Report</span>
          </button>

          <button
            onClick={() => onSelectSample('cbc')}
            className="w-full sm:w-auto px-7 py-4 text-sm sm:text-base font-extrabold text-black bg-white hover:bg-slate-50 border-2 border-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4 text-cyan-600 stroke-[2.5]" />
            <span>Try Interactive Demo</span>
          </button>
        </div>

        {/* Fast Sample Selector Chips */}
        <div className="pt-4 flex flex-col items-center gap-2.5">
          <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
            Preview realistic clinical lab samples:
          </span>
          <div className="flex flex-wrap justify-center gap-2.5">
            {Object.entries(MOCK_REPORTS).map(([key, report]) => (
              <button
                key={key}
                onClick={() => onSelectSample(key)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-cyan-50 text-black font-extrabold text-xs border-2 border-slate-900 transition-all shadow-xs flex items-center gap-2 group"
              >
                <span>{report.title}</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Step Visual Pipeline */}
      <section className="neon-white-card rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
            <Stethoscope className="w-3.5 h-3.5" />
            Clinical Educational Standard
          </div>
          <h2 className="black-neon-heading text-2xl sm:text-3xl font-black">
            How ReportSaathi Works
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-semibold">
            A patient-first healthcare companion designed for clarity, safety, and empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-[0_4px_20px_rgba(14,165,233,0.08)] flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-black text-white border-2 border-cyan-400 flex items-center justify-center font-black text-xl mb-4 shadow-[0_0_12px_rgba(14,165,233,0.3)]">
                1
              </div>
              <h3 className="black-neon-heading text-base font-black mb-2">
                Upload Any Lab Document
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Accepts digital PDF lab files or camera photos of printed test sheets (PDF, JPG, PNG). Patient name and identifiers are automatically masked for privacy.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-slate-100 text-xs font-extrabold text-cyan-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>100% Private & Confidential</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-[0_4px_20px_rgba(14,165,233,0.08)] flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-black text-white border-2 border-cyan-400 flex items-center justify-center font-black text-xl mb-4 shadow-[0_0_12px_rgba(14,165,233,0.3)]">
                2
              </div>
              <h3 className="black-neon-heading text-base font-black mb-2">
                Plain English Translation
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Every biomarker (Hemoglobin, Platelets, Creatinine, Cholesterol) is demystified with clear, everyday analogies and explanations of where your value falls.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-slate-100 text-xs font-extrabold text-cyan-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              <span>Zero Confusing Jargon</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-[0_4px_20px_rgba(14,165,233,0.08)] flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-black text-white border-2 border-cyan-400 flex items-center justify-center font-black text-xl mb-4 shadow-[0_0_12px_rgba(14,165,233,0.3)]">
                3
              </div>
              <h3 className="black-neon-heading text-base font-black mb-2">
                Doctor Discussion Guide
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Receive targeted, thoughtful questions tailored to your specific findings so your doctor consultation is collaborative, clear, and productive.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-slate-100 text-xs font-extrabold text-cyan-700 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 stroke-[2.5]" />
              <span>Consultation Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="neon-white-surface rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 border-2 border-slate-900 text-cyan-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <HeartHandshake className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="black-neon-heading text-lg sm:text-xl font-black">
              Built for Patient Empowerment & Health Literacy
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
              Understanding your health numbers shouldn't require a medical degree. ReportSaathi empowers patients to be proactive partners in their own wellness journeys without diagnostic anxiety.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenUpload}
          className="flex-shrink-0 px-7 py-3.5 text-xs sm:text-sm font-extrabold text-white bg-black hover:bg-slate-900 border-2 border-black rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all"
        >
          Upload Your Report
        </button>
      </section>
    </div>
  );
};
