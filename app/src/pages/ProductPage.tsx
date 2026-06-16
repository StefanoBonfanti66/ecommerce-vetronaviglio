import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { sku } = useParams<{ sku: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      if (!sku) return;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single();
      
      if (error) console.error('Error:', error);
      else {
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [sku]);

  const handleAddToCart = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/login');
      return;
    }
    
    addToCart(product);
    alert('Prodotto aggiunto alla richiesta di campionatura');
  };

  if (loading) return <div className="p-12">Caricamento...</div>;
  if (!product) return <div className="p-12">Prodotto non trovato</div>;

  const attributes = product.attributes || {};
  const displayTitle = `${product.title_it} ${attributes.ml ? `· ${attributes.ml}ml` : ''} ${attributes.colore ? `· ${attributes.colore}` : ''}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-vs-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-vs-16">
        {/* Sinistra: Galleria (Sticky) */}
        <div className="md:col-span-6 sticky top-24 self-start">
          <div className="aspect-square bg-aluminum/5 border border-aluminum/20 flex items-center justify-center">
            {product.image_urls && product.image_urls.length > 0 ? (
              <img src={product.image_urls[0]} alt={product.title_it} className="w-full h-full object-contain p-8" />
            ) : (
              <span className="text-[10px] uppercase tracking-[0.2em] text-aluminum">Image coming soon</span>
            )}
          </div>
        </div>

        {/* Destra: Dettagli */}
        <div className="md:col-span-6 space-y-vs-8">
          <div>
            <h1 className="font-serif text-5xl mb-2">{displayTitle}</h1>
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-aluminum">{product.sku}</p>
          </div>

          <div className="text-2xl font-light">€{product.price}</div>

          <p 
            className="font-sans leading-relaxed text-onyx/80"
            dangerouslySetInnerHTML={{ __html: product.description_it || 'Descrizione non disponibile.' }}
          />

          {/* Griglia Tecnica */}
          <div className="grid grid-cols-2 gap-y-6 py-8 border-y border-aluminum/20">
            {[
              { label: 'Capacità', value: attributes.ml ? `${attributes.ml} ml` : 'N/A' },
              { label: 'Materiale', value: attributes.materiale || 'N/A' },
              { label: 'Imboccatura', value: attributes.imboccatura || 'N/A' },
              { label: 'Finitura', value: attributes.finitura || 'N/A' },
            ].map(attr => (
              <div key={attr.label}>
                <div className="text-[9px] uppercase tracking-[0.2em] text-aluminum mb-1">{attr.label}</div>
                <div className="text-sm font-medium">{attr.value}</div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-onyx text-bone py-4 uppercase text-xs tracking-[0.2em] hover:bg-aluminum transition-colors"
          >
            Richiedi Campione
          </button>
        </div>
      </div>
    </div>
  );
}
