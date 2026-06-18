import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { t } = useLang();
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', cap: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const saleItems = cart.filter((item: any) => item.cartType === 'sale');
  const totalAmount = saleItems.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Inserisci Ordine
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total_amount: totalAmount,
            shipping_address: shipping,
            status: 'pending_payment'
        })
        .select()
        .single();

    if (orderError) {
        console.error(orderError);
        setLoading(false);
        return;
    }

    // 2. Inserisci Dettaglio
    const items = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity || 1,
        price_at_time: item.price || 0,
        item_type: item.cartType
    }));

    await supabase.from('order_items').insert(items);
    
    setLoading(false);
    navigate(`/payment/${order.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">{t('checkout_title')}</h1>
      </header>

      <form onSubmit={createOrder} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input placeholder={t('name_placeholder')} required value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})} className="p-2 border border-aluminum/20" />
            <input placeholder={t('phone_placeholder')} required value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} className="p-2 border border-aluminum/20" />
            <input placeholder={t('address_placeholder')} required value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} className="p-2 border border-aluminum/20 col-span-2" />
            <input placeholder={t('city_placeholder')} required value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} className="p-2 border border-aluminum/20" />
            <input placeholder={t('cap_placeholder')} required value={shipping.cap} onChange={e => setShipping({...shipping, cap: e.target.value})} className="p-2 border border-aluminum/20" />
        </div>
        <button disabled={loading} className="bg-onyx text-bone px-8 py-4 uppercase text-[10px] tracking-[0.2em] w-full">
            {loading ? '...' : t('proceed_payment')}
        </button>
      </form>
    </div>
  );
}
