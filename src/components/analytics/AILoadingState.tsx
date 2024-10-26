import React from 'react';
import { Brain } from 'lucide-react';

const AILoadingState: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-6 h-6 text-emerald-500 animate-pulse" />
        <h3 className="text-lg font-semibold">Yapay Zeka Analizi</h3>
      </div>
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Finansal verileriniz analiz ediliyor...</p>
        </div>
      </div>
    </div>
  );
};

export default AILoadingState;