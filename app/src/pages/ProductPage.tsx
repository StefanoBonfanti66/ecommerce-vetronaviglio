import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { sku } = useParams<{ sku: string }>();
  const [product, setProduct] = useState<any>(null);
  const [accessories, setAccessories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProductData() {
      if (!sku) return;
      
      // 1. Fetch prodotto
      const { data: p, error: pError } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single();
      
      if (pError || !p) {
        console.error('Error:', pError);
        setLoading(false);
        return;
      }
      setProduct(p);

      // 2. Fetch accessori (FORCE_INCLUDE)
      const { data: accData, error: accError } = await supabase
        .from('product_accessory_overrides')
        .select(`
          accessory:products!product_accessory_overrides_accessory_id_fkey(
            id, title_it, sku
          )
        `)
        .eq('product_id', p.id)
        .eq('action', 'FORCE_INCLUDE');
      
      console.log('Accessory fetch result:', accData, accError);
      
      if (accData) {
          setAccessories(accData.map((item: any) => item.accessory));
      }

      
      setLoading(false);
    }
    fetchProductData();
  }, [sku]);

  const handleAddToCart = async (type: 'sale' | 'sample') => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/login');
      return;
    }
    
    addToCart(product, type);
    alert(type === 'sample' ? 'Campione aggiunto alla richiesta' : 'Prodotto aggiunto al carrello');
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
              { label: 'Pezzi per scatola', value: `${product.box_quantity || 0}` },
            ].map(attr => (
              <div key={attr.label}>
                <div className="text-[9px] uppercase tracking-[0.2em] text-aluminum mb-1">{attr.label}</div>
                <div className="text-sm font-medium">{attr.value}</div>
              </div>
            ))}
          </div>

          {/* Accessori */}
          {accessories.length > 0 && (
              <div className="py-4">
                  <div className="text-[9px] uppercase tracking-[0.2em] text-aluminum mb-3">Accessori compatibili</div>
                  <div className="flex gap-4">
                      {accessories.map(acc => (
                          <Link key={acc.sku} to={`/product/${acc.sku}`} className="text-xs border border-aluminum/20 p-2 hover:border-onyx transition-colors">
                              {acc.title_it}
                          </Link>
                      ))}
                  </div>
              </div>
          )}

          <div className="space-y-4 pt-4">
            <button 
                onClick={() => handleAddToCart('sale')}
                className="w-full bg-onyx text-bone py-4 uppercase text-xs tracking-[0.2em] hover:bg-aluminum transition-colors font-medium"
            >
                Aggiungi al carrello
            </button>
            <button 
                onClick={() => handleAddToCart('sample')}
                className="w-full border border-onyx text-onyx py-4 uppercase text-xs tracking-[0.2em] hover:bg-aluminum/10 transition-colors"
            >
                Richiedi Campione
            </button>
            <p className="text-[10px] text-aluminum text-center pt-2">
                * La merce è gratuita. Spedizione a carico del cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
