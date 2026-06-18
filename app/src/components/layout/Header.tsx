import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const { cart } = useCart();

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
    { name: `Carrello (${cart.length})`, path: '/cart' },
  ];

  return (
    <header className="fixed top-0 w-full bg-bone/90 backdrop-blur-sm z-50 border-b border-aluminum/20">
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/logo-full.svg" alt="Vetronaviglio" className="h-16 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className="text-xs uppercase tracking-[0.2em] text-onyx hover:text-aluminum transition-colors">
              {link.name}
            </Link>
          ))}
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

        {/* Mobile Toggle */}
        <button className="md:hidden text-xs uppercase tracking-widest" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Chiudi' : 'Menu'}
        </button>
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
