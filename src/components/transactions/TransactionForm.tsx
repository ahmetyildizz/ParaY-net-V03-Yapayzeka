import React, { useState } from 'react';
import { Calendar, DollarSign, FileText, Tag } from 'lucide-react';
import type { Transaction } from '../../types';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  initialValues?: Partial<Transaction>;
  type?: 'income' | 'expense';
}

const categories = {
  income: ['Maaş', 'Serbest Çalışma', 'Yatırımlar', 'Diğer Gelirler'],
  expense: ['Yiyecek', 'Ulaşım', 'Alışveriş', 'Faturalar', 'Eğlence', 'Diğer']
};

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  initialValues,
  type = 'expense'
}) => {
  const [formData, setFormData] = useState({
    amount: initialValues?.amount || '',
    category: initialValues?.category || '',
    date: initialValues?.date || new Date().toISOString().split('T')[0],
    description: initialValues?.description || '',
    isShared: initialValues?.isShared || false,
    type: initialValues?.type || type,
    tags: initialValues?.tags || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount.toString());
    if (!amount || amount <= 0) {
      alert('Lütfen geçerli bir tutar giriniz');
      return;
    }
    if (!formData.category) {
      alert('Lütfen bir kategori seçiniz');
      return;
    }
    onSubmit({
      ...formData,
      amount
    } as Omit<Transaction, 'id' | 'userId'>);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and a single decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">İşlem Tipi</label>
        <div className="flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-l-md border transition-colors ${
              formData.type === 'income'
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Gelir
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-r-md border transition-colors ${
              formData.type === 'expense'
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Gider
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Tutar</label>
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
        <label className="block text-sm font-medium text-gray-700">Kategori</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md h-11"
        >
          <option value="">Kategori seçin</option>
          {categories[formData.type].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Tarih</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Açıklama</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-11"
            placeholder="Açıklama girin"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="shared"
          type="checkbox"
          checked={formData.isShared}
          onChange={(e) => setFormData(prev => ({ ...prev, isShared: e.target.checked }))}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
        />
        <label htmlFor="shared" className="ml-2 block text-sm text-gray-900">
          Bu ortak bir gider
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors h-11"
        >
          İşlemi Kaydet
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;