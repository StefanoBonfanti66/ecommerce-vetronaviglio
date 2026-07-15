import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "jsr:@supabase/supabase-js"
import { Resend } from "npm:resend"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

// Template definition
const TEMPLATE = `Vetronaviglio S.r.l.
Via Don Severino Fracassi, 31/39
20008 Bareggio (MI), Italy

---

# CONFERMA D'ORDINE — {{ORDER_ID}}

**Data ordine:** {{ORDER_DATE}}  
**Cliente:** {{CUSTOMER_NAME}}  
**Indirizzo di spedizione:** {{SHIPPING_ADDRESS}}

---

## Dettaglio Ordine

| SKU | Prodotto | Qty | Prezzo Unitario | Totale |
|---|---|---|---|---|
{{ORDER_ITEMS_ROWS}}
| | **Totale Ordine** | | | **{{TOTAL_AMOUNT}} €** |

---
*Grazie per aver scelto Vetronaviglio. Il nostro commerciale verificherà l'ordine e vi invierà a breve conferma definitiva.*`;

serve(async (req) => {
  const payload = await req.json()
  const record = payload.record
  
  if (record.status !== 'pending_payment') return new Response("Not pending_payment", { status: 200 })

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: order, error: orderError } = await supabaseClient
    .from('orders')
    .select('*, order_items(*, products(title_it, sku))')
    .eq('id', record.id)
    .single()

  if (orderError) {
      return new Response("Error fetching order", { status: 500 });
  }

  const buyerName = order?.shipping_address?.name || 'N/A';
  const buyerAddress = `${order?.shipping_address?.address || ''}, ${order?.shipping_address?.city || ''} (${order?.shipping_address?.cap || ''})`;

  const itemsRows = order?.order_items?.map((i: any) => {
      const sku = i.products?.sku || 'N/A';
      const title = i.products?.title_it || 'Prodotto';
      const qty = i.quantity || 1;
      const price = i.price_at_time || 0;
      return `| ${sku} | ${title} | ${qty} | ${price.toFixed(2)} € | ${(price * qty).toFixed(2)} € |`;
  }).join('\n') || '';

  const attachmentContent = TEMPLATE
    .replace('{{ORDER_ID}}', order.id.slice(0, 8))
    .replace('{{ORDER_DATE}}', new Date(order.created_at).toLocaleDateString())
    .replace('{{CUSTOMER_NAME}}', buyerName)
    .replace('{{SHIPPING_ADDRESS}}', buyerAddress)
    .replace('{{ORDER_ITEMS_ROWS}}', itemsRows)
    .replace('{{TOTAL_AMOUNT}}', order.total_amount.toFixed(2));

  try {
    const res = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'sbonfanti@hotmail.com',
      subject: `Conferma Ordine #${order.id.slice(0, 8)}`,
      html: `<h1>Nuovo ordine ricevuto!</h1><p>In allegato la conferma d'ordine in formato Markdown.</p>`,
      attachments: [{
          filename: 'conferma-ordine.md',
          content: attachmentContent
      }]
    })
    
    console.log("Resend response:", JSON.stringify(res));
    return new Response(JSON.stringify(res), { status: 200 })
  } catch (error) {
    console.error("Resend error:", error);
    return new Response(JSON.stringify(error), { status: 500 })
  }
})
