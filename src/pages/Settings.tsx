import React, { useState } from 'react';
import { User, Bell, Globe, Moon, Users, Key, Lock, CreditCard, HelpCircle } from 'lucide-react';
import type { User as UserType } from '../types';
import Modal from '../components/modals/Modal';
import AddTeamMemberForm from '../components/users/AddTeamMemberForm';
import ProfilePhotoUpload from '../components/users/ProfilePhotoUpload';

const mockTeamMembers = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yılmaz&background=random'
  },
  {
    id: '2',
    name: 'Mehmet Demir',
    email: 'mehmet@example.com',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Mehmet+Demir&background=random'
  }
];

const roles = [
  {
    id: 'admin',
    name: 'Yönetici',
    permissions: ['Tam Erişim', 'Kullanıcı Yönetimi', 'Ayarlar']
  },
  {
    id: 'user',
    name: 'Kullanıcı',
    permissions: ['İşlem Görüntüleme', 'İşlem Ekleme']
  }
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'users' | 'security'>('profile');
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isPhotoUploadModalOpen, setIsPhotoUploadModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yılmaz&background=random',
    preferences: {
      currency: 'TRY',
      language: 'tr',
      notifications: true,
      theme: 'light' as const
    }
  });

  const handleAddMember = (member: { name: string; email: string; role: string }) => {
    const newMember = {
      id: Math.random().toString(36).substr(2, 9),
      ...member,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`
    };
    setTeamMembers(prev => [newMember, ...prev]);
    setIsAddMemberModalOpen(false);
  };

  const handlePhotoUpload = (file: File) => {
    // Gerçek uygulamada burada dosya yükleme işlemi yapılacak
    const imageUrl = URL.createObjectURL(file);
    setCurrentUser(prev => ({ ...prev, avatar: imageUrl }));
    setIsPhotoUploadModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profil Bilgileri</h3>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={currentUser.avatar}
                  alt="Profil"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button 
                  onClick={() => setIsPhotoUploadModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
                >
                  Fotoğraf Değiştir
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <input
                    type="text"
                    defaultValue={currentUser.name}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-posta</label>
                  <input
                    type="email"
                    defaultValue={currentUser.email}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tercihler</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Para Birimi</label>
                  <select
                    defaultValue={currentUser.preferences.currency}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="TRY">Türk Lirası (₺)</option>
                    <option value="USD">Amerikan Doları ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dil</label>
                  <select
                    defaultValue={currentUser.preferences.language}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Bildirimler</h4>
                      <p className="text-sm text-gray-500">Bildirim tercihlerinizi yönetin</p>
                    </div>
                    <button
                      type="button"
                      className={`${
                        currentUser.preferences.notifications
                          ? 'bg-emerald-500'
                          : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                      role="switch"
                      aria-checked={currentUser.preferences.notifications}
                    >
                      <span
                        className={`${
                          currentUser.preferences.notifications ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Karanlık Mod</h4>
                      <p className="text-sm text-gray-500">Arayüz temasını değiştirin</p>
                    </div>
                    <button
                      type="button"
                      className={`${
                        darkMode ? 'bg-emerald-500' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                      role="switch"
                      aria-checked={darkMode}
                      onClick={() => setDarkMode(!darkMode)}
                    >
                      <span
                        className={`${
                          darkMode ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Takım Üyeleri</h3>
                  <p className="text-sm text-gray-500">Takım üyelerinizi ve yetkilerini yönetin</p>
                </div>
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors"
                >
                  Üye Ekle
                </button>
              </div>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                      </span>
                      <button className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Düzenle</span>
                        <Key className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Güvenlik</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Şifre Değiştir</h4>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mevcut Şifre</label>
                      <input
                        type="password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Yeni Şifre</label>
                      <input
                        type="password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Yeni Şifre (Tekrar)</label>
                      <input
                        type="password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors">
                      Şifreyi Güncelle
                    </button>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">İki Faktörlü Doğrulama</h4>
                      <p className="text-sm text-gray-500">Hesabınızı daha güvenli hale getirin</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-md hover:bg-emerald-50 transition-colors">
                      Aktifleştir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Ayarlar</h1>
          <p className="text-gray-600">Hesap ayarlarınızı ve tercihlerinizi yönetin</p>
        </div>

        {/* Üst Menü */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'profile'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="w-5 h-5" />
              Profil
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'preferences'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Globe className="w-5 h-5" />
              Tercihler
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'users'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-5 h-5" />
              Kullanıcılar
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'security'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Lock className="w-5 h-5" />
              Güvenlik
            </button>
          </div>
        </div>

        {/* İçerik */}
        <div className="mt-6">
          {renderTabContent()}
        </div>

        <Modal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          title="Yeni Takım Üyesi Ekle"
        >
          <AddTeamMemberForm
            onSubmit={handleAddMember}
            roles={roles}
          />
        </Modal>

        <Modal
          isOpen={isPhotoUploadModalOpen}
          onClose={() => setIsPhotoUploadModalOpen(false)}
          title="Profil Fotoğrafını Değiştir"
        >
          <ProfilePhotoUpload
            onSubmit={handlePhotoUpload}
            onCancel={() => setIsPhotoUploadModalOpen(false)}
            currentPhotoUrl={currentUser.avatar}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Settings;