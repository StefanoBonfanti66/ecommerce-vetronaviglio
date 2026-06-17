import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function RoleRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      setHasAccess(profile && allowedRoles.includes(profile.role));
      setLoading(false);
    }
    checkAccess();
  }, [allowedRoles]);

  if (loading) return <div className="p-12">Caricamento...</div>;
  
  if (!hasAccess) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
