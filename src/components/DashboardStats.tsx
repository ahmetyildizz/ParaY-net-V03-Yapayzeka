import React from 'react';
import { TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount);
};

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Toplam Bakiye"
        amount={25840.50}
        trend={+12.5}
        icon={Wallet}
        color="emerald"
      />
      <StatCard
        title="Aylık Gelir"
        amount={8250.00}
        trend={+8.2}
        icon={TrendingUp}
        color="blue"
      />
      <StatCard
        title="Aylık Gider"
        amount={5430.20}
        trend={-3.1}
        icon={TrendingDown}
        color="red"
      />
      <StatCard
        title="Ortak Giderler"
        amount={1250.80}
        trend={+5.3}
        icon={CreditCard}
        color="purple"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  amount: number;
  trend: number;
  icon: React.ElementType;
  color: 'emerald' | 'blue' | 'red' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, amount, trend, icon: Icon, color }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-semibold mt-1">{formatCurrency(amount)}</p>
    </div>
  );
};

export default DashboardStats;