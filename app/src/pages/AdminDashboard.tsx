import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-vs-16">
      <h1 className="font-serif text-sub-heading mb-8 uppercase tracking-[0.05em]">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        <Link to="/admin/products" className="border border-aluminum/20 p-8 hover:border-onyx transition-all">
            <h3 className="font-serif text-xl mb-4">Gestione Prodotti</h3>
            <p className="text-sm text-aluminum mb-6">Aggiungi, modifica o rimuovi prodotti dal catalogo.</p>
            <span className="text-[10px] uppercase tracking-[0.2em] border border-onyx py-2 px-4">Accedi</span>
        </Link>
        <Link to="/admin/tools" className="border border-aluminum/20 p-8 hover:border-onyx transition-all">
            <h3 className="font-serif text-xl mb-4">Strumenti Catalogo</h3>
            <p className="text-sm text-aluminum mb-6">Importazione ed esportazione massiva dati.</p>
            <span className="text-[10px] uppercase tracking-[0.2em] border border-onyx py-2 px-4">Accedi</span>
        </Link>
      </div>
    </div>
  );
}
