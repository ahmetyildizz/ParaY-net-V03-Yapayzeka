import React, { useState, useEffect } from 'react';
import { Brain, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import type { Transaction } from '../../types';
import { analyzeTransactions } from '../../services/aiService';
import AIAnalysisCard from './AIAnalysisCard';
import AIAnalysisList from './AIAnalysisList';
import AILoadingState from './AILoadingState';

interface AIFinancialAnalysisProps {
  transactions: Transaction[];
}

interface AIAnalysis {
  summary: string;
  recommendations: string[];
  trends: string[];
  alerts: string[];
}

const AIFinancialAnalysis: React.FC<AIFinancialAnalysisProps> = ({ transactions }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (transactions.length === 0) return;

      setLoading(true);
      setError(null);
      
      try {
        const result = await analyzeTransactions(transactions);
        setAnalysis(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Analiz yapılırken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [transactions]);

  if (loading) {
    return <AILoadingState />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold">Hata</h3>
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-emerald-500" />
        <h3 className="text-lg font-semibold">Yapay Zeka Analizi</h3>
      </div>

      <div className="space-y-6">
        <AIAnalysisCard
          title="Finansal Durum Özeti"
          icon={<Brain className="w-5 h-5 text-emerald-600" />}
        >
          <p>{analysis.summary}</p>
        </AIAnalysisCard>

        <AIAnalysisCard
          title="Öneriler"
          icon={<Lightbulb className="w-5 h-5 text-amber-600" />}
          variant="warning"
        >
          <AIAnalysisList 
            items={analysis.recommendations} 
            bulletColor="text-amber-500" 
          />
        </AIAnalysisCard>

        <AIAnalysisCard
          title="Tespit Edilen Trendler"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        >
          <AIAnalysisList 
            items={analysis.trends} 
            bulletColor="text-blue-500" 
          />
        </AIAnalysisCard>

        {analysis.alerts.length > 0 && (
          <AIAnalysisCard
            title="Dikkat Edilmesi Gerekenler"
            icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
            variant="error"
          >
            <AIAnalysisList 
              items={analysis.alerts} 
              bulletColor="text-red-500" 
            />
          </AIAnalysisCard>
        )}
      </div>
    </div>
  );
};

export default AIFinancialAnalysis;