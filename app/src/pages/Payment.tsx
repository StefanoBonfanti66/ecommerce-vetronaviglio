import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { clearCart } = useCart();
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

  if (loading) return <div className="p-12">Caricamento ordine...</div>;
  if (!order) return <div className="p-12">Ordine non trovato</div>;

  return (
    <div className="max-w-xl mx-auto px-6 py-vs-16">
      <h1 className="font-serif text-3xl mb-8 uppercase tracking-[0.05em]">Pagamento</h1>
      <div className="mb-8 p-4 border border-aluminum/20">
        <p className="text-sm">Totale da pagare: <strong>€{order.total_amount}</strong></p>
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
            console.log("PayPal: Pagamento approvato, inizio capture...");
            const details = await actions.order.capture();
            console.log("PayPal: Capture completato. Dettagli:", details);
            
            const { error } = await supabase
              .from('orders')
              .update({ status: 'paid' })
              .eq('id', orderId);

            if (error) {
              console.error("Errore aggiornamento DB:", error);
              alert("Pagamento riuscito ma errore aggiornamento ordine: " + error.message);
            } else {
              console.log("DB: Stato ordine aggiornato a paid.");
              clearCart(); // <-- Clear cart here
              alert(`Pagamento completato da ${details.payer.name.given_name}`);
              navigate('/catalog');
            }
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
