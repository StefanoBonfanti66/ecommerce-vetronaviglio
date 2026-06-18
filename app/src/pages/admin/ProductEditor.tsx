import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Tiptap from '../../components/admin/Tiptap';
import ImageUploader from '../../components/admin/ImageUploader';
import { PREDEFINED_ATTRIBUTES } from '../../constants/attributes';

export default function ProductEditor() {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attributeOptions, setAttributeOptions] = useState<Record<string, string[]>>({});
  const [openSections, setOpenSections] = useState({
    general: true,
    description: false,
    attributes: false,
    images: false,
    pricing: false
  });

  const addPriceTier = () => {
    setProduct({
      ...product,
      price_tiers: [...(product.price_tiers || []), { min_qty: 0, price: 0 }]
    });
  };

  const updatePriceTier = (index: number, field: string, value: number) => {
    const tiers = [...(product.price_tiers || [])];
    tiers[index][field] = value;
    setProduct({ ...product, price_tiers: tiers });
  };

  const removePriceTier = (index: number) => {
    setProduct({
      ...product,
      price_tiers: product.price_tiers.filter((_: any, i: number) => i !== index)
    });
  };

  const updatePriceTier = (index: number, field: string, value: number) => {
    const tiers = [...(product.price_tiers || [])];
    tiers[index][field] = value;
    setProduct({ ...product, price_tiers: tiers });
  };

  const removePriceTier = (index: number) => {
    setProduct({
      ...product,
      price_tiers: product.price_tiers.filter((_: any, i: number) => i !== index)
    });
  };
...
  const [product, setProduct] = useState<any>({ ...product, price_tiers: [] }); // Initialize in state

  const addPriceTier = () => {
    setProduct({
      ...product,
      price_tiers: [...(product.price_tiers || []), { min_qty: 0, price: 0 }]
    });
  };

  const updatePriceTier = (index: number, field: string, value: number) => {
    const tiers = [...(product.price_tiers || [])];
    tiers[index][field] = value;
    setProduct({ ...product, price_tiers: tiers });
  };

  const removePriceTier = (index: number) => {
    setProduct({
      ...product,
      price_tiers: product.price_tiers.filter((_: any, i: number) => i !== index)
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
        price_tiers: product.price_tiers, // ADDED
        description_it: product.description_it,
        attributes: product.attributes,
        image_urls: product.image_urls,
        is_active: product.is_active
      })
      .eq('sku', sku);
...
        <CollapsibleSection title="Prezzi e Sconti" isOpen={openSections.pricing} onToggle={() => toggleSection('pricing')}>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-aluminum">Sconti Quantità</label>
                    <button type="button" onClick={addPriceTier} className="text-[9px] uppercase tracking-[0.2em] text-aluminum hover:text-onyx transition-colors">+ Aggiungi Tier</button>
                </div>
                {(product.price_tiers || []).map((tier: any, index: number) => (
                    <div key={index} className="flex gap-4 items-center">
                        <input type="number" placeholder="Min Qty" value={tier.min_qty} onChange={e => updatePriceTier(index, 'min_qty', parseInt(e.target.value))} className="w-1/3 p-2 border border-aluminum/40 bg-transparent text-xs" />
                        <input type="number" step="0.01" placeholder="Price" value={tier.price} onChange={e => updatePriceTier(index, 'price', parseFloat(e.target.value))} className="w-1/3 p-2 border border-aluminum/40 bg-transparent text-xs" />
                        <button type="button" onClick={() => removePriceTier(index)} className="text-red-500 hover:text-red-700">×</button>
                    </div>
                ))}
            </div>
        </CollapsibleSection>

    
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

  const CollapsibleSection = ({ title, children, isOpen, onToggle }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
    <div className="border border-aluminum/20">
      <button type="button" onClick={onToggle} className="w-full flex justify-between p-4 bg-aluminum/5 hover:bg-aluminum/10 transition-colors">
        <span className="font-serif uppercase text-sm tracking-[0.05em]">{title}</span>
        <span className="text-xl font-light">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="p-6 border-t border-aluminum/20">{children}</div>}
    </div>
  );

  if (loading) return <div className="p-12">Caricamento...</div>;
  if (!product) return <div className="p-12">Prodotto non trovato</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Modifica: {sku}</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <CollapsibleSection title="Informazioni Generali" isOpen={openSections.general} onToggle={() => toggleSection('general')}>
          <div className="space-y-6">
            <div>
              <label className="block text-[9px] uppercase tracking-[0.2em] text-aluminum mb-3">Titolo</label>
              <input 
                value={product.title_it || ''} 
                onChange={e => setProduct({...product, title_it: e.target.value})}
                className="w-full border-b border-aluminum/40 bg-transparent py-2 focus:border-onyx outline-none text-lg font-serif"
              />
            </div>
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
            <div className="flex items-center gap-2">
              <input 
                type="checkbox"
                checked={product.is_active}
                onChange={e => setProduct({...product, is_active: e.target.checked})}
              />
              <label className="text-[9px] uppercase tracking-[0.2em] text-aluminum">Prodotto Attivo</label>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Descrizione (IT)" isOpen={openSections.description} onToggle={() => toggleSection('description')}>
            <Tiptap 
                content={product.description_it || ''} 
                onChange={(html) => setProduct({...product, description_it: html})} 
            />
        </CollapsibleSection>

        <CollapsibleSection title="Attributi" isOpen={openSections.attributes} onToggle={() => toggleSection('attributes')}>
          <div className="space-y-6">
            <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-aluminum mb-3">Attributi Fissi</label>
                <div className="grid grid-cols-2 gap-4">
                    {PREDEFINED_ATTRIBUTES.map(attr => (
                        <div key={attr}>
                            <label className="block text-[8px] uppercase text-aluminum">{attr}</label>
                            {attributeOptions[attr] && attributeOptions[attr].length > 0 ? (
                                <select 
                                    value={product.attributes?.[attr] || ''} 
                                    onChange={e => updateAttributeValue(attr, e.target.value)}
                                    className="w-full border-b border-aluminum/40 bg-transparent py-2 focus:border-onyx outline-none text-xs"
                                >
                                    <option value="">Seleziona...</option>
                                    {attributeOptions[attr].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : (
                                <input 
                                    value={product.attributes?.[attr] || ''} 
                                    onChange={e => updateAttributeValue(attr, e.target.value)}
                                    className="w-full border-b border-aluminum/40 bg-transparent py-2 focus:border-onyx outline-none text-xs"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            <div>
                <div className="flex justify-between items-center mb-3">
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-aluminum">Attributi Extra</label>
                    <button type="button" onClick={addAttribute} className="text-[9px] uppercase tracking-[0.2em] text-aluminum hover:text-onyx transition-colors">+ Aggiungi</button>
                </div>
                <div className="space-y-3">
                    {Object.entries(product.attributes || {}).filter(([key]) => !PREDEFINED_ATTRIBUTES.includes(key)).map(([key, value]) => (
                        <div key={key} className="flex gap-4">
                            <input value={key} onChange={(e) => updateAttributeKey(key, e.target.value)} className="w-1/3 bg-aluminum/5 p-2 text-xs font-mono border border-aluminum/20" />
                            <input value={value as string} onChange={e => updateAttributeValue(key, e.target.value)} className="w-2/3 border-b border-aluminum/40 bg-transparent p-2 focus:border-onyx outline-none text-xs" />
                            <button type="button" onClick={() => removeAttribute(key)} className="text-red-500 hover:text-red-700">×</button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Immagini" isOpen={openSections.images} onToggle={() => toggleSection('images')}>
            <ImageUploader 
                currentImages={product.image_urls || []} 
                onUpload={handleImageUpload} 
            />
        </CollapsibleSection>

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
