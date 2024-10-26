import React from 'react';
import { Download, Filter, Calendar } from 'lucide-react';
import type { Transaction } from '../../types';
import SpendingChart from './SpendingChart';
import CategoryBreakdown from './CategoryBreakdown';
import SpendingPatterns from './SpendingPatterns';

interface ReportingDashboardProps {
  transactions: Transaction[];
  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (start: string, end: string) => void;
}

const ReportingDashboard: React.FC<ReportingDashboardProps> = ({
  transactions,
  startDate,
  endDate,
  onDateRangeChange
}) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const handleExportData = () => {
    const csvContent = [
      ['Tarih', 'Tip', 'Kategori', 'Açıklama', 'Tutar'],
      ...transactions.map(t => [
        t.date,
        t.type === 'income' ? 'Gelir' : 'Gider',
        t.category,
        t.description,
        t.amount.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'finansal-rapor.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Kontrol Paneli */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onDateRangeChange?.(e.target.value, endDate || '')}
              className="border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onDateRangeChange?.(startDate || '', e.target.value)}
              className="border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
            <Filter className="w-4 h-4" />
            Filtrele
          </button>
        </div>
        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Raporu İndir
        </button>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Gelir</h3>
          <p className="text-2xl font-semibold text-emerald-600">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Gider</h3>
          <p className="text-2xl font-semibold text-red-600">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Net Durum</h3>
          <p className={`text-2xl font-semibold ${
            totalIncome - totalExpenses >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {formatCurrency(totalIncome - totalExpenses)}
          </p>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart transactions={transactions} />
        <CategoryBreakdown transactions={transactions} />
      </div>

      {/* Harcama Alışkanlıkları */}
      <SpendingPatterns transactions={transactions} />
    </div>
  );
};

export default ReportingDashboard;