import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  onCancel: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit, onCancel }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Lütfen e-posta adresinizi girin');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Lütfen geçerli bir e-posta adresi girin');
      return;
    }
    setError('');
    onSubmit(email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Şifre sıfırlama bağlantısı gönderildi
        </h3>
        <p className="text-gray-500 mb-6">
          {email} adresine şifre sıfırlama talimatlarını gönderdik.
          Lütfen e-posta kutunuzu kontrol edin.
        </p>
        <button
          onClick={onCancel}
          className="w-full bg-emerald-500 text-white rounded-lg p-3 hover:bg-emerald-600 transition-colors"
        >
          Giriş Sayfasına Dön
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Şifrenizi mi unuttunuz?
        </h3>
        <p className="text-gray-500 mb-6">
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          E-posta Adresi
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="ornek@email.com"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          İptal
        </button>
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors"
        >
          <span>Gönder</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;