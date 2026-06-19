import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
  const { t } = useLang();
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <Link to="/admin" className="text-sm text-aluminum hover:text-onyx flex items-center">
          ← {t('back_to_dashboard') || 'Torna alla Dashboard'}
        </Link>
      </div>
      {children}
    </div>
  );
}
