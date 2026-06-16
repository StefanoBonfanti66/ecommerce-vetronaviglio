import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Tiptap from '../../components/admin/Tiptap';
import ImageUploader from '../../components/admin/ImageUploader';

export default function ProductEditor() {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!sku) return;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single();
      
      if (error) console.error('Error:', error);
      else setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [sku]);

  const updateAttribute = (key: string, value: string) => {
    setProduct({
      ...product,
      attributes: { ...product.attributes, [key]: value }
    });
  };

  const addAttribute = () => {
    setProduct({
      ...product,
      attributes: { ...product.attributes, 'nuovo_attributo': '' }
    });
  };

  const handleImageUpload = (url: string) => {
    setProduct({
      ...product,
      image_urls: [...(product.image_urls || []), url]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('products')
      .update({
        title_it: product.title_it,
        price: product.price,
        description_it: product.description_it,
        attributes: product.attributes,
        image_urls: product.image_urls
      })
      .eq('sku', sku);
    
    if (!error && user) {
        await supabase.from('audit_logs').insert({
            user_id: user.id,
            table_name: 'products',
            record_id: product.id,
            action: 'UPDATE',
            new_data: product
        });
    }

    setSaving(false);
    if (!error) navigate('/admin/products');
  };

  if (loading) return <div className="p-12">Caricamento...</div>;
  if (!product) return <div className="p-12">Prodotto non trovato</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Modifica: {sku}</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div>
          <label className="block text-[9px] uppercase tracking-[0.2em] text-aluminum mb-3">Titolo</label>
          <input 
            value={product.title_it || ''} 
            onChange={e => setProduct({...product, title_it: e.target.value})}
            className="w-full border-b border-aluminum/40 bg-transparent py-2 focus:border-onyx outline-none text-lg font-serif"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-12">
          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-aluminum mb-3">Prezzo</label>
            <input 
              type="number" 
              step="0.01"
              value={product.price || ''} 
              onChange={e => setProduct({...product, price: parseFloat(e.target.value)})}
              className="w-full border-b border-aluminum/40 bg-transparent py-2 focus:border-onyx outline-none text-lg font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] uppercase tracking-[0.2em] text-aluminum mb-3">Descrizione (IT)</label>
          <Tiptap 
            content={product.description_it || ''} 
            onChange={(html) => setProduct({...product, description_it: html})} 
          />
        </div>

        <div>
            <div className="flex justify-between items-center mb-3">
                <label className="block text-[9px] uppercase tracking-[0.2em] text-aluminum">Attributi Dinamici</label>
                <button type="button" onClick={addAttribute} className="text-[9px] uppercase tracking-[0.2em] text-aluminum hover:text-onyx transition-colors">+ Aggiungi</button>
            </div>
            <div className="space-y-3">
                {Object.entries(product.attributes || {}).map(([key, value]) => (
                    <div key={key} className="flex gap-4">
                        <input value={key} disabled className="w-1/3 bg-aluminum/5 p-2 text-xs font-mono border border-aluminum/20" />
                        <input value={value as string} onChange={e => updateAttribute(key, e.target.value)} className="w-2/3 border-b border-aluminum/40 bg-transparent p-2 focus:border-onyx outline-none text-xs" />
                    </div>
                ))}
            </div>
        </div>

        <div>
          <ImageUploader 
            currentImages={product.image_urls || []} 
            onUpload={handleImageUpload} 
          />
        </div>

        <button 
          disabled={saving}
          className="bg-onyx text-bone px-10 py-4 uppercase text-[10px] tracking-[0.2em] hover:bg-aluminum transition-all"
        >
          {saving ? 'Salvataggio...' : 'Salva Modifiche'}
        </button>
      </form>
    </div>
  );
}
