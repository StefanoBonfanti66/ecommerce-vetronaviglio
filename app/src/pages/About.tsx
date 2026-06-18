import { useLang } from '../context/LanguageContext';

export default function About() {
  const { t } = useLang();
  return (
    <div className="max-w-4xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">{t('about_title')}</h1>
      </header>
      <div className="prose prose-onyx text-sm leading-relaxed">
        <p>{t('about_p1')}</p>
        <p>{t('about_p2')}</p>
      </div>
    </div>
  );
}
