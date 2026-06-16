import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCollections() {
      const { data } = await supabase.from('collections').select('*');
      setCollections(data || []);
    }
    fetchCollections();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-vs-16">
      <h1 className="font-serif text-5xl uppercase tracking-[0.05em] mb-vs-16">Collezioni</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((col) => (
          <Link 
            key={col.id} 
            to={`/catalog?collection=${col.slug}`} 
            className="group border border-aluminum/20 p-8 h-[300px] flex items-end hover:border-onyx transition-all duration-300"
          >
            <span className="font-serif text-3xl group-hover:pl-4 transition-all duration-300">{col.name_it}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
