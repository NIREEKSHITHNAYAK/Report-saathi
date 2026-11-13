import { useState, type FC } from 'react';
import type { DoctorQuestion } from '../../data/mockReports';
import { Stethoscope, Copy, Check, MessageSquare } from 'lucide-react';

interface DoctorQuestionsSectionProps {
  questions: DoctorQuestion[];
}

export const DoctorQuestionsSection: FC<DoctorQuestionsSectionProps> = ({ questions }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="neon-white-surface rounded-3xl p-6 sm:p-8 space-y-6 border-2 border-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-white border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(14,165,233,0.3)]">
            <Stethoscope className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="black-neon-heading text-lg sm:text-xl font-black">
              Questions to Ask Your Doctor
            </h3>
            <p className="text-slate-600 text-xs font-semibold">
              Clear, targeted conversation starters based on your report findings.
            </p>
          </div>
        </div>

        <span className="text-xs font-black tracking-wide uppercase px-3 py-1 rounded-full bg-cyan-50 text-cyan-950 border-1.5 border-slate-900 shadow-xs w-fit">
          {questions.length} Suggested Questions
        </span>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-cyan-50/40 border-2 border-slate-900 transition-all space-y-2.5 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0 stroke-[2.5]" />
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-cyan-800 block mb-0.5">
                    Topic: {q.topic}
                  </span>
                  <p className="black-neon-heading text-sm font-black leading-snug">
                    "{q.question}"
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(q.id, q.question)}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border-2 border-slate-900 text-black text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-xs transition-all flex-shrink-0"
                title="Copy to clipboard"
              >
                {copiedId === q.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-slate-700 text-xs pl-6 font-medium">
              <strong className="text-black font-extrabold">Why ask this: </strong>
              {q.context}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
