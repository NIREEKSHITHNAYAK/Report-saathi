import { useState } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { LandingHero } from './components/landing/LandingHero';
import { UploadView } from './components/upload/UploadView';
import { ResultsView } from './components/results/ResultsView';
import { MOCK_REPORTS, type MockReport } from './data/mockReports';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'upload' | 'results'>('landing');
  const [activeReportKey, setActiveReportKey] = useState<string>('cbc');
  const [customFileName, setCustomFileName] = useState<string | undefined>(undefined);
  const [customReport, setCustomReport] = useState<MockReport | null>(null);

  const activeReport: MockReport = customReport || MOCK_REPORTS[activeReportKey] || MOCK_REPORTS.cbc;

  const handleOpenUpload = () => {
    setCurrentView('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSample = (sampleKey: string) => {
    setCustomReport(null);
    setActiveReportKey(sampleKey);
    setCustomFileName(undefined);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportLoaded = (reportKey: string, fileName?: string, reportData?: MockReport) => {
    if (reportData) {
      setCustomReport(reportData);
    } else {
      setCustomReport(null);
      setActiveReportKey(reportKey);
    }
    setCustomFileName(fileName);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans selection:bg-cyan-200 selection:text-black">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        hasActiveReport={Boolean(activeReport)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'landing' && (
          <LandingHero
            onOpenUpload={handleOpenUpload}
            onSelectSample={handleSelectSample}
          />
        )}

        {currentView === 'upload' && (
          <UploadView
            onReportLoaded={handleReportLoaded}
            onCancel={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'results' && (
          <ResultsView
            report={activeReport}
            customFileName={customFileName}
            onSwitchReport={(key) => handleSelectSample(key)}
            onUploadAnother={handleOpenUpload}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="neon-white-card border-t-2 border-slate-900/80 py-8 mt-auto shadow-[0_-5px_25px_rgba(14,165,233,0.1)]">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-700 space-y-2">
          <p className="font-extrabold text-black black-neon-text tracking-wide text-sm">
            ReportSaathi 🩺 Clinical Clarity • Empowering patients with simple, educational medical explanations.
          </p>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Educational medical health tool only. This service does not provide clinical diagnoses, medical treatments, or prescriptions. Consult a licensed physician for personal health inquiries.
          </p>
          <p className="text-slate-500 text-[11px] pt-2 font-semibold">
            © {new Date().getFullYear()} ReportSaathi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
