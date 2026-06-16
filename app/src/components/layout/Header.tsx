import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Catalogo', path: '/catalog' },
    { name: 'Collezioni', path: '/collections' },
    { name: 'Campionature', path: '/samples' },
    { name: 'Azienda', path: '/about' },
    { name: 'Contatti', path: '/contact' },
    { name: 'Carrello (0)', path: '/cart' },
  ];

  return (
    <header className="fixed top-0 w-full bg-bone/90 backdrop-blur-sm z-50 border-b border-aluminum/20">
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/logo-full.svg" alt="Vetronaviglio" className="h-16 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className="text-xs uppercase tracking-[0.2em] text-onyx hover:text-aluminum transition-colors">
              {link.name}
            </Link>
          ))}
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
        </div>
      )}
    </header>
  );
}
