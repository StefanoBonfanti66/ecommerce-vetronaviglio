import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import useIsAdmin from '../hooks/useIsAdmin';

interface Product {
  id: string;
  sku: string;
  title_it: string;
  title_en: string;
  price: number;
  attributes: any;
  image_urls: string[];
  stock_quantity?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const [hasError, setHasError] = useState(false);
  const { lang, t } = useLang();
  const { isAdmin } = useIsAdmin();

  const imageUrl = product.image_urls && product.image_urls.length > 0
    ? product.image_urls[0]
    : '';

  return (
    <div className="bg-white group cursor-pointer transition-all duration-300 relative">
      <Link to={`/product/${encodeURIComponent(product.sku)}`} className="block">
        <div className="aspect-square bg-surface relative overflow-hidden flex items-center justify-center">
          {imageUrl && !hasError ? (
            <img
              src={imageUrl}
              alt={product.title_it}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-20 border border-aluminum/20 rounded-sm opacity-30">
                <div className="absolute inset-3 bg-aluminum/5 rounded-sm" />
              </div>
            </div>
          )}
        </div>
        <div className="p-4 md:p-5 space-y-2 md:space-y-3">
          <h3 className="font-display text-lg md:text-xl font-semibold leading-tight group-hover:text-amber-accent transition-colors duration-300">
            {product[`title_${lang}`] || product.title_it}
          </h3>
          <div className="font-sans text-[10px] uppercase tracking-[0.15em] text-aluminum space-y-1">
            <p>
              {product.sku}
              {product.attributes?.materiale ? ` · ${product.attributes.materiale}` : ''}
              {product.attributes?.ml ? ` · ${product.attributes.ml}ml` : ''}
            </p>
          </div>
          <p className="font-sans text-sm font-medium text-amber-accent">
            €{Number(product.price).toFixed(2)} / {t('pieces')}
          </p>
          <span className="w-full border border-onyx py-3 text-[10px] uppercase tracking-[0.2em] font-medium group-hover:bg-onyx group-hover:text-bone transition-all duration-300 text-center block">
            {t('view_details')}
          </span>
        </div>
      </Link>
      {isAdmin && (
        <Link
          to={`/admin/products/edit/${product.sku}`}
          className="absolute top-2 right-2 p-1.5 bg-onyx/80 hover:bg-onyx text-bone rounded transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="Modifica prodotto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
      )}
    </div>
  );
}