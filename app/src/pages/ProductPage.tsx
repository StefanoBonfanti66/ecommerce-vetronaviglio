import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import notImage from '../assets/not-image.png';

export default function ProductPage() {
  const { sku } = useParams<{ sku: string }>();
  const [product, setProduct] = useState<any>(null);
  const [boxes, setBoxes] = useState(1);
  const [accessories, setAccessories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  const [priceListItem, setPriceListItem] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { lang, t } = useLang();
  const navigate = useNavigate();

  const resolvePrice = (product: any, quantity: number, customPrice: number | null) => {
    let price = customPrice !== null ? customPrice : product.price;
    if (customPrice === null && product.price_tiers && Array.isArray(product.price_tiers)) {
      const sortedTiers = [...product.price_tiers].sort((a, b) => b.min_qty - a.min_qty);
      const applicableTier = sortedTiers.find(tier => quantity >= tier.min_qty);
      if (applicableTier) price = applicableTier.price;
    }
    return price;
  };

  useEffect(() => {
    async function fetchAllData() {
      if (!sku) return;
      
      const [productRes, settingsRes] = await Promise.all([
        supabase.from('products').select('*').eq('sku', sku).single(),
        supabase.from('settings').select('key, value')
      ]);

      if (productRes.error || !productRes.data) {
        setLoading(false);
        return;
      }
      const p = productRes.data;
      setProduct(p);

      if (settingsRes.data) {
        const settingsMap = settingsRes.data.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
        setSettings(settingsMap);
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
          const { data: profile } = await supabase.from('profiles').select('price_list_id').eq('id', session.user.id).single();
          setUserProfile(profile);
          
          if (profile?.price_list_id) {
            const { data: priceItem } = await supabase
                .from('price_list_items')
                .select('price')
                .eq('price_list_id', profile.price_list_id)
                .eq('sku', p.sku)
                .single();
            if (priceItem) setPriceListItem(priceItem.price);
          }
      }

      const [accOverrideRes, accAutoRes] = await Promise.all([
        supabase
          .from('product_accessory_overrides')
          .select(`accessory:products!product_accessory_overrides_accessory_id_fkey(id, title_it, sku, stock_quantity, image_urls)`)
          .eq('product_id', p.id)
          .eq('action', 'FORCE_INCLUDE'),
        supabase.rpc('get_compatible_accessories', { principal_sku: p.sku })
      ]);

      const forced = accOverrideRes.data?.map((item: any) => item.accessory).filter(a => a.stock_quantity > 0) || [];
      const suggested = accAutoRes.data || [];
      const mergedAccessories = [...forced, ...suggested].filter((v, i, a) => a.findIndex(t => t.sku === v.sku) === i);
      setAccessories(mergedAccessories);
      setLoading(false);
    }
    fetchAllData();
  }, [sku]);

  const handleAddToCart = async (type: 'sale' | 'sample') => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/login'); return; }
    
    const totalQuantity = boxes * (product.box_quantity || 1);
    
    if (totalQuantity > product.stock_quantity) {
        alert(`Disponibilità insufficiente. Massimo: ${product.stock_quantity} pezzi.`);
        return;
    }
    
    const finalQuantity = type === 'sample' ? 1 : totalQuantity;
    const priceForCart = resolvePrice(product, finalQuantity, priceListItem);

    addToCart(product, type, finalQuantity, priceForCart);
    setProduct((prev: any) => ({ ...prev, stock_quantity: prev.stock_quantity - finalQuantity }));
    
    if (type === 'sample') {
        alert(t('sample_added'));
    } else {
        alert(t('product_added').replace('{quantity}', finalQuantity.toString()).replace('{price}', priceForCart.toFixed(2)));
    }
  };

  if (loading) return <div className="p-12">Caricamento...</div>;
  if (!product) return <div className="p-12">Prodotto non trovato</div>;

  const attributes = product.attributes || {};
  const displayTitle = `${product[`title_${lang}`] || product.title_it} ${attributes.ml ? `· ${attributes.ml}ml` : ''} ${attributes.colore ? `· ${attributes.colore}` : ''}`;
  const description = product[`description_${lang}`] || product.description_it;
  
  const currentPrice = resolvePrice(product, boxes * (product.box_quantity || 1), priceListItem);
  const totalPrice = currentPrice * boxes * (product.box_quantity || 1);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-vs-8 md:py-vs-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-vs-8 md:gap-vs-16">
        
        {/* Sinistra: Galleria (Sticky solo su desktop) */}
        <div className="md:col-span-6 md:sticky top-24 self-start hidden md:block">
          <div className="aspect-square bg-aluminum/5 border border-aluminum/20 flex items-center justify-center relative">
            {product.image_urls && product.image_urls.length > 0 ? (
              <img 
                src={product.image_urls[0]} 
                alt={product.title_it} 
                className="w-full h-full object-contain absolute inset-0 z-10"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center text-sm uppercase tracking-[0.2em] text-aluminum font-bold text-center">
                IMAGE<br/>COMING SOON
            </div>
          </div>
        </div>

        {/* Destra: Dettagli */}
        <div className="md:col-span-6 space-y-vs-8 flex flex-col items-center md:items-start text-center md:text-left">
          <div>
            <h1 className="font-serif text-5xl mb-2">{displayTitle}</h1>
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-aluminum">{product.sku}</p>
          </div>

          {/* Immagine su Mobile (visibile solo su mobile) */}
          <div className="md:hidden aspect-square bg-aluminum/5 border border-aluminum/20 flex items-center justify-center w-full max-w-sm relative">
            {product.image_urls && product.image_urls.length > 0 ? (
              <img 
                src={product.image_urls[0]} 
                alt={product.title_it} 
                className="w-full h-full object-contain absolute inset-0 z-10"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.2em] text-aluminum font-bold text-center">
                IMAGE<br/>COMING SOON
            </div>
          </div>

          <div className="text-2xl font-light">€{currentPrice.toFixed(2)} / {t('pieces')}</div>
          <div className="text-lg font-medium text-aluminum">{t('total')}: €{totalPrice.toFixed(2)}</div>
          <div className="text-sm text-aluminum">{t('availability')}: {product.stock_quantity} {t('pieces')}</div>
 
          {/* Selettore Scatole */}
          <div className="flex items-center gap-4 py-4">
            <button onClick={() => setBoxes(b => Math.max(1, b - 1))} className="px-4 py-2 border border-aluminum/40 hover:bg-aluminum/10 transition-colors">-</button>
            <div className="text-sm font-medium w-48 text-center border-b border-onyx">
                {boxes} {t('box_label')} ({boxes * (product.box_quantity || 1)} {t('pieces')})
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
                    if (totalQty <= 0) return;
                    addToCart(product, 'sale', totalQty, currentPrice);
                    setBoxes(remainingBoxes);
                    setProduct((prev: any) => ({ ...prev, stock_quantity: prev.stock_quantity - totalQty }));
                    alert(`Aggiunti ${totalQty} pezzi al carrello.`);
                }}
                className="w-full mt-2 py-2 text-[10px] uppercase tracking-[0.2em] border border-aluminum/40 hover:bg-aluminum/10 transition-colors"
             >
                {t('add_all_stock_available').replace('{count}', product.stock_quantity.toString())}
             </button>
          )}
          
          {product.box_quantity > 0 && (
            <div className="space-y-1 mt-4">
                <p className="text-[10px] text-aluminum" dangerouslySetInnerHTML={{ __html: t('box_multiples').replace('{count}', product.box_quantity.toString()) }}>
                </p>
            </div>
          )}

          <p 
            className="font-sans leading-relaxed text-onyx/80 break-words"
            dangerouslySetInnerHTML={{ __html: description || t('description_not_available') }}
          />

          {/* Griglia Tecnica */}
          <div className="grid grid-cols-2 gap-y-6 py-8 border-y border-aluminum/20 w-full max-w-sm">
            {[
              { label: t('capacity'), value: attributes.ml ? `${attributes.ml} ml` : 'N/A' },
              { label: t('material'), value: t(attributes.materiale) || attributes.materiale || 'N/A' },
              { label: t('mouth'), value: attributes.imboccatura || 'N/A' },
              { label: t('finish'), value: t(attributes.finitura) || attributes.finitura || 'N/A' },
              { label: t('pieces_per_box'), value: `${product.box_quantity || 0}` },
            ].map(attr => (

              <div key={attr.label}>
                <div className="text-[9px] uppercase tracking-[0.2em] text-aluminum mb-1">{attr.label}</div>
                <div className="text-sm font-medium">{attr.value}</div>
              </div>
            ))}
          </div>
          
          {/* Sezione Accessori e Bottoni */}
          <div className="w-full max-w-sm flex flex-col items-center">
              {accessories.length > 0 && (
                  <div className="py-4 w-full">
                      <div className="text-[9px] uppercase tracking-[0.2em] text-aluminum mb-4 text-center">{t('compatible_accessories')}</div>
                      <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide px-6">
                          {accessories.map(acc => (
                              <Link key={acc.sku} to={`/product/${encodeURIComponent(acc.sku)}`} className="border border-aluminum/20 p-3 hover:border-onyx transition-colors flex flex-col gap-2 min-w-[140px] snap-start">
                                  <div className="relative w-16 h-16 flex items-center justify-center bg-aluminum/10">
                                      <div className="absolute inset-0 flex items-center justify-center text-[8px] text-aluminum font-bold uppercase text-center">
                                          IMAGE<br/>COMING SOON
                                      </div>
                                      {acc.image_urls && acc.image_urls.length > 0 && (
                                          <img 
                                            src={acc.image_urls[0]} 
                                            alt={acc.title_it} 
                                            className="w-full h-full object-contain absolute inset-0 z-10"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                          />
                                      )}
                                  </div>
                                  <div>
                                      <div className="text-xs font-medium truncate">{acc.title_it}</div>
                                      <div className="text-[9px] text-aluminum font-mono">{acc.sku}</div>
                                  </div>
                              </Link>
                          ))}
                      </div>
                  </div>
              )}

              <div className="space-y-4 pt-4 border-t border-aluminum/10 w-full">
                <button 
                    onClick={() => handleAddToCart('sale')}
                    className="w-full bg-onyx text-bone py-4 uppercase text-xs tracking-[0.2em] hover:bg-aluminum transition-colors font-medium cursor-pointer"
                >
                    {t('add_to_cart')}
                </button>
                <button 
                    onClick={() => handleAddToCart('sample')}
                    className="w-full border border-onyx text-onyx py-4 uppercase text-xs tracking-[0.2em] hover:bg-aluminum/10 transition-colors cursor-pointer"
                >
                    {t('request_sample')}
                </button>
                <p className="text-[10px] text-aluminum text-center pt-2">
                    {t('free_goods_shipping_customer')}
                </p>
              </div>

              <div className="mt-8 border border-aluminum/20 p-4 space-y-3 w-full">
                <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-onyx">{t('order_info')}</div>
                <p className="text-[10px] text-aluminum" dangerouslySetInnerHTML={{ __html: (lang === 'en' ? settings.shipping_notes_en : settings.shipping_notes) || t('shipping_notes_default') }} />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
