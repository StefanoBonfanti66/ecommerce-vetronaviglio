import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

export default function Home() {
  const { lang, t } = useLang();

  const categoryBottle = (
    <svg viewBox="0 0 200 300" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-20 h-28 opacity-[0.07]">
      <rect x="65" y="20" width="70" height="40" rx="4" />
      <rect x="55" y="55" width="90" height="210" rx="8" />
    </svg>
  );

  return (
    <div>
      {/* 1. HERO — Identity & Value Proposition */}
      <section className="max-w-7xl mx-auto px-6 pt-28 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-6 flex flex-col justify-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-6">Since 1966</p>
            <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.08] mb-6">
              {t('home_hero_title')}
            </h1>
            <p className="font-sans text-sm md:text-base leading-relaxed text-aluminum max-w-md mb-10">
              {t('home_hero_desc')}
              <span className="italic block mt-3 text-onyx/60">The beauty of being different.</span>
            </p>
            <Link
              to="/catalog"
              className="w-fit bg-onyx text-bone px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-aluminum transition-colors"
            >
              {t('home_hero_cta')}
            </Link>
          </div>
          <div className="md:col-span-6 bg-surface flex items-center justify-center min-h-[260px] md:min-h-[500px]">
            <div className="text-onyx/5">
              <svg viewBox="0 0 240 120" className="w-48 h-24 md:w-72 md:h-36" fill="none" stroke="currentColor" strokeWidth="0.5">
                <rect x="10" y="15" width="40" height="22" rx="3" />
                <rect x="5" y="35" width="50" height="75" rx="4" />
                <rect x="90" y="18" width="38" height="28" rx="4" />
                <rect x="85" y="44" width="48" height="66" rx="4" />
                <rect x="175" y="8" width="28" height="18" rx="3" />
                <rect x="170" y="25" width="38" height="85" rx="4" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS — Proof by numbers */}
      <section className="border-y border-aluminum/10">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center md:text-left">
              <p className="font-display text-3xl md:text-4xl font-semibold text-onyx mb-1">
                {lang === 'it' ? '1966' : 'Since 1966'}
              </p>
              <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-aluminum">
                {lang === 'it' ? 'Anni di esperienza nel settore beauty' : 'Years of experience in beauty packaging'}
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-display text-3xl md:text-4xl font-semibold text-onyx mb-1">800+</p>
              <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-aluminum">
                {lang === 'it' ? 'Prodotti a catalogo tra vetro e plastica' : 'Products in catalog in glass and plastic'}
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-display text-3xl md:text-4xl font-semibold text-onyx mb-1">
                {lang === 'it' ? '3' : '3'}
              </p>
              <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-aluminum">
                {lang === 'it' ? 'Famiglie: vetro, plastica, accessori' : 'Families: glass, plastic, accessories'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES — Product bridge */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/catalog?categoria=Vetro"
            className="group bg-surface p-8 md:p-10 flex flex-col justify-between min-h-[260px] md:min-h-[360px] border border-transparent hover:border-aluminum/20 transition-all"
          >
            <div className="self-end">{categoryBottle}</div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3 group-hover:text-amber-accent transition-colors">
                {t('glass')}
              </h2>
              <p className="font-sans text-[11px] leading-relaxed text-aluminum max-w-xs">
                {lang === 'it'
                  ? 'Flaconi, vasetti e contenitori in vetro per cosmetica e profumeria'
                  : 'Glass bottles, jars and containers for cosmetics and perfumery'}
              </p>
              <span className="inline-block mt-4 font-sans text-[9px] uppercase tracking-[0.2em] text-onyx/40 group-hover:text-onyx transition-colors">
                {lang === 'it' ? 'Esplora →' : 'Explore →'}
              </span>
            </div>
          </Link>
          <Link
            to="/catalog?categoria=Plastica"
            className="group bg-surface p-8 md:p-10 flex flex-col justify-between min-h-[260px] md:min-h-[360px] border border-transparent hover:border-aluminum/20 transition-all"
          >
            <div className="self-end">{categoryBottle}</div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3 group-hover:text-amber-accent transition-colors">
                {t('plastic')}
              </h2>
              <p className="font-sans text-[11px] leading-relaxed text-aluminum max-w-xs">
                {lang === 'it'
                  ? 'Flaconi, tubi e airless in plastica per skin-care e make-up'
                  : 'Plastic bottles, tubes and airless for skin-care and make-up'}
              </p>
              <span className="inline-block mt-4 font-sans text-[9px] uppercase tracking-[0.2em] text-onyx/40 group-hover:text-onyx transition-colors">
                {lang === 'it' ? 'Esplora →' : 'Explore →'}
              </span>
            </div>
          </Link>
          <Link
            to="/catalog?categoria=Accessori"
            className="group bg-surface p-8 md:p-10 flex flex-col justify-between min-h-[260px] md:min-h-[360px] border border-transparent hover:border-aluminum/20 transition-all"
          >
            <div className="self-end">{categoryBottle}</div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3 group-hover:text-amber-accent transition-colors">
                {t('accessories')}
              </h2>
              <p className="font-sans text-[11px] leading-relaxed text-aluminum max-w-xs">
                {lang === 'it'
                  ? 'Coperchi, dispenser, capsule e sistemi di erogazione'
                  : 'Caps, dispensers, closures and dispensing systems'}
              </p>
              <span className="inline-block mt-4 font-sans text-[9px] uppercase tracking-[0.2em] text-onyx/40 group-hover:text-onyx transition-colors">
                {lang === 'it' ? 'Esplora →' : 'Explore →'}
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. CUSTOMIZATION — B2B differentiator */}
      <section className="bg-surface border-y border-aluminum/10">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-4">
                {lang === 'it' ? 'Personalizzazione' : 'Customization'}
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-6">
                {lang === 'it' ? 'Il tuo packaging, su misura.' : 'Your packaging, tailor-made.'}
              </h2>
              <p className="font-sans text-sm leading-relaxed text-onyx/70">
                {lang === 'it'
                  ? 'Personalizziamo forma, colore, finitura e applicazione di ogni contenitore. Dalla serigrafia alla metallizzazione, dalla selezione del colore Pantone® all\'applicazione di etichette: ogni dettaglio si adatta al tuo prodotto.'
                  : 'We customize shape, color, finish and application of every container. From screen printing to metallization, from Pantone® color matching to label application: every detail adapts to your product.'}
              </p>
            </div>
            <div className="flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-sans text-[9px] uppercase tracking-[0.15em] text-aluminum mb-1">01</p>
                  <p className="font-sans text-sm font-medium text-onyx">
                    {lang === 'it' ? 'Forma e volume' : 'Shape & volume'}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[9px] uppercase tracking-[0.15em] text-aluminum mb-1">02</p>
                  <p className="font-sans text-sm font-medium text-onyx">
                    {lang === 'it' ? 'Colore Pantone®' : 'Pantone® color'}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[9px] uppercase tracking-[0.15em] text-aluminum mb-1">03</p>
                  <p className="font-sans text-sm font-medium text-onyx">
                    {lang === 'it' ? 'Finitura superficiale' : 'Surface finish'}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[9px] uppercase tracking-[0.15em] text-aluminum mb-1">04</p>
                  <p className="font-sans text-sm font-medium text-onyx">
                    {lang === 'it' ? 'Serigrafia e applicazioni' : 'Printing & labeling'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MID-PAGE CTA + PROOF */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="bg-onyx p-8 md:p-12 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h2 className="font-display text-2xl md:text-4xl font-semibold text-bone tracking-tight mb-4">
              {lang === 'it' ? 'Parlaci del tuo progetto.' : 'Tell us about your project.'}
            </h2>
            <p className="font-sans text-xs md:text-sm leading-relaxed text-bone/60 mb-6">
              {lang === 'it'
                ? 'Dalla consulenza tecnica alla realizzazione del campione, ti accompagniamo in ogni fase.'
                : 'From technical consultation to sample production, we support you at every stage.'}
            </p>
            <Link
              to="/contact"
              className="inline-block border border-bone/30 text-bone/80 px-8 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-bone/10 hover:text-bone transition-colors"
            >
              {lang === 'it' ? 'Richiedi consulenza' : 'Request consultation'}
            </Link>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-bone/10 pt-6 md:pt-0 md:pl-12">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-bone/30 mb-4">
              {lang === 'it' ? 'Perché sceglierci' : 'Why choose us'}
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-accent flex-shrink-0" />
                <span className="font-sans text-xs text-bone/70">
                  {lang === 'it' ? 'Oltre 60 anni di esperienza nel settore beauty' : 'Over 60 years in the beauty industry'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-accent flex-shrink-0" />
                <span className="font-sans text-xs text-bone/70">
                  {lang === 'it' ? 'Produzione italiana con capacità industriale' : 'Italian manufacturing with industrial capacity'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-accent flex-shrink-0" />
                <span className="font-sans text-xs text-bone/70">
                  {lang === 'it' ? 'Personalizzazione completa: forma, colore, finitura' : 'Full customization: shape, color, finish'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. MANIFATTURA — Process & Quality */}
      <section className="bg-surface border-y border-aluminum/10">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-4">
                {lang === 'it' ? 'Manifattura' : 'Manufacturing'}
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-6">
                {lang === 'it' ? 'Qualità industriale, flessibilità artigianale.' : 'Industrial quality, artisanal flexibility.'}
              </h2>
            </div>
            <div>
              <p className="font-sans text-sm leading-relaxed text-onyx/70 mb-6">
                {lang === 'it'
                  ? 'Ogni componente segue un rigoroso controllo qualità in ogni fase della filiera: dalla selezione delle materie prime alla produzione, dal confezionamento alla spedizione. Lavoriamo con fornitori selezionati per garantire standard costanti su ogni ordine, dalla piccola serie alla produzione industriale.'
                  : 'Every component undergoes rigorous quality control at each stage of the supply chain: from raw material selection to production, from packaging to shipping. We work with selected suppliers to ensure consistent standards on every order, from small batches to industrial production.'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-aluminum/10 p-4">
                  <p className="font-sans text-[11px] font-medium text-onyx">
                    {lang === 'it' ? 'Controllo qualità' : 'Quality control'}
                  </p>
                </div>
                <div className="border border-aluminum/10 p-4">
                  <p className="font-sans text-[11px] font-medium text-onyx">
                    {lang === 'it' ? 'Fornitori selezionati' : 'Selected suppliers'}
                  </p>
                </div>
                <div className="border border-aluminum/10 p-4">
                  <p className="font-sans text-[11px] font-medium text-onyx">
                    {lang === 'it' ? 'Produzione italiana' : 'Italian production'}
                  </p>
                </div>
                <div className="border border-aluminum/10 p-4">
                  <p className="font-sans text-[11px] font-medium text-onyx">
                    {lang === 'it' ? 'Volumi flessibili' : 'Flexible volumes'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
        <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-4">
          {lang === 'it' ? 'Inizia da un campione.' : 'Start with a sample.'}
        </h2>
        <p className="font-sans text-sm text-aluminum max-w-md mx-auto mb-8">
          {lang === 'it'
            ? 'Richiedi una campionatura dei prodotti che ti interessano e verifica qualità, finitura e compatibilità prima dell\'ordine.'
            : 'Request samples of the products you are interested in and verify quality, finish and compatibility before ordering.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/catalog"
            className="border border-onyx/20 text-onyx px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:border-onyx transition-colors"
          >
            {lang === 'it' ? 'Esplora catalogo' : 'Browse catalog'}
          </Link>
          <Link
            to="/contact"
            className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum hover:text-onyx transition-colors underline underline-offset-4"
          >
            {lang === 'it' ? 'Contattaci' : 'Contact us'}
          </Link>
        </div>
      </section>
    </div>
  );
}