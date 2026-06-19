import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useLang } from '../context/LanguageContext';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLang();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-6 py-vs-16 text-center">
        <p className="font-sans text-sm text-aluminum leading-relaxed">{t('reset_password_sent')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-vs-16">
      <h1 className="font-serif text-3xl mb-4 uppercase tracking-widest text-center">{t('reset_password_title')}</h1>
      <p className="text-[10px] text-aluminum text-center mb-8">{t('reset_password_instructions')}</p>
      <form onSubmit={handleReset} className="space-y-8">
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
        {error && <p className="text-[10px] text-red-600 uppercase tracking-widest">{error}</p>}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-onyx text-bone py-4 uppercase text-xs tracking-[0.2em] font-medium hover:bg-aluminum transition-all"
        >
          {loading ? '...' : t('reset_password_button')}
        </button>
      </form>
    </div>
  );
}
