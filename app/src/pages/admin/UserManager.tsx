import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function UserManager() {
  const [users, setUsers] = useState<any[]>([]);
  const roles = ['admin', 'ceo', 'magazzino', 'acquisti', 'customer'];

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase.from('profiles').select('id, email, role');
    setUsers(data || []);
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
    await supabase.from('profiles').delete().eq('id', id);
    // Nota: l'eliminazione da auth.users potrebbe richiedere privilegi admin (Edge Function)
    // Se non funziona direttamente, gestiremo tramite una RPC o Edge Function
    fetchUsers();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Gestione Ruoli Utenti</h1>
      </header>

      <div className="border border-aluminum/20">
        {users.map(user => (
            <div key={user.id} className="grid grid-cols-4 gap-4 items-center p-4 border-b border-aluminum/10">
                <span className="text-sm font-mono">{user.email}</span>
                <span className="text-xs uppercase text-aluminum">{user.role}</span>
                <select 
                    value={user.role} 
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="border border-aluminum/20 p-2 text-xs"
                >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button 
                    onClick={() => deleteUser(user.id)}
                    className="text-xs text-red-600 hover:text-red-800 uppercase"
                >
                    Elimina
                </button>
            </div>
        ))}
      </div>
    </div>
  );
}
