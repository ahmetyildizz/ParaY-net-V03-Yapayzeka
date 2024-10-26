import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardStats from './components/DashboardStats';
import TransactionList from './components/TransactionList';
import ExchangeRates from './components/ExchangeRates';
import TransactionForm from './components/transactions/TransactionForm';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';
import Shared from './pages/Shared';
import Settings from './pages/Settings';
import Savings from './pages/Savings';
import Loans from './pages/Loans';
import Modal from './components/modals/Modal';
import type { Transaction } from './types';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: 'user1',
    amount: 25000,
    type: 'income',
    category: 'Maaş',
    date: '2024-03-15',
    description: 'Mart ayı maaşı',
    isShared: false
  },
  {
    id: '2',
    userId: 'user1',
    amount: 8000,
    type: 'expense',
    category: 'Kira',
    date: '2024-03-14',
    description: 'Mart ayı kirası',
    isShared: true,
    sharedWith: ['user2']
  },
  {
    id: '3',
    userId: 'user1',
    amount: 1200,
    type: 'expense',
    category: 'Market',
    date: '2024-03-13',
    description: 'Haftalık market alışverişi',
    isShared: false
  }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics' | 'budget' | 'shared' | 'settings' | 'savings' | 'loans'>('dashboard');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogin = (email: string, password: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    setIsLogoutModalOpen(false);
    setCurrentPage('dashboard');
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user1',
    };
    setTransactions([newTransaction, ...transactions]);
    setIsTransactionModalOpen(false);
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ParaYönet'e Hoş Geldiniz</h2>
            <p className="text-gray-600 mb-8">Başlamak için lütfen giriş yapın.</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'analytics':
        return <Analytics transactions={transactions} />;
      case 'budget':
        return <Budget />;
      case 'shared':
        return <Shared />;
      case 'settings':
        return <Settings />;
      case 'savings':
        return <Savings />;
      case 'loans':
        return <Loans />;
      default:
        return (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold">Panel</h1>
                  <p className="text-gray-500">Hoş geldin, Ahmet</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Ahmet Yılmaz</p>
                    <p className="text-sm text-gray-500">ahmet@example.com</p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profil"
                    className="w-10 h-10 rounded-full ring-2 ring-white"
                  />
                </div>
              </div>

              <ExchangeRates />
              <DashboardStats />
              <TransactionList transactions={transactions} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onNewTransaction={() => setIsTransactionModalOpen(true)}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>

      <Modal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        title="Yeni İşlem"
      >
        <TransactionForm onSubmit={handleAddTransaction} />
      </Modal>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Çıkış Yap"
      >
        <div className="p-6">
          <p className="text-gray-700 mb-6">Çıkış yapmak istediğinizden emin misiniz?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={confirmLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;