import AdminWrapper from "../../components/admin/AdminWrapper";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Papa from 'papaparse';

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
    await supabase.from('price_lists').insert({ name: newListName, discount_percentage: 0 });
    setNewListName('');
    fetchPriceLists();
  }

  async function updateDiscount(id: string, discount: number) {
      await supabase.from('price_lists').update({ discount_percentage: discount }).eq('id', id);
      fetchPriceLists();
  }

  async function exportPriceList(listId: string, listName: string) {
      const { data } = await supabase
          .from('price_list_items')
          .select('sku, price')
          .eq('price_list_id', listId);

      if (!data || data.length === 0) {
          alert('Listino vuoto');
          return;
      }

      const csvData = data.map(item => ({
          SKU: item.sku,
          Prezzo: item.price
      }));
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `listino_${listName.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  return (
    <AdminWrapper><div className="max-w-4xl mx-auto px-6 py-vs-16">
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
            <div key={list.id} className="p-4 border-b border-aluminum/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                <span className="font-medium">{list.name}</span>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase">Sconto %:</span>
                    <input 
                        type="number" 
                        value={list.discount_percentage || 0} 
                        onChange={(e) => updateDiscount(list.id, parseFloat(e.target.value))}
                        className="w-16 p-1 border border-aluminum/40 text-center"
                    />
                    <button onClick={() => duplicatePriceList(list)} className="text-xs uppercase underline text-aluminum hover:text-onyx">Duplica</button>
                    <button onClick={() => exportPriceList(list.id, list.name)} className="text-xs uppercase underline text-aluminum hover:text-onyx">Esporta CSV</button>
                    <Link to={`/admin/price-lists/${list.id}`} className="text-xs uppercase underline">Gestisci Prodotti</Link>
                </div>
            </div>
        ))}
      </div>
    </div></AdminWrapper>
  );
}
