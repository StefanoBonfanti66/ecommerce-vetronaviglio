import { useLang } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-onyx mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="w-10 h-10 bg-bone/10 rounded flex items-center justify-center">
              <span className="font-display text-bone text-xs">VN</span>
            </div>
            <p className="font-sans text-[10px] leading-relaxed text-bone/50 max-w-xs">
              Packaging primario in vetro e plastica per il settore Beauty. Design italiano dal 1966.
            </p>
          </div>

          {/* Azienda */}
          <div className="space-y-3">
            <h4 className="font-sans text-[9px] uppercase tracking-[0.2em] text-bone/40 font-medium">{t('contact')}</h4>
            <div className="font-sans text-[10px] text-bone/60 leading-relaxed space-y-1">
              <p>Vetronaviglio S.r.l.</p>
              <p>Via Don Severino Fracassi, 31/39</p>
              <p>20008 Bareggio (MI), Italy</p>
              <p className="pt-2">T. +39 02 9036 4184</p>
              <p>infostore@vetronaviglio.eu</p>
            </div>
          </div>

          {/* Info / Legali */}
          <div className="space-y-3">
            <h4 className="font-sans text-[9px] uppercase tracking-[0.2em] text-bone/40 font-medium">{t('info')}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/legal/terms" className="font-sans text-[10px] text-bone/60 hover:text-bone transition-colors py-2 min-h-[44px] flex items-center">{t('terms_of_sale')}</Link>
              <Link to="/legal/privacy" className="font-sans text-[10px] text-bone/60 hover:text-bone transition-colors py-2 min-h-[44px] flex items-center">{t('privacy_policy')}</Link>
              <Link to="/legal/cookies" className="font-sans text-[10px] text-bone/60 hover:text-bone transition-colors py-2 min-h-[44px] flex items-center">{t('cookie_policy')}</Link>
            </div>
          </div>

          {/* Design System note placeholder */}
          <div className="hidden md:block space-y-3">
            <h4 className="font-sans text-[9px] uppercase tracking-[0.2em] text-bone/40 font-medium">Catalogo</h4>
            <p className="font-sans text-[10px] text-bone/50 leading-relaxed">
              Beyond beauty packaging. Esplora la nostra selezione di flaconi, vasetti e accessori per cosmetica e make-up.
            </p>
          </div>

        </div>

        <div className="border-t border-bone/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-sans text-[8px] text-bone/30 uppercase tracking-[0.15em]">
            © {new Date().getFullYear()} Vetronaviglio S.r.l. · P.IVA 03366120271
          </p>
          <p className="font-sans text-[8px] text-bone/20 uppercase tracking-[0.15em]">
            The beauty of being different.
          </p>
        </div>
      </div>
    </footer>
  );
}