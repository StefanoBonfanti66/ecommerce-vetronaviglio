import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { t } = useLang();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      setOrder(data);
      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-12">{t('loading_order')}</div>;
  if (!order) return <div className="p-12">{t('order_not_found')}</div>;

  return (
    <div className="max-w-xl mx-auto px-6 py-vs-16">
      <h1 className="font-serif text-3xl mb-8 uppercase tracking-[0.05em]">{t('payment_title')}</h1>
      <div className="mb-8 p-4 border border-aluminum/20">
        <p className="text-sm">{t('total_to_pay')}: <strong>€{order.total_amount}</strong></p>
      </div>

      <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "EUR" }}>
        <PayPalButtons
          style={{ layout: 'vertical' }}
          createOrder={(_data, actions) => {
            return actions.order.create({
              purchase_units: [{ amount: { value: order.total_amount.toString() } }],
            });
          }}
          onApprove={async (_data, actions) => {
            console.log("PayPal: Payment approved, starting capture...");
            const details = await actions.order.capture();
            console.log("PayPal: Capture completato. Dettagli:", details);
            
            const { error } = await supabase
              .from('orders')
              .update({ status: 'paid' })
              .eq('id', orderId);

            if (error) {
              console.error("Errore aggiornamento DB:", error);
              alert(t('payment_db_error') + error.message);
            } else {
              console.log("DB: Stato ordine aggiornato a paid.");
              clearCart();
              alert(t('payment_completed').replace('{name}', details.payer.name.given_name));
              navigate('/catalog');
            }
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
