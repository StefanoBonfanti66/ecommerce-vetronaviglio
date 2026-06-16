import { useState } from 'react';

interface Product {
  id: string;
  sku: string;
  title_it: string;
  price: number;
  attributes: any;
  image_urls: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls[0] 
    : '';

  return (
    <div className="border border-aluminum/40 p-1 group hover:border-onyx transition-all duration-500 hover:shadow-lg">
      <div className="aspect-square mb-4 overflow-hidden bg-aluminum/5 flex items-center justify-center">
        {imageUrl && !hasError ? (
          <img 
            src={imageUrl} 
            alt={product.title_it} 
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[9px] text-aluminum uppercase tracking-[0.2em] font-medium p-4 text-center">
            IMAGE COMING SOON
          </div>
        )}
      </div>
      <div className="px-5 pb-5">
        <h3 className="font-serif text-lg mb-1">{product.title_it}</h3>
        <div className="font-sans text-[10px] uppercase tracking-[0.15em] text-aluminum mb-4 font-medium">
          {product.sku} · {product.attributes?.materiale || 'N/A'} · {product.attributes?.ml || 'N/A'}ML
        </div>
        <button className="w-full border border-onyx py-2 text-[10px] uppercase tracking-[0.15em] font-medium group-hover:bg-onyx group-hover:text-bone transition-all">
          Richiedi Campione
        </button>
      </div>
    </div>
  )
}
