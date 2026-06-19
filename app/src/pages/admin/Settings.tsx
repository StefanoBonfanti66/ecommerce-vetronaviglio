import AdminWrapper from "../../components/admin/AdminWrapper";
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function Settings() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('key, value');
    if (data) {
      const settingsMap = data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
      setSettings(settingsMap);
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    for (const [key, value] of Object.entries(settings)) {
        await supabase.from('settings').update({ value }).eq('key', key);
    }
    
    setLoading(false);
    alert('Impostazioni aggiornate!');
  }

  return (
    <AdminWrapper><div className="max-w-3xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Impostazioni Generali</h1>
      </header>

      <form onSubmit={saveSettings} className="p-6 border border-aluminum/20 bg-aluminum/5 space-y-8">
        <div className="space-y-4">
            <h3 className="font-serif text-lg border-b border-aluminum/20 pb-2">Notifiche</h3>
            <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] mb-2">Email notifiche ordini</label>
                <input 
                    type="email"
                    value={settings.order_notification_email || ''}
                    onChange={e => setSettings({...settings, order_notification_email: e.target.value})}
                    className="w-full p-2 border border-aluminum/40 bg-transparent"
                />
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="font-serif text-lg border-b border-aluminum/20 pb-2">Parametri Amministrativi</h3>
            <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] mb-2">Importo minimo fatturabile (€)</label>
                <input 
                    type="number"
                    value={settings.min_order_amount || ''}
                    onChange={e => setSettings({...settings, min_order_amount: e.target.value})}
                    className="w-full p-2 border border-aluminum/40 bg-transparent"
                />
            </div>

            <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] mb-2">Massimo pezzi per ordine</label>
                <input 
                    type="number"
                    value={settings.max_items_per_order || ''}
                    onChange={e => setSettings({...settings, max_items_per_order: e.target.value})}
                    className="w-full p-2 border border-aluminum/40 bg-transparent"
                />
            </div>

            <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] mb-2">Note spedizione (Ex-works)</label>
                <textarea 
                    value={settings.shipping_notes || ''}
                    onChange={e => setSettings({...settings, shipping_notes: e.target.value})}
                    className="w-full p-2 border border-aluminum/40 bg-transparent h-24"
                />
            </div>
        </div>

        <button className="bg-onyx text-bone px-8 py-2 uppercase text-[10px] tracking-[0.2em] hover:bg-aluminum transition-all">
            {loading ? 'Salvataggio...' : 'Salva Impostazioni'}
        </button>
      </form>
    </div></AdminWrapper>
  );
}
