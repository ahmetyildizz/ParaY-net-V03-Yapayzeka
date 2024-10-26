import React, { useState } from 'react';
import { Home, PieChart, Calendar, Settings, Users, Plus, LogOut, Mail, Lock, AlertCircle, Wallet, CreditCard } from 'lucide-react';
import Modal from './modals/Modal';
import ForgotPasswordForm from './auth/ForgotPasswordForm';

interface SidebarProps {
  isAuthenticated: boolean;
  onLogin: (email: string, password: string) => void;
  onNewTransaction: () => void;
  onPageChange: (page: 'dashboard' | 'analytics' | 'budget' | 'shared' | 'settings' | 'savings' | 'loans') => void;
  currentPage: 'dashboard' | 'analytics' | 'budget' | 'shared' | 'settings' | 'savings' | 'loans';
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isAuthenticated, 
  onLogin, 
  onNewTransaction, 
  onPageChange, 
  currentPage, 
  onLogout 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Ana Sayfa', value: 'dashboard' },
    { icon: PieChart, label: 'Analiz', value: 'analytics' },
    { icon: Calendar, label: 'Bütçe', value: 'budget' },
    { icon: Users, label: 'Ortak Giderler', value: 'shared' },
    { icon: Wallet, label: 'Birikim', value: 'savings' },
    { icon: CreditCard, label: 'Krediler', value: 'loans' },
    { icon: Settings, label: 'Ayarlar', value: 'settings' },
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }
    setError('');
    onLogin(email, password);
  };

  const handleForgotPassword = (email: string) => {
    console.log('Şifre sıfırlama e-postası gönderildi:', email);
    setIsForgotPasswordOpen(false);
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-6">
      <div className="flex items-center gap-3 mb-8">
        <PieChart className="w-8 h-8 text-emerald-500" />
        <h1 className="text-xl font-bold">ParaYönet</h1>
      </div>

      {!isAuthenticated ? (
        <div className="space-y-6">
          <div className="text-sm">
            <h2 className="font-medium mb-2">Giriş Yap</h2>
            <p className="text-gray-400 mb-4">Hesabınıza giriş yaparak devam edin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900 bg-opacity-30 p-3 rounded-md text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">E-posta</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Şifre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg p-2 transition-colors"
            >
              Giriş Yap
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsForgotPasswordOpen(true)}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Şifremi Unuttum
            </button>
          </div>
        </div>
      ) : (
        <>
          <button 
            onClick={onNewTransaction}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg p-3 flex items-center justify-center gap-2 mb-8 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni İşlem</span>
          </button>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onPageChange(item.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors ${
                  currentPage === item.value ? 'bg-gray-800 text-white' : ''
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </>
      )}

      <Modal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        title="Şifre Sıfırlama"
      >
        <ForgotPasswordForm
          onSubmit={handleForgotPassword}
          onCancel={() => setIsForgotPasswordOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Sidebar;