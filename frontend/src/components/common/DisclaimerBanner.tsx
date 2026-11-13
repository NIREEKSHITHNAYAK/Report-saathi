import type { FC } from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: FC = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-900 leading-relaxed">
          <strong className="font-semibold text-amber-950">Educational Tool Only: </strong>
          ReportSaathi helps you understand laboratory terminology in simple, everyday language. It does{' '}
          <span className="underline decoration-amber-400 font-medium">not</span> provide medical diagnoses, treatment advice, or prescriptions. Always consult a qualified physician or healthcare provider for personal medical concerns.
        </div>
      </div>
    </div>
  );
};
