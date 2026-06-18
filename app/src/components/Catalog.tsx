import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ProductCard from './ProductCard';
import { useLang } from '../context/LanguageContext';

const ITEMS_PER_PAGE = 16;

export default function Catalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Tutti');
  const [activeCapacity, setActiveCapacity] = useState<string>('Tutti');
  const [activeMaterial, setActiveMaterial] = useState<string>('Tutti');
  const [skuSearch, setSkuSearch] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const { lang } = useLang();
  
  const [searchParams] = useSearchParams();
  const collectionSlug = searchParams.get('collection');

  useEffect(() => {
    async function fetchProducts() {
      if (collectionSlug) {
        const { data, error } = await supabase
          .from('product_collections')
          .select('products(*), collections!inner(slug)')
          .eq('collections.slug', collectionSlug)
          .eq('products.is_active', true);
        
        if (error) console.error('Error fetching relations:', error);
        setProducts(data ? data.map(item => item.products).filter(p => p.stock_quantity > 0) : []);
      } else {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .gt('stock_quantity', 0);
        if (error) console.error('Error fetching products:', error);
        setProducts(data || []);
      }
      setCurrentPage(1);
    }
    fetchProducts();
  }, [collectionSlug]);

  const filters = useMemo(() => {
    const catsSet = new Set(products.map(p => p.attributes?.categoria || 'Varie'));
    const capsSet = new Set(products.map(p => p.attributes?.ml ? `${p.attributes.ml}ml` : 'N/A'));
    const matsSet = new Set(products.map(p => p.attributes?.materiale || 'Varie'));
    
    const catsArray = Array.from(catsSet).sort();
    const capsArray = Array.from(capsSet).filter(c => c !== 'N/A').sort((a, b) => parseInt(a) - parseInt(b));
    const matsArray = Array.from(matsSet).sort();
    
    const finalCaps = ['Tutti', ...capsArray];
    if (capsSet.has('N/A')) finalCaps.push('N/A');
    
    return {
      categories: ['Tutti', ...catsArray],
      capacities: finalCaps,
      materials: ['Tutti', ...matsArray]
    };
  }, [products]);

  const processedProducts = useMemo(() => {
    let list = products.filter(p => {
      const catMatch = activeCategory === 'Tutti' || (p.attributes?.[`categoria_${lang}`] || p.attributes?.categoria || 'Varie') === activeCategory;
      const capMatch = activeCapacity === 'Tutti' || (p.attributes?.ml ? `${p.attributes.ml}ml` : 'N/A') === activeCapacity;
      const matMatch = activeMaterial === 'Tutti' || (p.attributes?.materiale || 'Varie') === activeMaterial;
      const skuMatch = skuSearch === '' || p.sku.toLowerCase().includes(skuSearch.toLowerCase());
      return catMatch && capMatch && matMatch && skuMatch;
    });
    return list.sort((a, b) => (a[`title_${lang}`] || a.title_it).localeCompare(b[`title_${lang}`] || b.title_it));
  }, [products, activeCategory, activeCapacity, activeMaterial, skuSearch, lang]);

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    return processedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [processedProducts, currentPage]);

  const promoContents = [
    { title: "Qualità Industriale", text: "Standard di eccellenza nel packaging primario." },
    { title: "Design Italiano", text: "Estetica e funzionalità al servizio del beauty." },
    { title: "Customizzazione", text: "Serigrafia e laccatura su misura per il tuo brand." }
  ];

  const getPromo = (index: number) => promoContents[index % promoContents.length];

  const FilterButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`text-xs uppercase tracking-[0.15em] py-2 px-4 border transition-all ${
        active 
          ? 'bg-onyx text-bone border-onyx' 
          : 'bg-transparent text-onyx border-aluminum/30 hover:border-onyx'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-vs-8 md:py-vs-16">
      <header className="mb-vs-8 md:mb-vs-16 border-b border-aluminum/20 pb-vs-4 md:pb-vs-8">
        <h1 className="font-serif text-3xl md:text-5xl uppercase tracking-[0.05em] mb-4 md:mb-8">
          {collectionSlug ? `Collezione ${collectionSlug.toUpperCase()}` : 'Catalogo Prodotti'}
        </h1>
        
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-[9px] uppercase tracking-[0.2em] text-aluminum mr-2">Categoria:</span>
            {filters.categories.map(cat => (
              <FilterButton key={cat} label={cat} active={activeCategory === cat} onClick={() => { setActiveCategory(cat); setCurrentPage(1); }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-[9px] uppercase tracking-[0.2em] text-aluminum mr-2">Capacità:</span>
            {filters.capacities.map(cap => (
              <FilterButton key={cap} label={cap} active={activeCapacity === cap} onClick={() => { setActiveCapacity(cap); setCurrentPage(1); }} />
            ))}
          </div>
           <div className="flex flex-wrap gap-3 items-center">
             <span className="text-[9px] uppercase tracking-[0.2em] text-aluminum mr-2">Materiale:</span>
             {filters.materials.map(mat => (
               <FilterButton key={mat} label={mat} active={activeMaterial === mat} onClick={() => { setActiveMaterial(mat); setCurrentPage(1); }} />
             ))}
           </div>
           <div className="flex flex-wrap gap-3 items-center pt-4">
             <span className="text-[9px] uppercase tracking-[0.2em] text-aluminum mr-2">Cerca SKU:</span>
             <input 
                type="text" 
                className="border border-aluminum/30 p-2 text-xs w-48"
                placeholder="Inserisci SKU..."
                value={skuSearch}
                onChange={e => { setSkuSearch(e.target.value); setCurrentPage(1); }}
             />
           </div>
         </div>
      </header>


      {processedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {paginatedProducts.map((product) => (
              <Link key={product.id} to={`/product/${encodeURIComponent(product.sku)}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
          
          <div className="bg-aluminum/5 p-12 border border-aluminum/10 my-16 text-center">
            <h3 className="font-serif text-3xl mb-4">{getPromo(currentPage).title}</h3>
            <p className="max-w-xl mx-auto text-aluminum">{getPromo(currentPage).text}</p>
          </div>

          {totalPages > 1 && (
            <div className="mt-vs-16 flex justify-center gap-4">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="text-xs uppercase tracking-[0.2em] py-2 px-4 border border-onyx disabled:opacity-30"
              >
                Precedente
              </button>
              <span className="text-xs py-2 px-4 text-aluminum">Pagina {currentPage} di {totalPages}</span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="text-xs uppercase tracking-[0.2em] py-2 px-4 border border-onyx disabled:opacity-30"
              >
                Successiva
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-20 text-center flex flex-col items-center">
          <p className="font-serif text-lg italic text-aluminum">
            Nessun prodotto trovato per questi criteri.
          </p>
          <button 
            onClick={() => {
              setActiveCategory('Tutti');
              setActiveCapacity('Tutti');
              setActiveMaterial('Tutti');
              setSkuSearch('');
              window.history.replaceState({}, '', '/catalog');
            }} 
            className="mt-6 text-xs uppercase tracking-[0.2em] py-3 px-6 border border-onyx hover:bg-onyx hover:text-bone transition-all"
          >
            Ripristina catalogo
          </button>
        </div>
      )}
    </div>
  );
}
