import React, { useState, useEffect } from 'react';
import { Calendar, Building, Percent, CreditCard } from 'lucide-react';

interface LoanFormProps {
  onSubmit: (loan: {
    bankName: string;
    amount: number;
    installments: number;
    remainingInstallments: number;
    monthlyPayment: number;
    interestRate: number;
    startDate: string;
    nextPaymentDate: string;
    notes?: string;
  }) => void;
  initialValues?: {
    bankName: string;
    amount: number;
    installments: number;
    remainingInstallments: number;
    monthlyPayment: number;
    interestRate: number;
    startDate: string;
    nextPaymentDate: string;
    notes?: string;
  };
}

const banks = [
  'Ziraat Bankası',
  'İş Bankası',
  'Halkbank',
  'Vakıfbank',
  'Yapı Kredi',
  'Garanti BBVA',
  'Akbank',
  'QNB Finansbank',
  'Denizbank',
  'TEB'
];

const LoanForm: React.FC<LoanFormProps> = ({ onSubmit, initialValues }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    amount: '',
    installments: '',
    interestRate: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        bankName: initialValues.bankName,
        amount: initialValues.amount.toString(),
        installments: initialValues.installments.toString(),
        interestRate: initialValues.interestRate.toString(),
        startDate: initialValues.startDate,
        notes: initialValues.notes || ''
      });
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const installments = parseInt(formData.installments);
    const interestRate = parseFloat(formData.interestRate);

    if (!amount || !installments || !interestRate) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    // Basit faiz hesabı ile aylık taksit tutarını hesapla
    const monthlyInterest = interestRate / 100;
    const monthlyPayment = (amount * (monthlyInterest * Math.pow(1 + monthlyInterest, installments))) / 
                          (Math.pow(1 + monthlyInterest, installments) - 1);

    onSubmit({
      ...formData,
      amount,
      installments,
      remainingInstallments: initialValues ? initialValues.remainingInstallments : installments,
      monthlyPayment,
      interestRate,
      nextPaymentDate: initialValues ? initialValues.nextPaymentDate : formData.startDate
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Banka</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={formData.bankName}
            onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
            className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-11"
          >
            <option value="">Banka seçin</option>
            {banks.map(bank => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Kredi Tutarı</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-11"
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Taksit Sayısı</label>
        <input
          type="number"
          value={formData.installments}
          onChange={(e) => setFormData(prev => ({ ...prev, installments: e.target.value }))}
          className="focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md h-11"
          placeholder="12"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Faiz Oranı (%)</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Percent className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            step="0.01"
            value={formData.interestRate}
            onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
            className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-11"
            placeholder="1.89"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Notlar</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
          rows={3}
          placeholder="Kredi hakkında notlar..."
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors h-11"
      >
        {initialValues ? 'Krediyi Güncelle' : 'Kredi Ekle'}
      </button>
    </form>
  );
};

export default LoanForm;