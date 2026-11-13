import type { FC } from 'react';
import { HeartPulse, Upload, FileText, Info, Stethoscope } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'upload' | 'results';
  onNavigate: (view: 'landing' | 'upload' | 'results') => void;
  hasActiveReport: boolean;
}

export const Navbar: FC<NavbarProps> = ({ currentView, onNavigate, hasActiveReport }) => {
  return (
    <header className="neon-white-card sticky top-0 z-50 border-b-2 border-slate-900 shadow-[0_4px_25px_rgba(14,165,233,0.15)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-sky-500 flex items-center justify-center text-white border-2 border-slate-900 shadow-[0_0_15px_rgba(14,165,233,0.4)] group-hover:scale-105 transition-transform font-bold">
            <HeartPulse className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black text-black tracking-tight group-hover:text-cyan-700 transition-colors black-neon-heading">
                Report<span className="text-cyan-600">Saathi</span>
              </span>
              <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-900 border-1.5 border-slate-900 shadow-xs flex items-center gap-1">
                <Stethoscope className="w-3 h-3 text-cyan-600" />
                Medical AI
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-semibold hidden sm:block">
              Clinical lab reports translated into simple English
            </p>
          </div>
        </button>

        {/* Navigation items */}
        <nav className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm font-bold">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3.5 py-1.5 rounded-xl border-2 transition-all ${
              currentView === 'landing'
                ? 'bg-black text-white border-black shadow-[0_0_12px_rgba(0,0,0,0.3)]'
                : 'bg-white text-black border-slate-300 hover:border-black hover:bg-cyan-50/50'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('upload')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border-2 transition-all ${
              currentView === 'upload'
                ? 'bg-cyan-600 text-white border-black shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                : 'bg-white text-black border-slate-900 hover:bg-cyan-50 shadow-xs'
            }`}
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Report</span>
          </button>

          {hasActiveReport && (
            <button
              onClick={() => onNavigate('results')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border-2 transition-all ${
                currentView === 'results'
                  ? 'bg-black text-white border-black shadow-[0_0_12px_rgba(0,0,0,0.3)]'
                  : 'bg-cyan-50 text-cyan-950 border-cyan-700 hover:bg-cyan-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Results</span>
            </button>
          )}

          <a
            href="#disclaimer"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('educational-disclaimer');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-black font-semibold transition-colors"
          >
            <Info className="w-4 h-4 text-cyan-600" />
            <span>Disclaimer</span>
          </a>
        </nav>
      </div>
    </header>
  );
};
