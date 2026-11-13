import type { FC } from 'react';
import type { Biomarker } from '../../data/mockReports';
import { Lightbulb, Info, CheckCircle2, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

interface BiomarkerCardProps {
  biomarker: Biomarker;
}

export const BiomarkerCard: FC<BiomarkerCardProps> = ({ biomarker }) => {
  const getStatusConfig = (status: Biomarker['status']) => {
    switch (status) {
      case 'Normal':
        return {
          badgeClass: 'bg-emerald-50 text-emerald-950 border-2 border-slate-900 shadow-xs',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />,
          label: 'WITHIN RANGE',
          borderAccent: 'border-l-emerald-500',
        };
      case 'Low':
        return {
          badgeClass: 'bg-blue-50 text-blue-950 border-2 border-slate-900 shadow-xs',
          icon: <ArrowDown className="w-3.5 h-3.5 text-blue-700 stroke-[2.5]" />,
          label: 'BELOW RANGE',
          borderAccent: 'border-l-blue-500',
        };
      case 'High':
        return {
          badgeClass: 'bg-red-50 text-red-950 border-2 border-slate-900 shadow-xs',
          icon: <ArrowUp className="w-3.5 h-3.5 text-red-700 stroke-[2.5]" />,
          label: 'ABOVE RANGE',
          borderAccent: 'border-l-red-500',
        };
      case 'Borderline':
        return {
          badgeClass: 'bg-amber-50 text-amber-950 border-2 border-slate-900 shadow-xs',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-700 stroke-[2.5]" />,
          label: 'BORDERLINE',
          borderAccent: 'border-l-amber-500',
        };
      case 'Unknown':
        return {
          badgeClass: 'bg-slate-100 text-slate-800 border-2 border-slate-900 shadow-xs',
          icon: <Info className="w-3.5 h-3.5 text-slate-600 stroke-[2.5]" />,
          label: 'NOT ASSESSED',
          borderAccent: 'border-l-slate-400',
        };
    }
  };

  const statusConfig = getStatusConfig(biomarker.status);

  return (
    <div
      className={`neon-white-card rounded-2xl border-2 border-slate-900 border-l-8 ${statusConfig.borderAccent} p-5 sm:p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Top Header: Name & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-100 pb-3">
        <div>
          <span className="text-[11px] font-black tracking-wider uppercase text-cyan-700 block mb-0.5">
            {biomarker.category}
          </span>
          <h4 className="black-neon-heading text-base sm:text-xl font-black">
            {biomarker.name}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase border ${statusConfig.badgeClass}`}
          >
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </span>
        </div>
      </div>

      {/* Values Box */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border-2 border-slate-900 text-xs shadow-xs">
        <div>
          <span className="text-slate-500 uppercase font-extrabold text-[10px] block mb-0.5">Your Lab Value</span>
          <span className="text-base sm:text-lg font-black text-black">
            {biomarker.value}{' '}
            <span className="text-xs font-black text-cyan-700">{biomarker.unit}</span>
          </span>
        </div>

        <div>
          <span className="text-slate-500 uppercase font-extrabold text-[10px] block mb-0.5">Reference Range</span>
          <span className="text-sm font-bold text-slate-800">
            {biomarker.reference_range}{' '}
            <span className="text-xs font-normal text-slate-500">{biomarker.unit}</span>
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="text-slate-500 uppercase font-extrabold text-[10px] block mb-0.5">Clinical Evaluation</span>
          <span className="text-sm font-black text-black uppercase">
            {biomarker.status === 'Normal' ? (
              <span className="text-emerald-700 font-extrabold">Optimal Range</span>
            ) : biomarker.status === 'Unknown' ? (
              <span className="text-slate-700 font-extrabold">Not assessed</span>
            ) : (
              <span className="text-amber-800 font-extrabold">{biomarker.status} Finding</span>
            )}
          </span>
        </div>
      </div>

      {/* Everyday Analogy Callout with Medical Cyan Accent */}
      <div className="p-4 rounded-xl bg-cyan-50/70 border-2 border-cyan-500/50 text-xs flex items-start gap-3 shadow-2xs">
        <div className="w-8 h-8 rounded-lg bg-black text-cyan-400 border-2 border-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
          <Lightbulb className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div>
          <strong className="font-black text-black block mb-0.5 text-xs uppercase tracking-wide">
            In Simple Words:
          </strong>
          <p className="text-slate-800 font-semibold leading-relaxed">{biomarker.analogy}</p>
        </div>
      </div>

      {/* Clinical Context */}
      <div className="text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-black text-black uppercase tracking-wide">
          <Info className="w-3.5 h-3.5 text-cyan-600 stroke-[2.5]" />
          <span>Clinical Context:</span>
        </div>
        <p className="text-slate-700 font-medium leading-relaxed pl-5">{biomarker.what_it_means}</p>
      </div>
    </div>
  );
};
