import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

export default function Home() {
  const { t } = useLang();
  return (
    <div className="space-y-vs-16 pb-vs-16">
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-vs-16 px-6 pt-vs-8">
        <div className="md:col-span-4 flex flex-col justify-center">
          <h1 className="text-hero mb-6">{t('home_hero_title')}</h1>
          <p className="max-w-md text-lg leading-relaxed mb-10 text-aluminum">
            {t('home_hero_desc')}
            <span className="italic block mt-2">The beauty of being different.</span>
          </p>
          <Link to="/catalog" className="w-fit bg-onyx text-bone px-10 py-4 uppercase text-xs tracking-[0.2em] font-medium hover:bg-aluminum transition-colors">
            {t('home_hero_cta')}
          </Link>
        </div>
        <div className="md:col-span-8 h-[600px] bg-aluminum/10 border border-aluminum/20 relative flex items-end p-8 bg-[url('https://www.vetronaviglio.eu/upload/file/lowmoqproducts/cat/files/Flaconi%20vetro%20cosmetica%20VETRONAVIGLIO.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-onyx/10" />
          <span className="text-[9px] uppercase tracking-widest text-bone relative z-10">Vetro Ambra - Dettaglio Collo GCMI</span>
        </div>
      </section>

      {/* Collections Section */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-sub-heading mb-vs-8">{t('home_collections_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-8 h-auto md:h-[800px]">
          
          <Link to="/catalog" className="md:row-span-2 md:col-span-2 relative group border border-aluminum/20 p-8 flex items-end bg-[url('https://www.vetronaviglio.eu/upload/file/lowmoqproducts/cat/files/VASI%20vetro%20cosmetica%20VETRONAVIGLIO.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-onyx/20 group-hover:bg-onyx/10 transition-all" />
            <span className="text-4xl font-serif text-bone relative z-10">{t('glass')}</span>
          </Link>

          <Link to="/catalog" className="relative group border border-aluminum/20 p-8 flex items-end bg-[url('https://www.vetronaviglio.eu/upload/file/lowmoqproducts/cat/files/Flaconi%20vetro%20cosmetica%20VETRONAVIGLIO.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-onyx/20 group-hover:bg-onyx/10 transition-all" />
            <span className="text-2xl font-serif text-bone relative z-10">{t('plastic')}</span>
          </Link>

          <Link to="/catalog" className="relative group border border-aluminum/20 p-8 flex items-end bg-[url('https://www.vetronaviglio.eu/upload/file/lowmoqproducts/cat/files/VASI%20vetro%20cosmetica%20VETRONAVIGLIO.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-onyx/20 group-hover:bg-onyx/10 transition-all" />
            <span className="text-2xl font-serif text-bone relative z-10">{t('accessories')}</span>
          </Link>
          
        </div>
      </section>
    </div>
  );
}
