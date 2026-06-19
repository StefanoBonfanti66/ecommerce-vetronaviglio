import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';

export default function ProductPage() {
  const { sku } = useParams<{ sku: string }>();
  const [product, setProduct] = useState<any>(null);
  const [boxes, setBoxes] = useState(1);
  const [accessories, setAccessories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  const [priceListItem, setPriceListItem] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
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
        alert(`${t('availability')}: ${product.stock_quantity} ${t('pieces')}.`);
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

  if (loading) return <div className="p-12">{t('loading_product')}</div>;
  if (!product) return <div className="p-12">{t('product_not_found')}</div>;

  const attributes = product.attributes || {};
  const displayTitle = product[`title_${lang}`] || product.title_it;
  const description = product[`description_${lang}`] || product.description_it;
  
  const currentPrice = resolvePrice(product, boxes * (product.box_quantity || 1), priceListItem);
  const totalPrice = currentPrice * boxes * (product.box_quantity || 1);

  const PLACEHOLDER_BOTTLE = (
    <svg viewBox="0 0 200 300" className="w-24 h-36 md:w-32 md:h-48" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="65" y="20" width="70" height="40" rx="4" />
      <rect x="55" y="55" width="90" height="210" rx="8" />
      <rect x="65" y="55" width="20" height="110" rx="2" />
      <rect x="115" y="55" width="20" height="110" rx="2" />
      <line x1="75" y1="185" x2="125" y2="185" />
      <line x1="75" y1="200" x2="125" y2="200" />
      <line x1="75" y1="215" x2="115" y2="215" />
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
      <button
        onClick={() => navigate(-1)}
        className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum hover:text-onyx transition-colors mb-8 cursor-pointer py-2 min-h-[44px]"
      >
        ← {lang === 'it' ? 'Indietro' : 'Back'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        
        {/* Left: Image */}
        <div className="md:col-span-6 md:sticky top-28 self-start">
          <div className="aspect-square bg-surface flex items-center justify-center relative overflow-hidden">
            {product.image_urls && product.image_urls.length > 0 && !imageError ? (
              <img 
                src={product.image_urls[0]} 
                alt={displayTitle} 
                className="w-full h-full object-contain absolute inset-0 z-10"
                onError={() => setImageError(true)}
              />
            ) : null}
            <div className="text-aluminum/30">
              {PLACEHOLDER_BOTTLE}
            </div>
          </div>
        </div>

        {/* Right: Product info */}
        <div className="md:col-span-6">

          {/* SKU */}
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-3">{product.sku}</p>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-3">
            {displayTitle}
          </h1>

          {/* Attributes subtitle */}
          {(attributes.ml || attributes.colore) && (
            <p className="font-sans text-sm text-aluminum mb-6">
              {[attributes.ml && `${attributes.ml}ml`, attributes.colore].filter(Boolean).join(' · ')}
            </p>
          )}

          {/* Price */}
          <div className="mb-4">
            <span className="font-sans text-2xl md:text-3xl font-semibold">€{currentPrice.toFixed(2)}</span>
            <span className="font-sans text-xs md:text-sm text-aluminum ml-2">/ {t('pieces')}</span>
            {boxes * (product.box_quantity || 1) > 1 && (
              <span className="font-sans text-xs md:text-sm text-aluminum ml-4">
                {t('total')}: €{totalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Availability */}
          <p className="font-sans text-sm text-onyx mb-8">
            {product.stock_quantity > 0
              ? `${t('availability')}: ${product.stock_quantity} ${t('pieces')}`
              : (lang === 'it' ? 'Non disponibile' : 'Out of stock')}
          </p>

          {/* Box quantity selector */}
          {product.box_quantity > 0 && (
            <div className="mb-8">
              <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-aluminum mb-2">{t('box_label')}</p>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setBoxes(b => Math.max(1, b - 1))}
                  className="w-10 h-10 border border-aluminum/20 flex items-center justify-center hover:border-onyx transition-colors"
                >
                  <span className="text-lg leading-none">−</span>
                </button>
                <span className="font-sans text-sm w-28 text-center">
                  {boxes} ({boxes * (product.box_quantity || 1)} {t('pieces')})
                </span>
                <button 
                  onClick={() => {
                    const nextBoxes = boxes + 1;
                    const nextQty = nextBoxes * (product.box_quantity || 1);
                    if (nextQty > product.stock_quantity) {
                      alert(`${t('availability')}: ${product.stock_quantity} ${t('pieces')}.`);
                    } else {
                      setBoxes(nextBoxes);
                    }
                  }}
                  className="w-10 h-10 border border-aluminum/20 flex items-center justify-center hover:border-onyx transition-colors"
                >
                  <span className="text-lg leading-none">+</span>
                </button>
              </div>
              <p className="font-sans text-[10px] text-aluminum mt-2" dangerouslySetInnerHTML={{ __html: t('box_multiples').replace('{count}', product.box_quantity.toString()) }} />
            </div>
          )}

          {/* CTAs */}
          <div className="space-y-3 mb-8">
            <button 
              onClick={() => handleAddToCart('sale')}
              disabled={product.stock_quantity <= 0}
              className="w-full bg-onyx text-bone py-4 text-xs uppercase tracking-[0.2em] hover:bg-aluminum transition-colors font-medium cursor-pointer disabled:bg-aluminum/30 disabled:cursor-not-allowed"
            >
              {product.stock_quantity > 0 ? t('add_to_cart') : (lang === 'it' ? 'Non disponibile' : 'Out of stock')}
            </button>
            <button 
              onClick={() => handleAddToCart('sample')}
              className="w-full border border-onyx/20 text-onyx py-4 text-xs uppercase tracking-[0.2em] hover:border-onyx transition-colors cursor-pointer"
            >
              {t('request_sample')}
            </button>
            <p className="text-[10px] text-aluminum text-center">
              {t('free_goods_shipping_customer')}
            </p>
          </div>

          {/* Add all remaining stock */}
          {product.stock_quantity > 0 && boxes * (product.box_quantity || 1) < product.stock_quantity && (
            <button 
              onClick={() => {
                const remainingBoxes = Math.floor(product.stock_quantity / (product.box_quantity || 1));
                const totalQty = remainingBoxes * (product.box_quantity || 1);
                if (totalQty <= 0) return;
                addToCart(product, 'sale', totalQty, currentPrice);
                setBoxes(remainingBoxes);
                setProduct((prev: any) => ({ ...prev, stock_quantity: prev.stock_quantity - totalQty }));
                alert(t('product_added_cart').replace('{quantity}', totalQty.toString()));
              }}
              className="w-full mb-8 py-3 text-[10px] uppercase tracking-[0.2em] border border-aluminum/20 hover:bg-surface transition-colors"
            >
              {t('add_all_stock_available').replace('{count}', product.stock_quantity.toString())}
            </button>
          )}

          {/* Divider - below the fold */}
          <div className="border-t border-aluminum/10 my-8" />

          {/* Description */}
          {description && (
            <div className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4">
                {lang === 'it' ? 'Descrizione' : 'Description'}
              </h2>
              <p 
                className="font-sans text-sm leading-relaxed text-onyx/80 break-words"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          )}

          {/* Technical specs */}
          <div className="mb-10">
            <h2 className="font-display text-2xl font-semibold mb-5">
              {lang === 'it' ? 'Specifiche tecniche' : 'Technical specifications'}
            </h2>
            <div className="grid grid-cols-2 gap-y-6">
              {[
                { label: t('capacity'), value: attributes.ml ? `${attributes.ml} ml` : 'N/A' },
                { label: t('material'), value: t(attributes.materiale) || attributes.materiale || 'N/A' },
                { label: t('mouth'), value: attributes.imboccatura || 'N/A' },
                { label: t('finish'), value: t(attributes.finitura) || attributes.finitura || 'N/A' },
                { label: t('pieces_per_box'), value: `${product.box_quantity || 0}` },
              ].map(attr => (
                <div key={attr.label}>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-aluminum mb-1">{attr.label}</p>
                  <p className="font-sans text-sm font-medium text-onyx">{attr.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Compatible accessories */}
          {accessories.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-5">{t('compatible_accessories')}</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
                {accessories.map(acc => (
                  <Link 
                    key={acc.sku} 
                    to={`/product/${encodeURIComponent(acc.sku)}`} 
                    className="border border-aluminum/10 p-4 hover:border-onyx transition-colors flex flex-col gap-3 min-w-[150px] snap-start flex-shrink-0"
                  >
                    <div className="w-full aspect-square bg-surface flex items-center justify-center relative">
                      <div className="text-aluminum/20 w-10 h-14">
                        <svg viewBox="0 0 200 300" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.2">
                          <rect x="65" y="20" width="70" height="40" rx="4" />
                          <rect x="55" y="55" width="90" height="210" rx="8" />
                        </svg>
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
                      <p className="font-sans text-xs font-medium truncate text-onyx">{acc.title_it}</p>
                      <p className="font-sans text-[9px] text-aluminum mt-0.5">{acc.sku}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Shipping info */}
          <div className="border border-aluminum/10 p-4 md:p-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium text-onyx mb-2">{t('order_info')}</h3>
            <p className="font-sans text-[10px] text-aluminum leading-relaxed" dangerouslySetInnerHTML={{ __html: (lang === 'en' ? settings.shipping_notes_en : settings.shipping_notes) || t('shipping_notes_default') }} />
          </div>

        </div>
      </div>
    </div>
  );
}