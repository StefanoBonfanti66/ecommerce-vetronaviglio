export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-vs-16">
      <h1 className="font-serif text-sub-heading mb-8 uppercase tracking-[0.05em]">Admin Dashboard</h1>
      <p className="text-aluminum">Pannello di controllo amministrativo per la gestione del catalogo e degli utenti.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        <div className="border border-aluminum/20 p-8">
            <h3 className="font-serif text-xl mb-4">Gestione Prodotti</h3>
            <p className="text-sm text-aluminum mb-6">Aggiungi, modifica o rimuovi prodotti dal catalogo.</p>
            <button className="text-[10px] uppercase tracking-[0.2em] border border-onyx py-2 px-4 hover:bg-onyx hover:text-bone">Vai</button>
        </div>
      </div>
    </div>
  );
}
