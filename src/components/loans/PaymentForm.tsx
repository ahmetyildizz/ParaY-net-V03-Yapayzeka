import React, { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Calendar, AlertCircle } from 'lucide-react';
import type { Loan } from '../../types';

interface PaymentFormProps {
  loan: Loan;
  onSubmit: (paymentId: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ loan, onSubmit }) => {
  const [selectedPayment, setSelectedPayment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) {
      alert('Lütfen bir taksit seçin');
      return;
    }
    onSubmit(selectedPayment);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const unpaidPayments = loan.payments.filter(payment => !payment.isPaid);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-800">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">
            {loan.bankName} kredisi için {formatCurrency(loan.installmentAmount)} tutarında ödeme yapılacak
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Ödenecek Taksit</label>
        <div className="space-y-2">
          {unpaidPayments.map((payment) => (
            <label
              key={payment.id}
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedPayment === payment.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value={payment.id}
                  checked={selectedPayment === payment.id}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {format(new Date(payment.date), 'd MMMM yyyy', { locale: tr })}
                  </p>
                  <p className="text-sm text-gray-500">
                    Taksit #{payment.installmentNumber}
                  </p>
                </div>
              </div>
              <span className="font-medium text-gray-900">
                {formatCurrency(payment.amount)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={!selectedPayment}
          className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors h-11 ${
            selectedPayment
              ? 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Ödemeyi Tamamla
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;