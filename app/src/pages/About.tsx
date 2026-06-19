import { useLang } from '../context/LanguageContext';

const timeline = [
  { year: '1991', key: 'about_tl_1991' },
  { year: '2002', key: 'about_tl_2002' },
  { year: '2003', key: 'about_tl_2003' },
  { year: '2012', key: 'about_tl_2012' },
  { year: '2016', key: 'about_tl_2016' },
  { year: '2018', key: 'about_tl_2018' },
  { year: '2022', key: 'about_tl_2022' },
];

export default function About() {
  const { t } = useLang();
  return (
    <div className="max-w-4xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">{t('about_title')}</h1>
      </header>

      <div className="text-sm leading-relaxed space-y-5">
        <p>{t('about_intro')}</p>
        <p>{t('about_intro_2')}</p>
      </div>

      <blockquote className="border-l-2 border-onyx/30 pl-5 my-10 text-sm italic text-aluminum leading-relaxed">
        &ldquo;{t('about_quote')}&rdquo;
      </blockquote>

      <p className="text-sm leading-relaxed mb-10">{t('about_quality')}</p>

      <h2 className="font-serif text-xl uppercase tracking-[0.05em] mb-6">{t('about_subtitle')}</h2>

      <div className="mb-14">
        <h3 className="font-serif text-lg uppercase tracking-[0.05em] text-onyx/70 mb-8">{t('about_timeline_title')}</h3>
        <div className="space-y-6">
          {timeline.map(item => (
            <div key={item.year} className="flex gap-5">
              <span className="font-mono text-sm font-bold text-onyx whitespace-nowrap w-12">{item.year}</span>
              <p className="text-sm leading-relaxed">{t(item.key)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-aluminum/20 pt-10">
        <h2 className="font-serif text-lg uppercase tracking-[0.05em] mb-6">{t('about_final_title')}</h2>
        <p className="text-sm leading-relaxed">{t('about_final_text')}</p>
      </div>
    </div>
  );
}
