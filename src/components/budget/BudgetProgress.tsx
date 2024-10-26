import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Budget } from '../../types';

interface BudgetProgressProps {
  budget: Budget;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budget }) => {
  // Simüle edilmiş harcama verisi - gerçek uygulamada API'den gelecek
  const spent = Math.random() * budget.amount;
  const percentage = (spent / budget.amount) * 100;
  const isOverBudget = spent > budget.amount;
  const isNearLimit = percentage >= 80;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{budget.categoryId}</h3>
        {isNearLimit && !isOverBudget && (
          <div className="flex items-center gap-1 text-amber-500">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-medium">Limite Yakın</span>
          </div>
        )}
        {isOverBudget && (
          <div className="flex items-center gap-1 text-red-500">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-medium">Limit Aşıldı</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Bütçe</span>
          <span className="font-medium">{formatCurrency(budget.amount)}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isOverBudget
                ? 'bg-red-500'
                : isNearLimit
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Harcanan: {formatCurrency(spent)}</span>
          <span className="text-gray-500">Kalan: {formatCurrency(Math.max(budget.amount - spent, 0))}</span>
        </div>

        <div className="text-xs text-gray-500 mt-2">
          {budget.period === 'monthly' ? 'Aylık Bütçe' : 'Yıllık Bütçe'}
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress;