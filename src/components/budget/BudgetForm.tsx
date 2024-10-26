import React, { useState } from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import type { Budget } from '../../types';

interface BudgetFormProps {
  onSubmit: (budget: Omit<Budget, 'id' | 'userId'>) => void;
  initialValues?: Partial<Budget>;
}

const categories = [
  'Market',
  'Kira',
  'Faturalar',
  'Ulaşım',
  'Eğlence',
  'Sağlık',
  'Eğitim',
  'Diğer'
];

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit, initialValues }) => {
  const [formData, setFormData] = useState({
    categoryId: initialValues?.categoryId || '',
    amount: initialValues?.amount || '',
    period: initialValues?.period || 'monthly',
    startDate: initialValues?.startDate || new Date().toISOString().split('T')[0],
    alerts: initialValues?.alerts || [{ threshold: 80, type: 'percentage' as const }]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount.toString());
    if (!amount || amount <= 0) {
      alert('Lütfen geçerli bir tutar giriniz');
      return;
    }
    if (!formData.categoryId) {
      alert('Lütfen bir kategori seçiniz');
      return;
    }
    onSubmit({
      ...formData,
      amount
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Kategori</label>
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
          className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md h-11"
        >
          <option value="">Kategori seçin</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Bütçe Tutarı</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">₺</span>
          </div>
          <input
            type="text"
            inputMode="decimal"
            value={formData.amount}
            onChange={handleAmountChange}
            className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md h-11"
            placeholder="0,00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Periyot</label>
        <select
          value={formData.period}
          onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as 'monthly' | 'yearly' }))}
          className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md h-11"
        >
          <option value="monthly">Aylık</option>
          <option value="yearly">Yıllık</option>
        </select>
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

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors h-11"
        >
          Bütçe Oluştur
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;