import { useLang } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-aluminum/20 mt-vs-16 py-vs-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-vs-8 text-[11px] text-aluminum uppercase tracking-[0.1em]">
        
        {/* Info Azienda */}
        <div className="space-y-2">
          <h4 className="text-onyx font-sans font-bold">Vetronaviglio S.r.l.</h4>
          <p>Via Don Severino Fracassi, 31/39</p>
          <p>20008 Bareggio (MI), Italy</p>
        </div>

        {/* Contatti */}
        <div className="space-y-2">
          <h4 className="text-onyx font-sans font-bold">{t('contact')}</h4>
          <p>T. +39 02 9036 4184</p>
          <p>infostore@vetronaviglio.eu</p>
        </div>

        {/* Link Legali */}
        <div className="space-y-2 flex flex-col">
          <h4 className="text-onyx font-sans font-bold">{t('info')}</h4>
          <Link to="/legal/terms" className="hover:text-onyx">{t('terms_of_sale')}</Link>
          <Link to="/legal/privacy" className="hover:text-onyx">{t('privacy_policy')}</Link>
          <Link to="/legal/cookies" className="hover:text-onyx">{t('cookie_policy')}</Link>
        </div>
      </div>
    </footer>
  );
}
