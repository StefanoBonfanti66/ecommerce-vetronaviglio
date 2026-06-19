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
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const { lang, t } = useLang();

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

  const hasActiveFilters = activeCategory !== 'Tutti' || activeCapacity !== 'Tutti' || activeMaterial !== 'Tutti' || skuSearch !== '';

  const resetAll = () => {
    setActiveCategory('Tutti');
    setActiveCapacity('Tutti');
    setActiveMaterial('Tutti');
    setSkuSearch('');
    setCurrentPage(1);
    window.history.replaceState({}, '', '/catalog');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
          {collectionSlug ? collectionSlug.toUpperCase() : t('catalog_title')}
        </h1>
        {!collectionSlug && (
          <p className="font-sans text-[11px] text-aluminum mt-2 uppercase tracking-[0.15em]">
            {processedProducts.length} {t('pieces')}
          </p>
        )}
      </div>

      {/* Filter bar */}
      <div className="mb-8 space-y-4">
        {/* Primary: categories */}
        <div className="flex flex-wrap items-center gap-3">
          {filters.categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
              className={`font-sans text-[10px] uppercase tracking-[0.15em] px-4 py-2 border whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-onyx text-bone border-onyx'
                  : 'border-aluminum/20 text-aluminum hover:border-onyx hover:text-onyx'
              }`}
            >
              {cat === 'Tutti' ? t('all') : (t(cat) || cat)}
            </button>
          ))}

          {/* Filter toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`font-sans text-[10px] uppercase tracking-[0.15em] px-4 py-2 border whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
              filtersOpen || hasActiveFilters
                ? 'border-amber-accent/40 text-amber-accent'
                : 'border-aluminum/20 text-aluminum hover:border-onyx hover:text-onyx'
            }`}
          >
            {lang === 'it' ? 'Filtri' : 'Filters'}
            {hasActiveFilters && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-amber-accent align-middle" />}
          </button>
        </div>

        {/* Active filter chips (visible when secondary filters are active but panel is closed) */}
        {hasActiveFilters && !filtersOpen && (
          <div className="flex flex-wrap items-center gap-2">
            {activeCategory !== 'Tutti' && (
              <span className="inline-flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border border-amber-accent/30 text-amber-accent">
                {activeCategory}
                <button onClick={() => { setActiveCategory('Tutti'); setCurrentPage(1); }} className="hover:text-onyx transition-colors">✕</button>
              </span>
            )}
            {activeCapacity !== 'Tutti' && (
              <span className="inline-flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border border-aluminum/20 text-aluminum">
                {activeCapacity}
                <button onClick={() => { setActiveCapacity('Tutti'); setCurrentPage(1); }} className="hover:text-onyx transition-colors">✕</button>
              </span>
            )}
            {activeMaterial !== 'Tutti' && (
              <span className="inline-flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border border-aluminum/20 text-aluminum">
                {activeMaterial}
                <button onClick={() => { setActiveMaterial('Tutti'); setCurrentPage(1); }} className="hover:text-onyx transition-colors">✕</button>
              </span>
            )}
            {skuSearch && (
              <span className="inline-flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border border-aluminum/20 text-aluminum">
                SKU: {skuSearch}
                <button onClick={() => { setSkuSearch(''); setCurrentPage(1); }} className="hover:text-onyx transition-colors">✕</button>
              </span>
            )}
          </div>
        )}

        {/* Secondary filters (collapsible) */}
        {filtersOpen && (
          <div className="bg-white border border-aluminum/10 p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Capacity */}
              <div className="space-y-2">
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-aluminum font-medium">{t('capacity')}</p>
                <div className="flex flex-wrap gap-2">
                  {filters.capacities.map(cap => (
                    <button
                      key={cap}
                      onClick={() => { setActiveCapacity(cap); setCurrentPage(1); }}
                      className={`font-sans text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border transition-all ${
                        activeCapacity === cap
                          ? 'bg-onyx text-bone border-onyx'
                          : 'border-aluminum/20 text-aluminum hover:border-onyx'
                      }`}
                    >
                      {cap === 'Tutti' ? t('all') : cap}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div className="space-y-2">
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-aluminum font-medium">{t('material')}</p>
                <div className="flex flex-wrap gap-2">
                  {filters.materials.map(mat => (
                    <button
                      key={mat}
                      onClick={() => { setActiveMaterial(mat); setCurrentPage(1); }}
                      className={`font-sans text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border transition-all ${
                        activeMaterial === mat
                          ? 'bg-onyx text-bone border-onyx'
                          : 'border-aluminum/20 text-aluminum hover:border-onyx'
                      }`}
                    >
                      {mat === 'Tutti' ? t('all') : (t(mat) || mat)}
                    </button>
                  ))}
                </div>
              </div>

              {/* SKU Search */}
              <div className="space-y-2">
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-aluminum font-medium">{t('search_sku')}</p>
                <input
                  type="text"
                  className="font-sans text-[11px] border border-aluminum/20 py-2 px-3 w-full bg-transparent text-onyx placeholder:text-aluminum/50"
                  placeholder="SKU..."
                  value={skuSearch}
                  onChange={e => { setSkuSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetAll}
                className="font-sans text-[9px] uppercase tracking-[0.2em] text-aluminum hover:text-onyx transition-colors underline underline-offset-4"
              >
                {t('reset_catalog')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Products grid */}
      {processedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {paginatedProducts.map((product) => (
              <Link key={product.id} to={`/product/${encodeURIComponent(product.sku)}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="font-sans text-[10px] uppercase tracking-[0.2em] text-onyx disabled:text-aluminum/30 transition-colors cursor-pointer disabled:cursor-default"
              >
                {t('previous')}
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`font-sans text-[11px] w-8 h-8 flex items-center justify-center transition-all ${
                      page === currentPage
                        ? 'bg-onyx text-bone'
                        : 'text-aluminum hover:text-onyx'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="font-sans text-[10px] uppercase tracking-[0.2em] text-onyx disabled:text-aluminum/30 transition-colors cursor-pointer disabled:cursor-default"
              >
                {t('next')}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-20 text-center flex flex-col items-center">
          <p className="font-display text-lg italic text-aluminum">
            {t('no_products')}
          </p>
          <button
            onClick={resetAll}
            className="mt-6 font-sans text-[10px] uppercase tracking-[0.2em] py-3 px-6 border border-onyx hover:bg-onyx hover:text-bone transition-all"
          >
            {t('reset_catalog')}
          </button>
        </div>
      )}
    </div>
  );
}