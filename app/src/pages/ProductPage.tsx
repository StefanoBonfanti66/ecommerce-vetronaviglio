import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { sku } = useParams<{ sku: string }>();
  const [product, setProduct] = useState<any>(null);
  const [boxes, setBoxes] = useState(1);
  const [accessories, setAccessories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllData() {
      if (!sku) return;
      
      // 1. Fetch prodotto
      const { data: p, error: pError } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single();
      
      // 2. Fetch impostazioni
      const { data: sData } = await supabase.from('settings').select('key, value');
      
      if (sData) {
        const settingsMap = sData.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
        setSettings(settingsMap);
      }
      
      if (pError || !p) {
        console.error('Error:', pError);
        setLoading(false);
        return;
      }
      setProduct(p);
      // ... (existing accessory fetch)

      const { data: accData } = await supabase
        .from('product_accessory_overrides')
        .select(`
          accessory:products!product_accessory_overrides_accessory_id_fkey(
            id, title_it, sku
          )
        `)
        .eq('product_id', p.id)
        .eq('action', 'FORCE_INCLUDE');
      
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
    
    const totalQuantity = boxes * (product.box_quantity || 1);
    
    // Gating logico
    if (totalQuantity > product.stock_quantity) {
        alert(`Disponibilità insufficiente. Massimo acquistabile: ${product.stock_quantity} pezzi.`);
        return;
    }
    
    const finalQuantity = type === 'sample' ? 1 : totalQuantity;
    addToCart(product, type, finalQuantity);
    alert(type === 'sample' ? 'Campione aggiunto alla richiesta' : `Prodotto aggiunto al carrello: ${finalQuantity} pezzi`);
  };

  if (loading) return <div className="p-12">Caricamento...</div>;
  if (!product) return <div className="p-12">Prodotto non trovato</div>;

  const attributes = product.attributes || {};
  const displayTitle = `${product.title_it} ${attributes.ml ? `· ${attributes.ml}ml` : ''} ${attributes.colore ? `· ${attributes.colore}` : ''}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-vs-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-vs-16">
        <div className="md:col-span-6 sticky top-24 self-start">
          <div className="aspect-square bg-aluminum/5 border border-aluminum/20 flex items-center justify-center">
            {product.image_urls && product.image_urls.length > 0 ? (
              <img src={product.image_urls[0]} alt={product.title_it} className="w-full h-full object-contain p-8" />
            ) : (
              <span className="text-[10px] uppercase tracking-[0.2em] text-aluminum">Image coming soon</span>
            )}
          </div>
        </div>

        <div className="md:col-span-6 space-y-vs-8">
          <div>
            <h1 className="font-serif text-5xl mb-2">{displayTitle}</h1>
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-aluminum">{product.sku}</p>
          </div>

          <div className="text-2xl font-light">€{product.price}</div>
          <div className="text-sm text-aluminum">Disponibilità: {product.stock_quantity} pezzi</div>
 
          {/* Selettore Scatole */}
          <div className="flex items-center gap-4 py-4">
            <button onClick={() => setBoxes(b => Math.max(1, b - 1))} className="px-4 py-2 border border-aluminum/40 hover:bg-aluminum/10 transition-colors">-</button>
            <div className="text-sm font-medium w-48 text-center border-b border-onyx">
                {boxes} scatole ({boxes * (product.box_quantity || 1)} pezzi)
            </div>
            <button 
                onClick={() => {
                    const nextBoxes = boxes + 1;
                    const nextQty = nextBoxes * (product.box_quantity || 1);
                    if (nextQty > product.stock_quantity) {
                        alert(`Massima disponibilità raggiunta: ${product.stock_quantity} pezzi.`);
                    } else {
                        setBoxes(nextBoxes);
                    }
                }}
                className="px-4 py-2 border border-aluminum/40 hover:bg-aluminum/10 transition-colors"
            >+</button>
          </div>

          {/* Pulsante aggiungi resto stock */}
          {product.stock_quantity > 0 && boxes * (product.box_quantity || 1) < product.stock_quantity && (
             <button 
                onClick={() => {
                    const remainingBoxes = Math.floor(product.stock_quantity / (product.box_quantity || 1));
                    const totalQty = remainingBoxes * (product.box_quantity || 1);
                    
                    // Aggiungiamo direttamente al carrello con la quantità calcolata
                    addToCart(product, 'sale', totalQty);
                    
                    // Aggiorniamo la UI
                    setBoxes(remainingBoxes);
                    alert(`Aggiunti ${totalQty} pezzi al carrello.`);
                }}
                className="w-full mt-2 py-2 text-[10px] uppercase tracking-[0.2em] border border-aluminum/40 hover:bg-aluminum/10 transition-colors"
             >
                Aggiungi tutto lo stock disponibile ({product.stock_quantity} pz)
             </button>
          )}
          
          {product.box_quantity > 0 && (
            <div className="space-y-1 mt-4">
                <p className="text-[10px] text-aluminum">
                    Multipli d'imballo: <b>{product.box_quantity} pezzi per scatola</b>
                </p>
            </div>
          )}

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

          <div className="mt-8 border border-aluminum/20 p-4 space-y-3">
            <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-onyx">Informazioni Ordine</div>
            <p className="text-[10px] text-aluminum" dangerouslySetInnerHTML={{ __html: settings.shipping_notes || '• Consegna in modalità ex-works.' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
