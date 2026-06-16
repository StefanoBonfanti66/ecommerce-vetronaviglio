import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      // Query con ordinamento alfabetico per SKU e descrizione
      const { data } = await supabase
        .from('products')
        .select('id, sku, title_it, price, description_it')
        .order('sku', { ascending: true });
        
      setProducts(data || []);
    }
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-vs-16">
      <header className="mb-vs-16 border-b border-aluminum/20 pb-vs-8 flex justify-between items-end">
        <h1 className="font-serif text-sub-heading uppercase tracking-[0.05em]">Catalogo Prodotti</h1>
        <Link to="/admin/products/new" className="text-[10px] uppercase tracking-[0.2em] border border-onyx py-2 px-4 hover:bg-onyx hover:text-bone transition-all">
          Nuovo Prodotto
        </Link>
      </header>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm border-collapse">
          <thead>
            <tr className="border-b border-aluminum/20 uppercase text-[9px] tracking-[0.2em] text-aluminum">
              <th className="py-4 w-32">SKU</th>
              <th className="py-4">Titolo</th>
              <th className="py-4 w-1/3">Descrizione</th>
              <th className="py-4">Prezzo</th>
              <th className="py-4 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-aluminum/10">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-aluminum/5 transition-colors">
                <td className="py-4 font-medium tabular-nums w-32">{p.sku}</td>
                <td className="py-4 font-serif">{p.title_it}</td>
                <td className="py-4 text-aluminum text-sm whitespace-normal max-w-sm">
                  {p.description_it ? p.description_it.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').substring(0, 100) + (p.description_it.length > 100 ? '...' : '') : '—'}
                </td>
                <td className="py-4 tabular-nums">€{p.price}</td>
                <td className="py-4 text-right">
                  <Link to={`/admin/products/edit/${p.sku}`} className="text-aluminum hover:text-onyx uppercase text-[9px] tracking-[0.2em]">Modifica</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
