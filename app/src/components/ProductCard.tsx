import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import notImage from '../assets/not-image.png';

interface Product {
  id: string;
  sku: string;
  title_it: string;
  title_en: string;
  price: number;
  attributes: any;
  image_urls: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const [hasError, setHasError] = useState(false);
  const { addToCart } = useCart();
  const { lang, t } = useLang();
  
  const imageUrl = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls[0] 
    : '';

  return (
    <div className="border border-aluminum/40 p-1 group hover:border-onyx transition-all duration-500 hover:shadow-lg h-full flex flex-col">
      <div className="aspect-square mb-2 md:mb-4 overflow-hidden bg-aluminum/5 flex items-center justify-center">
        {imageUrl && !hasError ? (
          <img 
            src={imageUrl} 
            alt={product.title_it} 
            className="w-full h-full object-contain p-1 md:p-2 group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={() => setHasError(true)}
          />
        ) : (
          <img src={notImage} alt="No image available" className="w-full h-full object-contain p-2 opacity-50" />
        )}
      </div>
      <div className="px-2 md:px-5 pb-3 md:pb-5 flex-grow flex flex-col justify-end">
        <h3 className="font-serif text-sm md:text-lg mb-1">{product[`title_${lang}`] || product.title_it}</h3>
        <div className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.15em] text-aluminum mb-2 md:mb-4 font-medium">
          {product.sku} · {product.attributes?.materiale || 'N/A'} · {product.attributes?.ml || 'N/A'}ML
        </div>
        <button 
          onClick={(e) => {
              e.preventDefault();
              addToCart(product, 'sale');
          }}
          className="w-full border border-onyx py-2 text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-medium group-hover:bg-onyx group-hover:text-bone transition-all"
        >
          {t('add_to_cart')}
        </button>
      </div>
    </div>
  )
}
