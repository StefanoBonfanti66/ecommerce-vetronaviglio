import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useCart } from '../../context/CartContext';
import { useLang } from '../../context/LanguageContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const { cart } = useCart();
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const navLinks = [
    { name: t('collections'), path: '/collections' },
    { name: t('catalog'), path: '/catalog' },
    { name: t('samples'), path: '/samples' },
    { name: t('about'), path: '/about' },
    { name: t('contact'), path: '/contact' },
  ];

  return (
    <header className="fixed top-0 w-full bg-bone/90 backdrop-blur-sm z-50 border-b border-aluminum/10">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 mr-8">
          <img src="/logo-full.svg" alt="Vetronaviglio" className="h-14 w-auto" />
          <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-aluminum hidden lg:block pt-1">Since 1966</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center flex-grow justify-end mr-8">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className="font-sans text-[11px] uppercase tracking-[0.2em] text-onyx/70 hover:text-onyx transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <button onClick={() => setLang(lang === 'it' ? 'en' : 'it')} className="font-sans text-[11px] uppercase tracking-widest font-medium text-onyx/60 hover:text-onyx transition-colors hidden md:block">
            {lang.toUpperCase()}
          </button>
          {session ? (
            <>
              <Link to="/admin" className="font-sans text-[10px] uppercase tracking-[0.2em] text-amber-accent hover:text-onyx transition-colors hidden md:block">
                Admin
              </Link>
              <button onClick={handleLogout} className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum hover:text-onyx transition-colors hidden md:block">
                {t('logout')}
              </button>
            </>
          ) : (
            <Link to="/login" className="font-sans text-[10px] uppercase tracking-[0.2em] text-onyx/60 hover:text-onyx transition-colors hidden md:block">
              {t('login')}
            </Link>
          )}
          <Link to="/cart" className="relative p-3 text-onyx/70 hover:text-onyx transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cart.length > 0 && <span className="absolute top-0.5 -right-0.5 bg-amber-accent text-bone text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-medium">{cart.length}</span>}
          </Link>
          <button className="md:hidden font-sans text-[10px] uppercase tracking-widest text-onyx/70 hover:text-onyx py-3 px-2 min-w-[44px] min-h-[44px]" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? t('close') : t('menu')}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-bone border-t border-aluminum/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className="font-sans text-sm uppercase tracking-widest text-onyx/80 py-3 min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
          <div className="border-t border-aluminum/10 pt-5 flex items-center gap-4">
            <button onClick={() => setLang(lang === 'it' ? 'en' : 'it')} className="font-sans text-xs uppercase tracking-widest font-medium text-onyx/60 py-3 min-h-[44px]">
              {lang.toUpperCase()}
            </button>
            {session ? (
              <>
                <Link to="/admin" className="font-sans text-xs uppercase tracking-widest text-amber-accent py-3 min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>Admin</Link>
                <button onClick={handleLogout} className="font-sans text-xs uppercase tracking-widest text-aluminum py-3 min-h-[44px]">{t('logout')}</button>
              </>
            ) : (
              <Link to="/login" className="font-sans text-xs uppercase tracking-widest text-onyx/60 py-3 min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>{t('login')}</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}