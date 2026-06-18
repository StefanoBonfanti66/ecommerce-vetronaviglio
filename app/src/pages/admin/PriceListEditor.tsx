import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Papa from 'papaparse';

export default function PriceListEditor() {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ sku: '', price: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    const { data: listData } = await supabase.from('price_lists').select('*').eq('id', id).single();
    setList(listData);
    
    const { data: itemsData } = await supabase.from('price_list_items').select('sku, price').eq('price_list_id', id);
    setItems(itemsData || []);
    
    const { data: prodData } = await supabase.from('products').select('sku, title_it, price');
    setProducts(prodData || []);
  }

  const filteredProducts = products.filter(p => 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.title_it.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function addItem() {
    if (!newItem.sku || newItem.price <= 0) return;
    await supabase.from('price_list_items').insert({ price_list_id: id, sku: newItem.sku, price: newItem.price });
    setNewItem({ sku: '', price: 0 });
    fetchData();
  }

  async function removeItem(sku: string) {
    await supabase.from('price_list_items').delete().eq('price_list_id', id).eq('sku', sku);
    fetchData();
  }

  const handleExport = () => {
      const data = items.map(item => ({
          Listino: list.name,
          SKU: item.sku,
          Prezzo: item.price
      }));
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `listino_${list.name.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  if (!list) return <div className="p-12">Caricamento...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8 flex justify-between items-center">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Listino: {list.name}</h1>
        <button onClick={handleExport} className="border border-onyx px-6 py-2 uppercase text-[10px] tracking-[0.2em] hover:bg-aluminum/10 transition-all">
            Esporta CSV
        </button>
      </header>

      <div className="mb-8 p-6 border border-aluminum/20 bg-aluminum/5 space-y-4">
        <h2 className="font-serif text-lg uppercase">Aggiungi prodotto al listino</h2>
        <input 
            className="w-full p-2 border border-aluminum/40 bg-transparent text-xs mb-2"
            placeholder="Cerca prodotto (SKU o Titolo)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-4">
            <select className="flex-grow p-2 border border-aluminum/40 bg-transparent text-xs" value={newItem.sku} onChange={e => {
                const selectedProd = products.find(p => p.sku === e.target.value);
                setNewItem({...newItem, sku: e.target.value, price: selectedProd?.price || 0});
            }}>
                <option value="">Seleziona SKU</option>
                {filteredProducts.map(p => <option key={p.sku} value={p.sku}>{p.sku} - {p.title_it} (Base: €{p.price})</option>)}
            </select>
            <input type="number" step="0.01" className="w-32 p-2 border border-aluminum/40 bg-transparent text-xs" placeholder="Prezzo Custom" value={newItem.price} onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})} />
            <button onClick={addItem} className="bg-onyx text-bone px-6 py-2 uppercase text-[10px] tracking-[0.2em]">Aggiungi</button>
        </div>
      </div>

      <div className="border border-aluminum/20">
        {items.map(item => (
            <div key={item.sku} className="grid grid-cols-3 gap-4 p-4 border-b border-aluminum/10 items-center text-xs">
                <span>{item.sku}</span>
                <span className="text-right">€ {item.price.toFixed(2)}</span>
                <button onClick={() => removeItem(item.sku)} className="text-red-600 uppercase text-right">Rimuovi</button>
            </div>
        ))}
      </div>
    </div>
  );
}
