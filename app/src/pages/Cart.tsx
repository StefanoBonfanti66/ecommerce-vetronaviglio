import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const [minOrder, setMinOrder] = useState(250);

  useEffect(() => {
    async function fetchMinOrder() {
        const { data } = await supabase.from('settings').select('value').eq('key', 'min_order_amount').single();
        if (data) setMinOrder(parseFloat(data.value));
    }
    fetchMinOrder();
  }, []);

  const saleItems = cart.filter((item: any) => item.cartType === 'sale');
  const sampleItems = cart.filter((item: any) => item.cartType === 'sample');

  const totalProducts = saleItems.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const isBelowMin = saleItems.length > 0 && totalProducts < minOrder;

  if (cart.length === 0) {
    return <div className="p-12 text-center text-aluminum">Il carrello è vuoto.</div>;
  }

  const createOrder = (_data: any, actions: any) => {
    // Qui andrebbe chiamata la tua Edge Function Supabase
    return actions.order.create({
      purchase_units: [{ amount: { value: totalProducts.toFixed(2) } }],
    });
  };

  const onApprove = (_data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      alert(`Pagamento completato da ${details.payer.name.given_name}`);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-vs-16">
      <h1 className="font-serif text-3xl mb-12 uppercase tracking-[0.05em]">Il tuo Carrello</h1>

      {saleItems.length > 0 && (
        <section className="mb-16">
          <h2 className="font-serif text-lg mb-6 uppercase tracking-[0.05em]">Articoli da acquistare</h2>
          <div className="divide-y divide-aluminum/20 border-t border-aluminum/20">
            {saleItems.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-6 py-6">
                <Link to={`/product/${item.sku}`} className="w-20 h-20 bg-aluminum/5 border border-aluminum/10 flex-shrink-0">
                  {item.image_urls?.[0] && <img src={item.image_urls[0]} alt={item.title_it} className="w-full h-full object-contain p-2" />}
                </Link>
                <div className="flex-grow">
                  <Link to={`/product/${item.sku}`} className="font-serif text-lg hover:underline">{item.title_it}</Link>
                  <p className="text-[10px] font-mono text-aluminum tracking-[0.1em]">{item.sku}</p>
                </div>
                <div className="text-sm">
                    {item.quantity} x €{item.price?.toFixed(2)} = €{(item.price * item.quantity).toFixed(2)}
                </div>
                <button onClick={() => removeFromCart(index)} className="text-[10px] text-red-500 hover:text-red-700 uppercase">Rimuovi</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {sampleItems.length > 0 && (
        <section className="mb-16">
          <h2 className="font-serif text-lg mb-6 uppercase tracking-[0.05em]">Richieste di campionatura</h2>
          <div className="divide-y divide-aluminum/20 border-t border-aluminum/20">
            {sampleItems.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-6 py-6">
                <Link to={`/product/${item.sku}`} className="w-20 h-20 bg-aluminum/5 border border-aluminum/10 flex-shrink-0">
                  {item.image_urls?.[0] && <img src={item.image_urls[0]} alt={item.title_it} className="w-full h-full object-contain p-2" />}
                </Link>
                <div className="flex-grow">
                  <Link to={`/product/${item.sku}`} className="font-serif text-lg hover:underline">{item.title_it}</Link>
                  <p className="text-[10px] font-mono text-aluminum tracking-[0.1em]">{item.sku}</p>
                </div>
                <div className="text-sm">0,00 €</div>
                <button onClick={() => removeFromCart(index)} className="text-[10px] text-red-500 hover:text-red-700 uppercase">Rimuovi</button>
              </div>
            ))}
          </div>
          <p className="text-xs text-aluminum pt-4 italic">
            * La merce dei campioni è gratuita. <strong>Le spese di spedizione saranno calcolate e comunicate separatamente</strong>.
          </p>
        </section>
      )}

      <div className="border-t border-onyx pt-8 mt-12 flex justify-end">
        <div className="w-full md:w-1/3 space-y-4">
          <div className="flex justify-between text-sm">
            <span>Totale prodotti:</span>
            <span>€{totalProducts.toFixed(2)}</span>
          </div>
          
          {sampleItems.length > 0 && (
              <div className="text-[10px] text-aluminum italic text-right">
                  * Totale merce escluso spese di spedizione (a carico del cliente).
              </div>
          )}

          <div className="flex justify-between font-serif text-xl border-t border-aluminum/20 pt-4">
            <span>Totale merce:</span>
            <span>€{totalProducts.toFixed(2)}</span>
          </div>

          {isBelowMin && (
            <div className="p-4 bg-amber-50 text-amber-800 text-[10px] uppercase tracking-[0.1em] border border-amber-200">
                ⚠️ Importo minimo fatturabile non raggiunto (Min. €{minOrder}). Aggiungi altri articoli al carrello.
            </div>
          )}

          <div className="pt-6">
            <Link to={isBelowMin ? "#" : "/checkout"} className={`block w-full py-4 text-center uppercase text-[10px] tracking-[0.2em] transition-all ${isBelowMin ? 'bg-aluminum text-bone cursor-not-allowed opacity-50' : 'bg-onyx text-bone hover:bg-aluminum'}`}>
                Procedi al Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
