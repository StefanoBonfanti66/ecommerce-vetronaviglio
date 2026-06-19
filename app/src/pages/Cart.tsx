import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import { resolvePrice } from '../utils/pricing';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { lang, t } = useLang();
  const [minOrder, setMinOrder] = useState(250);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
        const { data: settings } = await supabase.from('settings').select('value').eq('key', 'min_order_amount').single();
        if (settings) setMinOrder(parseFloat(settings.value));

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { data: profile } = await supabase.from('profiles').select('price_list_id').eq('id', session.user.id).single();
            setUserProfile(profile);
        }
    }
    fetchData();
  }, []);

  const handleQuantityChange = async (index: number, newQuantity: number) => {
    const item = cart[index];
    
    // Controllo disponibilità
    if (newQuantity > item.stock_quantity) {
        alert(`Disponibilità insufficiente. Massimo: ${item.stock_quantity} pezzi.`);
        newQuantity = item.stock_quantity;
    }

    let customPrice = null;

    if (userProfile?.price_list_id) {
        const { data: priceItem } = await supabase
            .from('price_list_items')
            .select('price')
            .eq('price_list_id', userProfile.price_list_id)
            .eq('sku', item.sku)
            .single();
        if (priceItem) customPrice = priceItem.price;
    }

    const newPrice = resolvePrice(item, newQuantity, customPrice);
    updateQuantity(index, newQuantity, newPrice);
  };

  const saleItems = cart.filter((item: any) => item.cartType === 'sale');
  const sampleItems = cart.filter((item: any) => item.cartType === 'sample');

  const totalProducts = saleItems.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const isBelowMin = saleItems.length > 0 && totalProducts < minOrder;

  if (cart.length === 0) {
    return <div className="p-12 text-center text-aluminum">{t('empty_cart')}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-vs-16">
      <h1 className="font-serif text-3xl mb-12 uppercase tracking-[0.05em]">{t('cart_title')}</h1>

      {saleItems.length > 0 && (
        <section className="mb-16">
          <h2 className="font-serif text-lg mb-6 uppercase tracking-[0.05em]">{t('purchase_items')}</h2>
          <div className="divide-y divide-aluminum/20 border-t border-aluminum/20">
            {saleItems.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-6 py-6">
                <Link to={`/product/${encodeURIComponent(item.sku)}`} className="w-20 h-20 bg-aluminum/5 border border-aluminum/10 flex-shrink-0">
                  {item.image_urls?.[0] && <img src={item.image_urls[0]} alt={lang === 'en' ? item.title_en : item.title_it} className="w-full h-full object-contain p-2" />}
                </Link>
                <div className="flex-grow">
                  <Link to={`/product/${encodeURIComponent(item.sku)}`} className="font-serif text-lg hover:underline">{lang === 'en' ? item.title_en : item.title_it}</Link>
                  <p className="text-[10px] font-mono text-aluminum tracking-[0.1em]">{item.sku}</p>
                </div>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                        className="w-16 p-1 border border-aluminum/20 text-center"
                    />
                </div>
                <div className="text-sm text-right">
                    <p>€{item.price?.toFixed(2)} / {t('pieces')}</p>
                    <p className="font-bold">€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(index)} className="text-[10px] text-red-500 hover:text-red-700 uppercase">{t('remove')}</button>
              </div>
            ))}
          </div>
        </section>
      )}


      {sampleItems.length > 0 && (
        <section className="mb-16">
          <h2 className="font-serif text-lg mb-6 uppercase tracking-[0.05em]">{t('sample_requests')}</h2>
          <div className="divide-y divide-aluminum/20 border-t border-aluminum/20">
            {sampleItems.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-6 py-6">
                <Link to={`/product/${encodeURIComponent(item.sku)}`} className="w-20 h-20 bg-aluminum/5 border border-aluminum/10 flex-shrink-0">
                  {item.image_urls?.[0] && <img src={item.image_urls[0]} alt={lang === 'en' ? item.title_en : item.title_it} className="w-full h-full object-contain p-2" />}
                </Link>
                <div className="flex-grow">
                  <Link to={`/product/${encodeURIComponent(item.sku)}`} className="font-serif text-lg hover:underline">{lang === 'en' ? item.title_en : item.title_it}</Link>
                  <p className="text-[10px] font-mono text-aluminum tracking-[0.1em]">{item.sku}</p>
                </div>
                <div className="text-sm">0,00 €</div>
                <button onClick={() => removeFromCart(index)} className="text-[10px] text-red-500 hover:text-red-700 uppercase">{t('remove')}</button>
              </div>
            ))}
          </div>
          <p className="text-xs text-aluminum pt-4 italic" dangerouslySetInnerHTML={{ __html: t('samples_shipping_separate') }}>
          </p>
        </section>
      )}

      <div className="border-t border-onyx pt-8 mt-12 flex justify-end">
        <div className="w-full md:w-1/3 space-y-4">
          <div className="flex justify-between text-sm">
            <span>{t('total_products')}:</span>
            <span>€{totalProducts.toFixed(2)}</span>
          </div>
          
          {sampleItems.length > 0 && (
              <div className="text-[10px] text-aluminum italic text-right" dangerouslySetInnerHTML={{ __html: t('total_merchandise_excl_shipping') }}>
              </div>
          )}

          <div className="flex justify-between font-serif text-xl border-t border-aluminum/20 pt-4">
            <span>{t('total')}:</span>
            <span>€{totalProducts.toFixed(2)}</span>
          </div>

          {isBelowMin && (
            <div className="p-4 bg-amber-50 text-amber-800 text-[10px] uppercase tracking-[0.1em] border border-amber-200">
                ⚠️ {t('min_order_warning').replace('{min}', minOrder.toString())}
            </div>
          )}

          <div className="pt-6">
            <Link to={isBelowMin ? "#" : "/checkout"} className={`block w-full py-4 text-center uppercase text-[10px] tracking-[0.2em] transition-all ${isBelowMin ? 'bg-aluminum text-bone cursor-not-allowed opacity-50' : 'bg-onyx text-bone hover:bg-aluminum'}`}>
                {t('proceed_to_checkout')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

