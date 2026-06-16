import { useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function ImageUploader({ currentImages, onUpload }: { currentImages: string[], onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('ecommerceBUK')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('ecommerceBUK')
        .getPublicUrl(filePath);

      onUpload(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-[9px] uppercase tracking-[0.2em] text-aluminum">Immagini Prodotto</label>
      <div className="flex flex-wrap gap-4">
        {currentImages.map((url, idx) => (
          <img key={idx} src={url} alt="product" className="w-20 h-20 object-cover border border-aluminum/20" />
        ))}
      </div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleUpload} 
        disabled={uploading}
        className="block text-xs text-aluminum file:mr-4 file:py-2 file:px-4 file:border file:border-onyx file:bg-transparent file:text-[9px] file:uppercase file:tracking-[0.2em] hover:file:bg-onyx hover:file:text-bone transition-all"
      />
    </div>
  );
}
