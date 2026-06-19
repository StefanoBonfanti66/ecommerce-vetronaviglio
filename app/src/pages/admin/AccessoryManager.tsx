import AdminWrapper from "../../components/admin/AdminWrapper";
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function AccessoryManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [newRule, setNewRule] = useState({ product_id: '', accessory_id: '', action: 'FORCE_INCLUDE' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // Carica prodotti (tutti)
    const { data: p } = await supabase.from('products').select('id, title_it, sku, is_accessory').order('title_it');
    
    // Carica regole esistenti con join per nomi
    const { data: r } = await supabase
        .from('product_accessory_overrides')
        .select(`
            action,
            product:products!product_accessory_overrides_product_id_fkey(title_it, sku),
            accessory:products!product_accessory_overrides_accessory_id_fkey(title_it, sku)
        `);
    
    setProducts(p || []);
    setRules(r || []);
  }

  async function addRule(e: React.FormEvent) {
    e.preventDefault();
    if (!newRule.product_id || !newRule.accessory_id) return alert('Seleziona entrambi i prodotti');
    
    await supabase.from('product_accessory_overrides').insert(newRule);
    setNewRule({ ...newRule, product_id: '', accessory_id: '' });
    fetchData();
  }

  return (
    <AdminWrapper>
      <div className="max-w-5xl mx-auto px-6 py-vs-16">
        <header className="mb-12 border-b border-aluminum/20 pb-8">
          <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Gestione Accessori</h1>
        </header>
        
        <form onSubmit={addRule} className="p-6 border border-aluminum/20 mb-8 bg-aluminum/5">
          <h2 className="font-serif text-lg mb-6 uppercase tracking-[0.05em]">Crea nuova regola di compatibilità</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select onChange={e => setNewRule({...newRule, product_id: e.target.value})} className="border p-2 bg-transparent text-sm">
                  <option value="">Prodotto Principale</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.title_it}</option>)}
              </select>
              <select onChange={e => setNewRule({...newRule, accessory_id: e.target.value})} className="border p-2 bg-transparent text-sm">
                  <option value="">Accessorio</option>
                  {products.filter(p => p.is_accessory).map(p => <option key={p.id} value={p.id}>{p.sku} - {p.title_it}</option>)}
              </select>
              <select onChange={e => setNewRule({...newRule, action: e.target.value})} className="border p-2 bg-transparent text-sm">
                  <option value="FORCE_INCLUDE">Forza Inclusione</option>
                  <option value="FORCE_EXCLUDE">Forza Esclusione</option>
              </select>
          </div>
          <button className="mt-6 bg-onyx text-bone px-8 py-2 uppercase text-[10px] tracking-[0.2em] hover:bg-aluminum transition-all">
              Salva Regola
          </button>
        </form>

        <div className="border border-aluminum/20">
          <h2 className="p-4 font-serif text-lg uppercase tracking-[0.05em] border-b border-aluminum/20">Regole attive</h2>
          {rules.map((rule, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border-b border-aluminum/10 last:border-0">
                  <span className="text-xs text-aluminum">
                      <strong className="text-onyx">{rule.product.title_it}</strong> ({rule.product.sku}) 
                      <span className="mx-2 uppercase">{rule.action === 'FORCE_INCLUDE' ? 'include' : 'esclude'}</span>
                      <strong className="text-onyx">{rule.accessory.title_it}</strong> ({rule.accessory.sku})
                  </span>
              </div>
          ))}
        </div>
      </div>
    </AdminWrapper>
  );
}
