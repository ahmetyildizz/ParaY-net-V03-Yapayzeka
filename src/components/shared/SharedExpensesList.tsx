import React from 'react';
import { Users, DollarSign, Clock, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { SharedExpense } from '../../types';

interface SharedExpensesListProps {
  sharedExpenses: SharedExpense[];
  onSettle: (expenseId: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount);
};

const SharedExpensesList: React.FC<SharedExpensesListProps> = ({ sharedExpenses, onSettle }) => {
  return (
    <div className="space-y-6">
      {sharedExpenses.map((expense) => (
        <div key={expense.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">
                  {expense.participants.length} Katılımcı
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(expense.totalAmount)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                expense.settledDate 
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {expense.settledDate ? 'Tamamlandı' : 'Bekliyor'}
              </span>
              {expense.settledDate && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>{format(new Date(expense.settledDate), 'd MMMM yyyy', { locale: tr })}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {expense.participants.map((participant, index) => (
              <div key={participant.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {participant.userId.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Kullanıcı {participant.userId}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(participant.share)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {participant.status === 'accepted' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Onaylandı</span>
                    </span>
                  ) : participant.status === 'rejected' ? (
                    <span className="inline-flex items-center gap-1 text-red-600">
                      <X className="w-4 h-4" />
                      <span className="text-sm">Reddedildi</span>
                    </span>
                  ) : (
                    <span className="text-sm text-amber-600">Bekliyor</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!expense.settledDate && (
            <div className="mt-6">
              <button
                onClick={() => onSettle(expense.id)}
                className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Ödemeyi Tamamla
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SharedExpensesList;