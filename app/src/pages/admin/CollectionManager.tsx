import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function CollectionManager() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCol, setNewCol] = useState({ name_it: '', slug: '', image_url: '' });

  useEffect(() => {
    fetchCollections();
  }, []);

  async function fetchCollections() {
    setLoading(true);
    const { data } = await supabase.from('collections').select('*').order('name_it');
    setCollections(data || []);
    setLoading(false);
  }

  async function createCollection(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from('collections').insert(newCol);
    setNewCol({ name_it: '', slug: '', image_url: '' });
    fetchCollections();
  }

  async function updateCollection(id: string, updates: any) {
    await supabase.from('collections').update(updates).eq('id', id);
    fetchCollections();
  }

  async function deleteCollection(id: string) {
    if (confirm('Sei sicuro di voler eliminare questa collezione? Se contiene prodotti, l\'operazione fallirà.')) {
        try {
            const { error } = await supabase.from('collections').delete().eq('id', id);
            if (error) {
                alert('Errore: non è possibile eliminare una collezione che contiene prodotti. Disabilitala invece.');
            } else {
                fetchCollections();
            }
        } catch (err) {
            alert('Errore durante l\'eliminazione.');
        }
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Gestione Collezioni</h1>
      </header>

      <form onSubmit={createCollection} className="mb-12 p-6 border border-aluminum/20 bg-aluminum/5">
        <h2 className="font-serif text-lg mb-6 uppercase tracking-[0.05em]">Aggiungi Nuova Collezione</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input placeholder="Nome (IT)" value={newCol.name_it} onChange={e => setNewCol({...newCol, name_it: e.target.value})} className="p-2 border border-aluminum/20" required />
            <input placeholder="Slug (es: ambra)" value={newCol.slug} onChange={e => setNewCol({...newCol, slug: e.target.value})} className="p-2 border border-aluminum/20" required />
            <input placeholder="Immagine URL" value={newCol.image_url} onChange={e => setNewCol({...newCol, image_url: e.target.value})} className="p-2 border border-aluminum/20 col-span-2" />
        </div>
        <button className="mt-6 bg-onyx text-bone px-8 py-2 uppercase text-[10px] tracking-[0.2em] hover:bg-aluminum transition-all">
            Crea Collezione
        </button>
      </form>

      {loading ? (
        <div className="p-12">Caricamento...</div>
      ) : (
        <div className="space-y-4">
          {collections.map(col => (
            <div key={col.id} className="grid grid-cols-6 gap-4 items-center border border-aluminum/20 p-4">
              <input value={col.name_it} onChange={e => setCollections(prev => prev.map(c => c.id === col.id ? {...c, name_it: e.target.value} : c))} className="p-2 border border-aluminum/20 col-span-1" />
              <input value={col.slug} onChange={e => setCollections(prev => prev.map(c => c.id === col.id ? {...c, slug: e.target.value} : c))} className="p-2 border border-aluminum/20 col-span-1" />
              <input value={col.image_url || ''} onChange={e => setCollections(prev => prev.map(c => c.id === col.id ? {...c, image_url: e.target.value} : c))} className="p-2 border border-aluminum/20 col-span-1" />
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={col.is_active} onChange={e => setCollections(prev => prev.map(c => c.id === col.id ? {...c, is_active: e.target.checked} : c))} />
                <span className="text-[10px] uppercase">Attiva</span>
              </div>
              <button 
                onClick={() => updateCollection(col.id, { name_it: col.name_it, slug: col.slug, image_url: col.image_url, is_active: col.is_active })}
                className="bg-onyx text-bone px-4 py-2 uppercase text-[10px] tracking-[0.2em]"
              >
                Salva
              </button>
              <button 
                onClick={() => deleteCollection(col.id)}
                className="text-red-500 hover:text-red-700 text-[10px] uppercase tracking-[0.2em]"
              >
                Elimina
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
