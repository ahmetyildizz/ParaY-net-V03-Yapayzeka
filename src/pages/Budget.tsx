import React, { useState } from 'react';
import { Plus, Wallet, AlertTriangle } from 'lucide-react';
import BudgetProgress from '../components/budget/BudgetProgress';
import BudgetForm from '../components/budget/BudgetForm';
import Modal from '../components/modals/Modal';
import type { Budget } from '../types';

const mockBudgets: Budget[] = [
  {
    id: '1',
    userId: 'user1',
    categoryId: 'Market',
    amount: 3000,
    period: 'monthly',
    startDate: '2024-03-01',
    alerts: [
      { threshold: 80, type: 'percentage' }
    ]
  },
  {
    id: '2',
    userId: 'user1',
    categoryId: 'Kira',
    amount: 8000,
    period: 'monthly',
    startDate: '2024-03-01'
  },
  {
    id: '3',
    userId: 'user1',
    categoryId: 'Eğlence',
    amount: 1500,
    period: 'monthly',
    startDate: '2024-03-01'
  }
];

const Budget: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddBudget = (budget: Omit<Budget, 'id' | 'userId'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user1'
    };
    setBudgets([...budgets, newBudget]);
    setIsFormOpen(false);
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const spentAmount = 4500; // Bu değer normalde API'den gelecek
  const remainingAmount = totalBudget - spentAmount;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Bütçe Planlama</h1>
            <p className="text-gray-600">Aylık harcama limitlerini belirle ve takip et</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Bütçe Ekle
          </button>
        </div>

        {/* Genel Bakış */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-emerald-500" />
              <h3 className="font-medium">Toplam Bütçe</h3>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalBudget)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-medium">Harcanan</h3>
            </div>
            <p className="text-2xl font-semibold text-red-600">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(spentAmount)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium">Kalan</h3>
            </div>
            <p className="text-2xl font-semibold text-blue-600">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(remainingAmount)}
            </p>
          </div>
        </div>

        {/* Bütçe Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <BudgetProgress key={budget.id} budget={budget} />
          ))}
        </div>

        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="Yeni Bütçe Oluştur"
        >
          <BudgetForm onSubmit={handleAddBudget} />
        </Modal>
      </div>
    </div>
  );
};

export default Budget;