import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useLang } from '../context/LanguageContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useLang();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-vs-16">
      <h1 className="font-serif text-3xl mb-vs-8 uppercase tracking-widest text-center">{t('login_title')}</h1>
      <form onSubmit={handleLogin} className="space-y-8">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-aluminum mb-2">{t('email_placeholder')}</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-aluminum/40 bg-transparent py-2 focus:border-onyx focus:outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-aluminum mb-2">{t('password_placeholder')}</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-aluminum/40 bg-transparent py-2 focus:border-onyx focus:outline-none transition-colors"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          {error && <p className="text-[10px] text-red-600 uppercase tracking-widest">{error}</p>}
          <Link to="/reset-password" className="text-[10px] text-aluminum hover:text-onyx transition-colors ml-auto">
            {t('forgot_password')}
          </Link>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-onyx text-bone py-4 uppercase text-xs tracking-[0.2em] font-medium hover:bg-aluminum transition-all"
        >
          {loading ? '...' : t('login_button')}
        </button>
      </form>
    </div>
  );
}
