import AdminWrapper from "../../components/admin/AdminWrapper";
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function SampleRequestsManager() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    const { data } = await supabase
        .from('sample_requests')
        .select('*, products(title_it, sku)')
        .order('created_at', { ascending: false });
    setRequests(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    await supabase.from('sample_requests').update({ status: newStatus }).eq('id', id);
    fetchRequests();
  }

  return (
    <AdminWrapper><div className="max-w-7xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Gestione Campionature</h1>
      </header>

      {loading ? (
        <div className="p-12">Caricamento...</div>
      ) : (
        <div className="border border-aluminum/20">
          {requests.map(req => (
            <div key={req.id} className="grid grid-cols-4 gap-4 items-center p-4 border-b border-aluminum/10">
              <span className="text-sm font-mono">{req.products?.sku} - {req.products?.title_it}</span>
              <span className="text-xs text-aluminum">{new Date(req.created_at).toLocaleDateString()}</span>
              <span className="text-xs uppercase tracking-[0.1em]">{req.status}</span>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(req.id, 'approved')} className="text-xs text-green-600 hover:text-green-800 uppercase">Appr.</button>
                <button onClick={() => updateStatus(req.id, 'rejected')} className="text-xs text-red-600 hover:text-red-800 uppercase">Rifiuta</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div></AdminWrapper>
  );
}
