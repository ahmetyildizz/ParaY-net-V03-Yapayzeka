import React from 'react';
import { Calendar, TrendingUp, RepeatIcon } from 'lucide-react';
import type { Transaction } from '../../types';
import { TransactionClassifier } from '../../utils/transactionClassifier';

interface SpendingPatternsProps {
  transactions: Transaction[];
}

const SpendingPatterns: React.FC<SpendingPatternsProps> = ({ transactions }) => {
  const classifier = TransactionClassifier.getInstance();
  const patterns = classifier.analyzeSpendingPatterns(transactions);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-6">Harcama Alışkanlıkları</h3>

      <div className="space-y-6">
        {/* En Sık Kategoriler */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            <TrendingUp className="w-4 h-4 inline-block mr-2" />
            En Sık Kullanılan Kategoriler
          </h4>
          <div className="space-y-2">
            {patterns.frequentCategories.map(({ category, count }) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{category}</span>
                <span className="text-sm font-medium">{count} işlem</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ortalama Tutarlar */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            <Calendar className="w-4 h-4 inline-block mr-2" />
            Kategori Bazında Ortalama Tutarlar
          </h4>
          <div className="space-y-2">
            {patterns.averageAmounts.map(({ category, amount }) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{category}</span>
                <span className="text-sm font-medium">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Periyodik İşlemler */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            <RepeatIcon className="w-4 h-4 inline-block mr-2" />
            Düzenli İşlemler
          </h4>
          <div className="space-y-2">
            {patterns.periodicTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{transaction.description}</span>
                <span className="text-sm font-medium">{formatCurrency(transaction.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingPatterns;