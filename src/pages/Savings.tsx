import React, { useState } from 'react';
import { Plus, Wallet, DollarSign, Euro, Bitcoin, Coins, Pencil, Trash2, AlertCircle } from 'lucide-react';
import Modal from '../components/modals/Modal';
import SavingsForm from '../components/savings/SavingsForm';

interface Saving {
  id: string;
  type: 'USD' | 'EUR' | 'BTC' | 'ETH' | 'GOLD_GRAM' | 'GOLD_FULL' | 'GOLD_HALF' | 'GOLD_QUARTER';
  amount: number;
  purchaseRate: number;
  purchaseDate: string;
  note?: string;
}

const mockSavings: Saving[] = [
  {
    id: '1',
    type: 'USD',
    amount: 1000,
    purchaseRate: 31.50,
    purchaseDate: '2024-03-01',
    note: 'Dolar biriktirme hedefi'
  },
  {
    id: '2',
    type: 'EUR',
    amount: 500,
    purchaseRate: 34.20,
    purchaseDate: '2024-03-05',
    note: 'Euro yatırımı'
  },
  {
    id: '3',
    type: 'BTC',
    amount: 0.05,
    purchaseRate: 1620000,
    purchaseDate: '2024-03-10',
    note: 'Bitcoin yatırımı'
  }
];

const currentRates = {
  USD: 32.15,
  EUR: 34.85,
  BTC: 1654230,
  ETH: 89450,
  GOLD_GRAM: 2150,
  GOLD_FULL: 18750,
  GOLD_HALF: 9375,
  GOLD_QUARTER: 4687
};

const Savings: React.FC = () => {
  const [savings, setSavings] = useState<Saving[]>(mockSavings);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<Saving | null>(null);

  const handleAddSaving = (saving: Omit<Saving, 'id'>) => {
    const newSaving: Saving = {
      ...saving,
      id: Math.random().toString(36).substr(2, 9)
    };
    setSavings([...savings, newSaving]);
    setIsFormOpen(false);
  };

  const handleEditSaving = (saving: Omit<Saving, 'id'>) => {
    if (!selectedSaving) return;
    
    const updatedSavings = savings.map(s => 
      s.id === selectedSaving.id ? { ...saving, id: selectedSaving.id } : s
    );
    setSavings(updatedSavings);
    setSelectedSaving(null);
    setIsFormOpen(false);
  };

  const handleDeleteSaving = () => {
    if (!selectedSaving) return;
    
    const updatedSavings = savings.filter(s => s.id !== selectedSaving.id);
    setSavings(updatedSavings);
    setSelectedSaving(null);
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (saving: Saving) => {
    setSelectedSaving(saving);
    setIsFormOpen(true);
  };

  const openDeleteModal = (saving: Saving) => {
    setSelectedSaving(saving);
    setIsDeleteModalOpen(true);
  };

  const calculateTotalValue = (saving: Saving) => {
    const currentRate = currentRates[saving.type];
    return saving.amount * currentRate;
  };

  const calculateProfit = (saving: Saving) => {
    const currentValue = calculateTotalValue(saving);
    const purchaseValue = saving.amount * saving.purchaseRate;
    return currentValue - purchaseValue;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getIcon = (type: Saving['type']) => {
    switch (type) {
      case 'USD':
        return <DollarSign className="w-6 h-6 text-emerald-500" />;
      case 'EUR':
        return <Euro className="w-6 h-6 text-blue-500" />;
      case 'BTC':
        return <Bitcoin className="w-6 h-6 text-orange-500" />;
      case 'ETH':
        return <Coins className="w-6 h-6 text-purple-500" />;
      case 'GOLD_GRAM':
      case 'GOLD_FULL':
      case 'GOLD_HALF':
      case 'GOLD_QUARTER':
        return <Wallet className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getTypeName = (type: Saving['type']) => {
    switch (type) {
      case 'USD':
        return 'Amerikan Doları';
      case 'EUR':
        return 'Euro';
      case 'BTC':
        return 'Bitcoin';
      case 'ETH':
        return 'Ethereum';
      case 'GOLD_GRAM':
        return 'Gram Altın';
      case 'GOLD_FULL':
        return 'Tam Altın';
      case 'GOLD_HALF':
        return 'Yarım Altın';
      case 'GOLD_QUARTER':
        return 'Çeyrek Altın';
    }
  };

  const totalPortfolioValue = savings.reduce((total, saving) => {
    return total + calculateTotalValue(saving);
  }, 0);

  const totalProfit = savings.reduce((total, saving) => {
    return total + calculateProfit(saving);
  }, 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Birikimlerim</h1>
            <p className="text-gray-600">Döviz, kripto para ve altın birikimlerinizi takip edin</p>
          </div>
          <button
            onClick={() => {
              setSelectedSaving(null);
              setIsFormOpen(true);
            }}
            className="btn btn-primary flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Birikim Ekle
          </button>
        </div>

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Portföy Değeri</h3>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalPortfolioValue)}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Kar/Zarar</h3>
            <p className={`text-2xl font-semibold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfit)}
            </p>
          </div>
        </div>

        {/* Birikimler Listesi */}
        <div className="space-y-6">
          {savings.map((saving) => (
            <div key={saving.id} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getIcon(saving.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{getTypeName(saving.type)}</h3>
                    <p className="text-sm text-gray-500">{saving.note}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Miktar</p>
                    <p className="font-semibold">{saving.amount} {saving.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(saving)}
                      className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"
                      title="Düzenle"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(saving)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Alış Kuru</p>
                  <p className="font-medium">{formatCurrency(saving.purchaseRate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Güncel Kur</p>
                  <p className="font-medium">{formatCurrency(currentRates[saving.type])}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Güncel Değer</p>
                  <p className="font-medium">{formatCurrency(calculateTotalValue(saving))}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kar/Zarar</p>
                  <p className={`font-medium ${calculateProfit(saving) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(calculateProfit(saving))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedSaving(null);
          }}
          title={selectedSaving ? 'Birikim Düzenle' : 'Yeni Birikim Ekle'}
        >
          <SavingsForm
            onSubmit={selectedSaving ? handleEditSaving : handleAddSaving}
            currentRates={currentRates}
            initialValues={selectedSaving || undefined}
          />
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedSaving(null);
          }}
          title="Birikim Sil"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 text-amber-600 bg-amber-50 p-4 rounded-lg">
              <AlertCircle className="w-6 h-6" />
              <p className="text-sm">
                Bu birikimi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedSaving(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Savings;