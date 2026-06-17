import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function Settings() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('value').eq('key', 'order_notification_email').single();
    if (data) setEmail(data.value);
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.from('settings').update({ value: email }).eq('key', 'order_notification_email');
    setLoading(false);
    alert('Email di notifica aggiornata!');
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Impostazioni</h1>
      </header>

      <form onSubmit={saveSettings} className="p-6 border border-aluminum/20 bg-aluminum/5">
        <h2 className="font-serif text-lg mb-6 uppercase tracking-[0.05em]">Email notifiche ordini</h2>
        <input 
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border border-aluminum/40 bg-transparent mb-6"
        />
        <button className="bg-onyx text-bone px-8 py-2 uppercase text-[10px] tracking-[0.2em] hover:bg-aluminum transition-all">
            {loading ? 'Salvataggio...' : 'Salva Impostazioni'}
        </button>
      </form>
    </div>
  );
}
