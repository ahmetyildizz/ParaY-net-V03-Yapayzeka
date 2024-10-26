import React, { useState } from 'react';
import { Calendar, ArrowLeft, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Brain } from 'lucide-react';
import SpendingChart from '../components/analytics/SpendingChart';
import CategoryBreakdown from '../components/analytics/CategoryBreakdown';
import AIFinancialAnalysis from '../components/analytics/AIFinancialAnalysis';
import type { Transaction } from '../types';

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Finansal Analiz</h1>
          <p className="text-gray-600">Gelir, gider ve yatırımlarınızın detaylı analizi</p>
        </div>

        {/* Dönem Seçici */}
        <div className="bg-white rounded-lg p-4 mb-8 flex items-center justify-between shadow-sm">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm font-medium text-gray-700 border-0 focus:ring-0"
            >
              <option value="week">Bu Hafta</option>
              <option value="month">Bu Ay</option>
              <option value="quarter">Bu Çeyrek</option>
              <option value="year">Bu Yıl</option>
            </select>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h3 className="font-medium">Toplam Gelir</h3>
            </div>
            <p className="text-2xl font-semibold text-emerald-600">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <h3 className="font-medium">Toplam Gider</h3>
            </div>
            <p className="text-2xl font-semibold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium">Net Durum</h3>
            </div>
            <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        {/* AI Analizi */}
        <div className="mb-8">
          <AIFinancialAnalysis transactions={transactions} />
        </div>

        {/* Grafikler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpendingChart transactions={transactions} />
          <CategoryBreakdown transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;