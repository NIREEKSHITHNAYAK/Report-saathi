import type { FC } from 'react';
import { AlertTriangle, Stethoscope, ShieldAlert } from 'lucide-react';

export const EducationalDisclaimer: FC = () => {
  return (
    <aside
      id="educational-disclaimer"
      aria-label="Medical Educational Disclaimer"
      className="neon-white-card rounded-2xl p-4 sm:p-5 border-l-8 border-l-amber-500 border-2 border-slate-900 shadow-md"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border-2 border-slate-900 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
          <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="black-neon-heading text-sm sm:text-base font-black">
              Important Medical Disclaimer: Educational Tool Only
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase bg-amber-100 text-amber-950 border-1.5 border-slate-900 px-2.5 py-0.5 rounded-full">
              <ShieldAlert className="w-3 h-3 text-amber-700" />
              Not Medical Advice
            </span>
          </div>

          <p className="text-slate-700 font-medium">
            ReportSaathi is designed solely to translate clinical lab terminology into simple, everyday language so you can have more informed conversations with your healthcare provider. It{' '}
            <strong className="underline decoration-amber-500 decoration-2 text-black font-extrabold">
              does not provide medical diagnoses, clinical treatment plans, or prescriptions
            </strong>
            .
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px] sm:text-xs font-bold text-slate-800">
            <Stethoscope className="w-3.5 h-3.5 text-cyan-600 stroke-[2.5] flex-shrink-0" />
            <span>Always consult your licensed physician or qualified healthcare provider regarding personal lab results.</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
