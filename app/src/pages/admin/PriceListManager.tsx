import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function PriceListManager() {
  const [priceLists, setPriceLists] = useState<any[]>([]);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    fetchPriceLists();
  }, []);

  async function fetchPriceLists() {
    const { data } = await supabase.from('price_lists').select('*');
    setPriceLists(data || []);
  }

  async function createPriceList() {
    if (!newListName) return;
    await supabase.from('price_lists').insert({ name: newListName });
    setNewListName('');
    fetchPriceLists();
  }

  async function duplicatePriceList(list: any) {
    const { data: newList } = await supabase.from('price_lists').insert({ name: `${list.name} (Copia)` }).select().single();
    if (!newList) return;

    const { data: items } = await supabase.from('price_list_items').select('*').eq('price_list_id', list.id);
    if (items) {
        const newItems = items.map(i => ({ price_list_id: newList.id, sku: i.sku, price: i.price }));
        await supabase.from('price_list_items').insert(newItems);
    }
    fetchPriceLists();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Gestione Listini</h1>
      </header>

      <div className="mb-8 p-6 border border-aluminum/20 bg-aluminum/5">
        <h2 className="font-serif text-lg mb-4 uppercase">Crea nuovo listino</h2>
        <div className="flex gap-4">
            <input 
                className="flex-grow p-2 border border-aluminum/40 bg-transparent"
                placeholder="Nome Listino"
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
            />
            <button onClick={createPriceList} className="bg-onyx text-bone px-6 py-2 uppercase text-[10px] tracking-[0.2em]">Crea</button>
        </div>
      </div>

      <div className="border border-aluminum/20">
        {priceLists.map(list => (
            <div key={list.id} className="p-4 border-b border-aluminum/10 flex justify-between items-center text-sm">
                <span className="font-medium">{list.name}</span>
                <div className="flex gap-4">
                    <button onClick={() => duplicatePriceList(list)} className="text-xs uppercase underline text-aluminum hover:text-onyx">Duplica</button>
                    <Link to={`/admin/price-lists/${list.id}`} className="text-xs uppercase underline">Gestisci Prodotti</Link>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
