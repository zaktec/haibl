'use client';
import { useState } from 'react';

interface ImageUploadProps {
  name: string;
  label: string;
  currentUrl?: string;
}

export default function ImageUpload({ name, label, currentUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentUrl || '');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const { url } = await response.json();
      setImageUrl(url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="mb-2" />
      <input type="hidden" name={name} value={imageUrl} />
      {imageUrl && <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded" />}
      {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
    </div>
  );
}