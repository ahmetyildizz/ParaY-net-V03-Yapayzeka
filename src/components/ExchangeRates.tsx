import React, { useState, useEffect } from 'react';
import { DollarSign, Euro, Bitcoin, Coins, CircleDollarSign } from 'lucide-react';

interface Rate {
  code: string;
  value: number;
  change: number;
  type: 'currency' | 'crypto' | 'gold';
}

const ExchangeRates: React.FC = () => {
  const [rates, setRates] = useState<Rate[]>([
    { code: 'USD', value: 32.15, change: 0.3, type: 'currency' },
    { code: 'EUR', value: 34.85, change: -0.2, type: 'currency' },
    { code: 'BTC', value: 1654230, change: 1.2, type: 'crypto' },
    { code: 'ETH', value: 89450, change: 0.8, type: 'crypto' },
    { code: 'FULL', value: 18750, change: 0.5, type: 'gold' },
    { code: 'HALF', value: 9375, change: 0.4, type: 'gold' },
    { code: 'QUARTER', value: 4687, change: 0.6, type: 'gold' }
  ]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Gerçek uygulamada burası API'den veri çekecek
        // Örnek API'ler:
        // - Döviz için: https://api.exchangerate-api.com/
        // - Kripto için: https://api.coingecko.com/
        // - Altın için: https://api.collectapi.com/economy/goldPrice
        
        // Şimdilik mock data kullanıyoruz
        const mockData = [
          { code: 'USD', value: 32.15 + Math.random() * 0.5, change: 0.3, type: 'currency' },
          { code: 'EUR', value: 34.85 + Math.random() * 0.5, change: -0.2, type: 'currency' },
          { code: 'BTC', value: 1654230 + Math.random() * 1000, change: 1.2, type: 'crypto' },
          { code: 'ETH', value: 89450 + Math.random() * 500, change: 0.8, type: 'crypto' },
          { code: 'FULL', value: 18750 + Math.random() * 100, change: 0.5, type: 'gold' },
          { code: 'HALF', value: 9375 + Math.random() * 50, change: 0.4, type: 'gold' },
          { code: 'QUARTER', value: 4687 + Math.random() * 25, change: 0.6, type: 'gold' }
        ];
        
        setRates(mockData);
      } catch (error) {
        console.error('Kurlar alınırken hata oluştu:', error);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 30000); // Her 30 saniyede bir güncelle

    return () => clearInterval(interval);
  }, []);

  const getIcon = (code: string, type: string) => {
    switch (type) {
      case 'currency':
        return code === 'USD' ? 
          <DollarSign className="w-4 h-4 text-emerald-500" /> : 
          <Euro className="w-4 h-4 text-blue-500" />;
      case 'crypto':
        return code === 'BTC' ? 
          <Bitcoin className="w-4 h-4 text-orange-500" /> : 
          <Coins className="w-4 h-4 text-purple-500" />;
      case 'gold':
        return <CircleDollarSign className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getName = (code: string) => {
    switch (code) {
      case 'USD':
        return 'Dolar';
      case 'EUR':
        return 'Euro';
      case 'BTC':
        return 'Bitcoin';
      case 'ETH':
        return 'Ethereum';
      case 'FULL':
        return 'Tam Altın';
      case 'HALF':
        return 'Yarım Altın';
      case 'QUARTER':
        return 'Çeyrek Altın';
      default:
        return code;
    }
  };

  const formatValue = (type: string, value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: type === 'currency' ? 2 : 0
    }).format(value);
  };

  const groupedRates = {
    currency: rates.filter(r => r.type === 'currency'),
    crypto: rates.filter(r => r.type === 'crypto'),
    gold: rates.filter(r => r.type === 'gold')
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Döviz Kurları */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Döviz Kurları</h3>
        <div className="space-y-2">
          {groupedRates.currency.map((rate) => (
            <div key={rate.code} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(rate.code, rate.type)}
                <span className="text-sm font-medium">{getName(rate.code)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{formatValue(rate.type, rate.value)}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  rate.change >= 0 
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {rate.change >= 0 ? '+' : ''}{rate.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kripto Paralar */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Kripto Paralar</h3>
        <div className="space-y-2">
          {groupedRates.crypto.map((rate) => (
            <div key={rate.code} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(rate.code, rate.type)}
                <span className="text-sm font-medium">{getName(rate.code)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{formatValue(rate.type, rate.value)}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  rate.change >= 0 
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {rate.change >= 0 ? '+' : ''}{rate.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Altın Fiyatları */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Altın Fiyatları</h3>
        <div className="space-y-2">
          {groupedRates.gold.map((rate) => (
            <div key={rate.code} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(rate.code, rate.type)}
                <span className="text-sm font-medium">{getName(rate.code)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{formatValue(rate.type, rate.value)}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  rate.change >= 0 
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {rate.change >= 0 ? '+' : ''}{rate.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 text-right col-span-full">
        Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
      </div>
    </div>
  );
};

export default ExchangeRates;