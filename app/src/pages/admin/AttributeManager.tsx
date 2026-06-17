import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { PREDEFINED_ATTRIBUTES } from '../../constants/attributes';

export default function AttributeManager() {
  const [options, setOptions] = useState<any[]>([]);
  const [newAttribute, setNewAttribute] = useState({ key: PREDEFINED_ATTRIBUTES[0], value: '' });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKey, setFilterKey] = useState('tutti');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchOptions();
  }, [page, searchTerm, filterKey]);

  async function fetchOptions() {
    setLoading(true);
    let query = supabase.from('attribute_options').select('*', { count: 'exact' });
    
    if (filterKey !== 'tutti') {
        query = query.eq('attribute_key', filterKey);
    }
    if (searchTerm) {
        query = query.ilike('value', `%${searchTerm}%`);
    }

    const { data, count } = await query
        .order('attribute_key')
        .order('value')
        .range(page * pageSize, (page + 1) * pageSize - 1);

    setOptions(data || []);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.from('attribute_options').insert(newAttribute);
    setNewAttribute({ ...newAttribute, value: '' });
    fetchOptions();
  }

  async function handleDelete(id: number) {
    await supabase.from('attribute_options').delete().eq('id', id);
    fetchOptions();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Configurazione Attributi</h1>
      </header>

      <form onSubmit={handleAdd} className="mb-12 p-6 border border-aluminum/20 bg-aluminum/5">
        <h2 className="font-serif text-lg mb-6 uppercase tracking-[0.05em]">Aggiungi Opzione</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select 
                value={newAttribute.key} 
                onChange={e => setNewAttribute({...newAttribute, key: e.target.value})}
                className="border-b border-aluminum/40 bg-transparent py-2 outline-none"
            >
                {PREDEFINED_ATTRIBUTES.map(attr => <option key={attr} value={attr}>{attr}</option>)}
            </select>
            <input 
                placeholder="Nuovo valore..."
                value={newAttribute.value}
                onChange={e => setNewAttribute({...newAttribute, value: e.target.value})}
                className="border-b border-aluminum/40 bg-transparent py-2 outline-none"
            />
        </div>
        <button className="mt-6 bg-onyx text-bone px-8 py-2 uppercase text-[10px] tracking-[0.2em] hover:bg-aluminum transition-all">
            {loading ? '...' : 'Aggiungi'}
        </button>
      </form>

      <div className="mb-6 flex gap-4">
        <select value={filterKey} onChange={e => { setFilterKey(e.target.value); setPage(0); }} className="border border-aluminum/20 p-2 text-xs">
            <option value="tutti">Tutti i tipi</option>
            {PREDEFINED_ATTRIBUTES.map(attr => <option key={attr} value={attr}>{attr}</option>)}
        </select>
        <input 
            placeholder="Cerca valore..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
            className="border border-aluminum/20 p-2 text-xs flex-grow"
        />
      </div>

      <div className="border border-aluminum/20 divide-y divide-aluminum/10">
        {options.map((opt) => (
            <div key={opt.id} className="flex justify-between items-center p-4">
                <span className="font-mono text-xs text-aluminum">{opt.attribute_key}: <span className="text-onyx font-sans">{opt.value}</span></span>
                <button onClick={() => handleDelete(opt.id)} className="text-red-500 hover:text-red-700 text-xs uppercase">Elimina</button>
            </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-4 text-xs text-aluminum">
         <button disabled={page === 0} onClick={() => setPage(page-1)}>Indietro</button>
         <span>Pagina {page + 1}</span>
         <button onClick={() => setPage(page+1)}>Avanti</button>
      </div>
    </div>
  );
}
