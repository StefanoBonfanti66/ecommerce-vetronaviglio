import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      setIsAdmin(profile?.role === 'admin' || profile?.role === 'ceo');
      setLoading(false);
    }
    checkAdmin();
  }, []);

  return { isAdmin, loading };
}