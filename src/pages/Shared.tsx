import React, { useState } from 'react';
import { Plus, Users, ArrowLeftRight } from 'lucide-react';
import SharedExpensesList from '../components/shared/SharedExpensesList';
import SharedExpenseForm from '../components/shared/SharedExpenseForm';
import Modal from '../components/modals/Modal';
import type { SharedExpense } from '../types';

const mockSharedExpenses: SharedExpense[] = [
  {
    id: '1',
    transactionId: 'tx1',
    participants: [
      { userId: 'user1', share: 4000, status: 'accepted' },
      { userId: 'user2', share: 4000, status: 'pending' }
    ],
    totalAmount: 8000,
  },
  {
    id: '2',
    transactionId: 'tx2',
    participants: [
      { userId: 'user1', share: 600, status: 'accepted' },
      { userId: 'user2', share: 600, status: 'accepted' }
    ],
    totalAmount: 1200,
    settledDate: '2024-03-10'
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount);
};

const Shared: React.FC = () => {
  const [expenses, setExpenses] = useState<SharedExpense[]>(mockSharedExpenses);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const totalPending = expenses
    .filter(e => !e.settledDate)
    .reduce((sum, e) => sum + e.totalAmount, 0);

  const totalSettled = expenses
    .filter(e => e.settledDate)
    .reduce((sum, e) => sum + e.totalAmount, 0);

  const handleAddExpense = (expense: Omit<SharedExpense, 'id'>) => {
    const newExpense: SharedExpense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9)
    };
    setExpenses([newExpense, ...expenses]);
    setIsFormOpen(false);
  };

  const handleSettle = (expenseId: string) => {
    setExpenses(expenses.map(expense => 
      expense.id === expenseId
        ? { ...expense, settledDate: new Date().toISOString() }
        : expense
    ));
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Ortak Giderler</h1>
            <p className="text-gray-600">Arkadaşlarınızla paylaştığınız giderleri yönetin</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Ortak Gider
          </button>
        </div>

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <h3 className="font-medium">Bekleyen Ödemeler</h3>
            </div>
            <p className="text-2xl font-semibold text-amber-500">
              {formatCurrency(totalPending)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <ArrowLeftRight className="w-5 h-5 text-emerald-500" />
              <h3 className="font-medium">Tamamlanan Ödemeler</h3>
            </div>
            <p className="text-2xl font-semibold text-emerald-600">
              {formatCurrency(totalSettled)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <h3 className="font-medium">Aktif Katılımcılar</h3>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {new Set(expenses.flatMap(e => e.participants.map(p => p.userId))).size}
            </p>
          </div>
        </div>

        {/* Filtreler */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 text-sm font-medium rounded-md bg-emerald-50 text-emerald-700">
              Tümü
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-500 hover:bg-gray-50">
              Bekleyenler
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-500 hover:bg-gray-50">
              Tamamlananlar
            </button>
          </div>
        </div>

        {/* Gider Listesi */}
        <SharedExpensesList 
          sharedExpenses={expenses}
          onSettle={handleSettle}
        />

        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="Yeni Ortak Gider Ekle"
        >
          <SharedExpenseForm onSubmit={handleAddExpense} />
        </Modal>
      </div>
    </div>
  );
};

export default Shared;