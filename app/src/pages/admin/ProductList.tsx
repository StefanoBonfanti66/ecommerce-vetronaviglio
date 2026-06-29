import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import AdminWrapper from '../../components/admin/AdminWrapper';

function stripHtml(s: string): string {
  let prev = '';
  let result = s;
  while (result !== prev) {
    prev = result;
    result = result.replace(/<[^>]+>/g, '');
  }
  return result;
}

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    async function fetchProducts() {
      let query = supabase
        .from('products')
        .select('id, sku, title_it, price, description_it', { count: 'exact' })
        .order('sku', { ascending: true });

      if (searchTerm) {
        query = query.or(`sku.ilike.%${searchTerm}%,title_it.ilike.%${searchTerm}%`);
      }

      const { data, count, error } = await query
        .range(page * pageSize, (page + 1) * pageSize - 1);
        
      if (error) console.error(error);
      setProducts(data || []);
      setTotalCount(count || 0);
    }
    fetchProducts();
  }, [searchTerm, page]);

  return (
    <AdminWrapper>
      <header className="mb-vs-16 border-b border-aluminum/20 pb-vs-8 flex justify-between items-end">
        <h1 className="font-serif text-sub-heading uppercase tracking-[0.05em]">Catalogo Prodotti</h1>
        <div className="flex gap-4">
            <input 
                type="text"
                placeholder="Cerca per SKU o Titolo..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                className="border border-aluminum/20 p-2 text-sm focus:border-onyx outline-none"
            />
            <Link to="/admin/products/new" className="text-[10px] uppercase tracking-[0.2em] border border-onyx py-2 px-4 hover:bg-onyx hover:text-bone transition-all">
              Nuovo Prodotto
            </Link>
        </div>
      </header>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm border-collapse">
          <thead>
            <tr className="border-b border-aluminum/20 uppercase text-[9px] tracking-[0.2em] text-aluminum">
              <th className="py-4 w-32">SKU</th>
              <th className="py-4 w-[120px]">Titolo</th>
              <th className="py-4">Descrizione</th>
              <th className="py-4">Prezzo</th>
              <th className="py-4 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-aluminum/10">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-aluminum/5 transition-colors">
                <td className="py-4 font-medium tabular-nums w-32">{p.sku}</td>
                <td className="py-4 font-serif w-[120px] truncate">{p.title_it}</td>
                <td className="py-4 text-aluminum text-sm whitespace-normal max-w-sm">
                  {p.description_it ? stripHtml(p.description_it).replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').substring(0, 100) + (p.description_it.length > 100 ? '...' : '') : '—'}
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

      <div className="flex justify-between items-center mt-8">
        <span className="text-sm text-aluminum">Totale: {totalCount} prodotti</span>
        <div className="flex gap-2">
            <button 
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-aluminum/20 disabled:opacity-50"
            >
                Indietro
            </button>
            <button 
                disabled={(page + 1) * pageSize >= totalCount}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-aluminum/20 disabled:opacity-50"
            >
                Avanti
            </button>
        </div>
      </div>
    </AdminWrapper>
  );
}
