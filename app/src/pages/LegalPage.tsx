import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useLang } from '../context/LanguageContext';

export default function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<any>(null);
  const { lang } = useLang();

  useEffect(() => {
    async function fetchPage() {
      const { data } = await supabase
        .from('legal_pages')
        .select('*')
        .eq('slug', slug)
        .single();
      setContent(data);
    }
    fetchPage();
  }, [slug]);

  if (!content) return <div className="p-24 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="font-serif text-3xl mb-8 uppercase tracking-[0.05em]">
        {lang === 'it' ? content.title_it : content.title_en}
      </h1>
      <div 
        className="prose prose-sm text-aluminum"
        dangerouslySetInnerHTML={{ __html: lang === 'it' ? content.content_it : content.content_en }}
      />
    </div>
  );
}
