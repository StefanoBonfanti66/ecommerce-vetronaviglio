import { useState } from 'react';
import Papa from 'papaparse';
import { supabase } from '../../supabaseClient';

export default function CatalogTools() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    const { data } = await supabase.from('products').select('*');
    if (data) {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'catalogo-prodotti.csv';
      link.click();
    }
    setExporting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-vs-16">
      <h1 className="font-serif text-3xl uppercase tracking-[0.05em] mb-12">Strumenti Catalogo</h1>
      
      <div className="space-y-12">
        <div className="border border-aluminum/20 p-8">
            <h3 className="font-serif text-xl mb-4">Esportazione Catalogo</h3>
            <p className="text-sm text-aluminum mb-6">Scarica l'intero catalogo in formato CSV.</p>
            <button 
                onClick={handleExport}
                disabled={exporting}
                className="text-[10px] uppercase tracking-[0.2em] border border-onyx py-2 px-4 hover:bg-onyx hover:text-bone transition-all"
            >
                {exporting ? 'Esportazione...' : 'Esporta CSV'}
            </button>
        </div>

        <div className="border border-aluminum/20 p-8">
            <h3 className="font-serif text-xl mb-4">Importazione Catalogo</h3>
            <p className="text-sm text-aluminum mb-6">
                Per importare nuovi prodotti o aggiornamenti massivi, carica il file Excel aggiornato nella cartella <code className="font-mono bg-aluminum/10 p-1">data/imports/raw/</code> del progetto e lancia lo script <code className="font-mono bg-aluminum/10 p-1">./scripts/import_catalog.py</code> dal terminale server.
            </p>
        </div>
      </div>
    </div>
  );
}
