import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function UserManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [priceLists, setPriceLists] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'customer', price_list_id: null });
  const roles = ['admin', 'ceo', 'magazzino', 'acquisti', 'customer'];

  useEffect(() => {
    fetchUsers();
    fetchPriceLists();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase.from('profiles').select('id, email, role, price_list_id');
    setUsers(data || []);
  }

  async function fetchPriceLists() {
    const { data } = await supabase.from('price_lists').select('id, name');
    setPriceLists(data || []);
  }

  async function updateProfile(id: string, field: string, value: any) {
    await supabase.from('profiles').update({ [field]: value }).eq('id', id);
    fetchUsers();
  }


  async function createUser() {
      const { data, error } = await supabase.auth.signUp({
          email: newUser.email,
          password: newUser.password,
      });

      if (error) {
          alert(error.message);
          return;
      }

      if (data.user) {
          await supabase.from('profiles').update({ role: newUser.role }).eq('id', data.user.id);
          setIsModalOpen(false);
          setNewUser({ email: '', password: '', role: 'customer' });
          fetchUsers();
      }
  }

  async function updateRole(id: string, newRole: string) {
    await supabase.from('profiles').update({ role: newRole }).eq('id', id);
    fetchUsers();
  }

  async function deleteUser(id: string) {
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return;
    
    // Check per ordini esistenti
    const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id);

    if (count && count > 0) {
        alert('Impossibile eliminare l\'utente: ha ordini associati.');
        return;
    }

    // Eliminazione profile e auth user
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
        console.error('Errore durante l\'eliminazione:', error);
        alert('Errore durante l\'eliminazione dell\'utente: ' + error.message);
        return;
    }
    // Nota: l'eliminazione da auth.users potrebbe richiedere privilegi admin (Edge Function)
    // Se non funziona direttamente, gestiremo tramite una RPC o Edge Function
    fetchUsers();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8 flex justify-between items-center">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Gestione Ruoli Utenti</h1>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-onyx text-bone px-6 py-2 uppercase text-[10px] tracking-[0.2em] hover:bg-aluminum transition-all"
        >
            Aggiungi Utente
        </button>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 bg-onyx/50 flex items-center justify-center p-6 z-50">
            <div className="bg-bone p-8 max-w-sm w-full space-y-4">
                <h2 className="font-serif text-xl uppercase tracking-[0.05em]">Nuovo Utente</h2>
                <input type="email" placeholder="Email" className="w-full p-2 border border-aluminum/40" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                <input type="password" placeholder="Password" className="w-full p-2 border border-aluminum/40" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                <select className="w-full p-2 border border-aluminum/40" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <div className="flex gap-4 pt-4">
                    <button onClick={createUser} className="flex-1 bg-onyx text-bone py-2 uppercase text-[10px]">Crea</button>
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 border border-onyx py-2 uppercase text-[10px]">Annulla</button>
                </div>
            </div>
        </div>
      )}

      <div className="border border-aluminum/20">
        {users.map(user => (
            <div key={user.id} className="grid grid-cols-4 gap-4 items-center p-4 border-b border-aluminum/10 text-xs">
                <span className="font-mono">{user.email}</span>
                <select 
                    value={user.role} 
                    onChange={(e) => updateProfile(user.id, 'role', e.target.value)}
                    className="border border-aluminum/20 p-1 uppercase"
                >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select 
                    value={user.price_list_id || ''} 
                    onChange={(e) => updateProfile(user.id, 'price_list_id', e.target.value || null)}
                    className="border border-aluminum/20 p-1"
                >
                    <option value="">Listino Base</option>
                    {priceLists.map(pl => <option key={pl.id} value={pl.id}>{pl.name}</option>)}
                </select>
                <button 
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-800 uppercase justify-self-end"
                >
                    Elimina
                </button>
            </div>
        ))}
      </div>
    </div>
  );
}
