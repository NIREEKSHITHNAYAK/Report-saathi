import type { FC } from 'react';
import { ShieldCheck, HeartPulse } from 'lucide-react';

interface HeaderProps {
  backendOnline: boolean | null;
}

export const Header: FC<HeaderProps> = ({ backendOnline }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight">ReportSaathi</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                AI Health Companion
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Making your medical lab reports clear and simple
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
            <span
              className={`w-2 h-2 rounded-full ${
                backendOnline === true
                  ? 'bg-emerald-500 animate-pulse'
                  : backendOnline === false
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`}
            />
            <span className="font-medium">
              {backendOnline === true
                ? 'Backend Ready'
                : backendOnline === false
                ? 'Backend Disconnected'
                : 'Connecting...'}
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-1 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Private & Confidential</span>
          </div>
        </div>
      </div>
    </header>
  );
};
