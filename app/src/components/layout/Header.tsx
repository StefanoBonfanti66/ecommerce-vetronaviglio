import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useCart } from '../../context/CartContext';
import { useLang } from '../../context/LanguageContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const { cart } = useCart();
  const { lang, setLang } = useLang();

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
    { name: 'Collezioni', path: '/collections' },
    { name: 'Catalogo', path: '/catalog' },
    { name: 'Campionature', path: '/samples' },
    { name: 'Azienda', path: '/about' },
    { name: 'Contatti', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 w-full bg-bone/90 backdrop-blur-sm z-50 border-b border-aluminum/20">
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center mr-8">
          <img src="/logo-full.svg" alt="Vetronaviglio" className="h-16 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center flex-grow justify-end mr-12">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className="text-xs uppercase tracking-[0.2em] text-onyx hover:text-aluminum transition-colors">
              {link.name}
            </Link>
          ))}
          <button onClick={() => setLang(lang === 'it' ? 'en' : 'it')} className="text-xs uppercase tracking-[0.2em] text-onyx font-bold hover:text-aluminum transition-colors">
            {lang.toUpperCase()}
          </button>
          {session ? (
            <button onClick={handleLogout} className="text-xs uppercase tracking-[0.2em] text-aluminum hover:text-onyx transition-colors">
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-xs uppercase tracking-[0.2em] text-onyx hover:text-aluminum transition-colors">
              Login
            </Link>
          )}
        </div>

        {/* Cart Icon & Mobile Nav Actions */}
        <div className="flex items-center gap-6 ml-auto md:ml-0">
            <button className="md:hidden text-xs uppercase tracking-widest" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? 'Chiudi' : 'Menu'}
            </button>
            <Link to="/cart" className="relative text-onyx hover:text-aluminum transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                {cart.length > 0 && <span className="absolute -top-2 -right-3 bg-onyx text-bone text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
            </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-bone border-b border-aluminum/20 p-6 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className="text-sm uppercase tracking-widest" onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
          {session ? (
            <button onClick={handleLogout} className="text-sm uppercase tracking-widest">Logout</button>
          ) : (
            <Link to="/login" className="text-sm uppercase tracking-widest" onClick={() => setIsOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
