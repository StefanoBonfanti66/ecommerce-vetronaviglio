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

  return (
    <div className="max-w-4xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Gestione Ruoli Utenti</h1>
      </header>

      <div className="border border-aluminum/20">
        {users.map(user => (
            <div key={user.id} className="grid grid-cols-3 gap-4 items-center p-4 border-b border-aluminum/10">
                <span className="text-sm font-mono">{user.email}</span>
                <span className="text-xs uppercase text-aluminum">{user.role}</span>
                <select 
                    value={user.role} 
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="border border-aluminum/20 p-2 text-xs"
                >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
        ))}
      </div>
    </div>
  );
}
