import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Building, Calendar, AlertTriangle, Pencil, Trash2 } from 'lucide-react';

interface Loan {
  id: string;
  bankName: string;
  amount: number;
  installments: number;
  remainingInstallments: number;
  monthlyPayment: number;
  interestRate: number;
  startDate: string;
  nextPaymentDate: string;
  notes?: string;
}

interface LoanListProps {
  loans: Loan[];
  onPayment: (loanId: string) => void;
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
}

const LoanList: React.FC<LoanListProps> = ({ loans, onPayment, onEdit, onDelete }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const isPaymentDueSoon = (date: string) => {
    const paymentDate = new Date(date);
    const today = new Date();
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5 && diffDays >= 0;
  };

  const isPaymentOverdue = (date: string) => {
    const paymentDate = new Date(date);
    const today = new Date();
    return paymentDate < today;
  };

  return (
    <div className="space-y-6">
      {loans.map((loan) => (
        <div key={loan.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6 text-emerald-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">{loan.bankName}</h3>
                  <p className="text-sm text-gray-500">
                    {loan.notes || 'Kredi'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Kredi Tutarı</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(loan.amount)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(loan)}
                    className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"
                    title="Düzenle"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(loan)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Aylık Taksit</p>
                <p className="font-medium text-gray-900">{formatCurrency(loan.monthlyPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kalan Taksit</p>
                <p className="font-medium text-gray-900">{loan.remainingInstallments} / {loan.installments}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Faiz Oranı</p>
                <p className="font-medium text-gray-900">%{loan.interestRate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Başlangıç Tarihi</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(loan.startDate), 'd MMMM yyyy', { locale: tr })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Sonraki Ödeme: {format(new Date(loan.nextPaymentDate), 'd MMMM yyyy', { locale: tr })}
                </span>
                {isPaymentDueSoon(loan.nextPaymentDate) && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <AlertTriangle className="w-3 h-3" />
                    Yaklaşan Ödeme
                  </span>
                )}
                {isPaymentOverdue(loan.nextPaymentDate) && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertTriangle className="w-3 h-3" />
                    Gecikmiş Ödeme
                  </span>
                )}
              </div>
              <button
                onClick={() => onPayment(loan.id)}
                disabled={loan.remainingInstallments === 0}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  loan.remainingInstallments > 0
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loan.remainingInstallments > 0 ? 'Ödeme Yap' : 'Tamamlandı'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoanList;