import React, { useState } from 'react';
import { Calendar, DollarSign } from 'lucide-react';

interface SavingsFormProps {
  onSubmit: (saving: {
    type: 'USD' | 'EUR' | 'BTC' | 'ETH' | 'GOLD_GRAM' | 'GOLD_FULL' | 'GOLD_HALF' | 'GOLD_QUARTER';
    amount: number;
    purchaseRate: number;
    purchaseDate: string;
    note?: string;
  }) => void;
  currentRates: Record<string, number>;
}

const SavingsForm: React.FC<SavingsFormProps> = ({ onSubmit, currentRates }) => {
  const [formData, setFormData] = useState({
    type: 'USD' as const,
    amount: '',
    purchaseRate: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const purchaseRate = parseFloat(formData.purchaseRate);

    if (!amount || amount <= 0) {
      alert('Lütfen geçerli bir miktar giriniz');
      return;
    }
    if (!purchaseRate || purchaseRate <= 0) {
      alert('Lütfen geçerli bir kur giriniz');
      return;
    }

    onSubmit({
      ...formData,
      amount,
      purchaseRate
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, purchaseRate: value }));
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'USD':
        return 'Amerikan Doları (USD)';
      case 'EUR':
        return 'Euro (EUR)';
      case 'BTC':
        return 'Bitcoin (BTC)';
      case 'ETH':
        return 'Ethereum (ETH)';
      case 'GOLD_GRAM':
        return 'Gram Altın';
      case 'GOLD_FULL':
        return 'Tam Altın';
      case 'GOLD_HALF':
        return 'Yarım Altın';
      case 'GOLD_QUARTER':
        return 'Çeyrek Altın';
      default:
        return type;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Birikim Türü</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            type: e.target.value as typeof formData.type,
            purchaseRate: currentRates[e.target.value].toString()
          }))}
          className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md h-11"
        >
          <optgroup label="Döviz">
            <option value="USD">Amerikan Doları (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </optgroup>
          <optgroup label="Kripto Para">
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
          </optgroup>
          <optgroup label="Altın">
            <option value="GOLD_GRAM">Gram Altın</option>
            <option value="GOLD_FULL">Tam Altın</option>
            <option value="GOLD_HALF">Yarım Altın</option>
            <option value="GOLD_QUARTER">Çeyrek Altın</option>
          </optgroup>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Miktar</label>
        <div className="relative rounded-md shadow-sm">
          <input
            type="text"
            inputMode="decimal"
            value={formData.amount}
            onChange={handleAmountChange}
            className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md h-11"
            placeholder="0.00"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500">Adet</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Alış Kuru (TRY)</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">₺</span>
          </div>
          <input
            type="text"
            inputMode="decimal"
            value={formData.purchaseRate}
            onChange={handleRateChange}
            className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md h-11"
            placeholder="0.00"
          />
        </div>
        <p className="text-sm text-gray-500">
          Güncel kur: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(currentRates[formData.type])}
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Alış Tarihi</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
            className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Not</label>
        <textarea
          value={formData.note}
          onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
          className="focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
          rows={3}
          placeholder="İsteğe bağlı not ekleyin..."
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors h-11"
        >
          Birikim Ekle
        </button>
      </div>
    </form>
  );
};

export default SavingsForm;