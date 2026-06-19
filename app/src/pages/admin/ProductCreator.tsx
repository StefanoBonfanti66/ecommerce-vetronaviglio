import AdminWrapper from "../../components/admin/AdminWrapper";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Tiptap from '../../components/admin/Tiptap';
import ImageUploader from '../../components/admin/ImageUploader';
import { PREDEFINED_ATTRIBUTES } from '../../constants/attributes';

export default function ProductCreator() {
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>({
    sku: '',
    title_it: '',
    price: 0,
    description_it: '',
    attributes: {},
    image_urls: [],
    is_active: true
  });
  const [saving, setSaving] = useState(false);
  const [attributeOptions, setAttributeOptions] = useState<Record<string, string[]>>({});
  const [openSections, setOpenSections] = useState({
    general: true,
    description: false,
    attributes: false,
    images: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    async function fetchOptions() {
        const { data } = await supabase.from('attribute_options').select('attribute_key, value');
        if (data) {
            const options: Record<string, string[]> = {};
            data.forEach(item => {
                if (!options[item.attribute_key]) options[item.attribute_key] = [];
                options[item.attribute_key].push(item.value);
            });
            
            // Ordina le opzioni
            Object.keys(options).forEach(key => {
                if (key === 'ml') {
                    options[key].sort((a, b) => parseInt(a) - parseInt(b));
                } else {
                    options[key].sort((a, b) => a.localeCompare(b));
                }
            });
            
            setAttributeOptions(options);
        }
    }
    fetchOptions();
  }, []);

  const addAttribute = () => {
    setProduct({
      ...product,
      attributes: { ...product.attributes, 'nuovo_attributo': '' }
    });
  };

  const updateAttributeKey = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    const { [oldKey]: value, ...rest } = product.attributes;
    setProduct({
      ...product,
      attributes: { ...rest, [newKey]: value }
    });
  };

  const updateAttributeValue = (key: string, value: string) => {
    setProduct({
      ...product,
      attributes: { ...product.attributes, [key]: value }
    });
  };

  const removeAttribute = (key: string) => {
    const { [key]: _, ...rest } = product.attributes;
    setProduct({
      ...product,
      attributes: rest
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
    setSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('products')
      .insert({
        sku: product.sku,
        title_it: product.title_it,
        price: product.price,
        description_it: product.description_it,
        attributes: product.attributes,
        image_urls: product.image_urls,
        is_active: product.is_active
      });
    
    if (!error && user) {
        await supabase.from('audit_logs').insert({
            user_id: user.id,
            table_name: 'products',
            action: 'INSERT',
            new_data: product
        });
    }

    setSaving(false);
    if (!error) navigate('/admin/products');
    else console.error('Error inserting product:', error);
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

  return (
    <AdminWrapper>
      <div className="max-w-3xl mx-auto px-6 py-vs-16">
        <header className="mb-12 border-b border-aluminum/20 pb-8">
          <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Nuovo Prodotto</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CollapsibleSection title="Informazioni Generali" isOpen={openSections.general} onToggle={() => toggleSection('general')}>
            <div className="space-y-6">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-aluminum mb-3">SKU</label>
                <input 
                  required
                  value={product.sku} 
                  onChange={e => setProduct({...product, sku: e.target.value})}
                  className="w-full border-b border-aluminum/40 bg-transparent py-2 focus:border-onyx outline-none text-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-aluminum mb-3">Titolo</label>
                <input 
                  required
                  value={product.title_it} 
                  onChange={e => setProduct({...product, title_it: e.target.value})}
                  className="w-full border-b border-aluminum/40 bg-transparent py-2 focus:border-onyx outline-none text-lg font-serif"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-aluminum mb-3">Prezzo</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={product.price} 
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
              content={product.description_it} 
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
              currentImages={product.image_urls} 
              onUpload={handleImageUpload} 
            />
          </CollapsibleSection>

          <button 
            disabled={saving}
            className="bg-onyx text-bone px-10 py-4 uppercase text-[10px] tracking-[0.2em] hover:bg-aluminum transition-all"
          >
            {saving ? 'Creazione...' : 'Crea Prodotto'}
          </button>
        </form>
      </div>
    </AdminWrapper>
  );
}
