import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useLang } from '../context/LanguageContext';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const { t } = useLang();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
      }
    });
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      supabase.auth.setSession({
        access_token: params.get('access_token')!,
        refresh_token: params.get('refresh_token')!,
      });
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto px-6 py-vs-16 text-center">
        <p className="font-sans text-sm text-aluminum leading-relaxed">{t('password_updated')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-vs-16">
      <h1 className="font-serif text-3xl mb-vs-8 uppercase tracking-widest text-center">{t('reset_password_title')}</h1>
      <form onSubmit={handleUpdate} className="space-y-8">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-aluminum mb-2">{t('new_password')}</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-aluminum/40 bg-transparent py-2 focus:border-onyx focus:outline-none transition-colors"
            required
            minLength={6}
          />
        </div>
        {error && <p className="text-[10px] text-red-600 uppercase tracking-widest">{error}</p>}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-onyx text-bone py-4 uppercase text-xs tracking-[0.2em] font-medium hover:bg-aluminum transition-all"
        >
          {loading ? '...' : t('update_password_button')}
        </button>
      </form>
    </div>
  );
}
