import React, { useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';

interface ProfilePhotoUploadProps {
  onSubmit: (file: File) => void;
  onCancel: () => void;
  currentPhotoUrl: string;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  onSubmit,
  onCancel,
  currentPhotoUrl
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir resim dosyası seçin');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Lütfen bir fotoğraf seçin');
      return;
    }
    onSubmit(selectedFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="relative inline-block">
          <img
            src={previewUrl || currentPhotoUrl}
            alt="Profil"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <label className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors">
            <Camera className="w-5 h-5" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          PNG, JPG veya GIF • Max 5MB
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

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
          disabled={!selectedFile}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
            selectedFile
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Fotoğrafı Kaydet</span>
        </button>
      </div>
    </form>
  );
};

export default ProfilePhotoUpload;