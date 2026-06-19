import { useLang } from '../context/LanguageContext';

const MAP_KEY = 'AIzaSyAHk0UOyLvRbpAHHoBCqf2s4yUlzF71g8E';

export default function Contact() {
  const { t } = useLang();
  return (
    <div className="max-w-4xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">{t('contact_title')}</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <img
          src="/img/dove-siamo-sede.jpg"
          alt="Vetronaviglio sede"
          className="w-full h-80 object-cover"
        />
        <div className="w-full h-80">
          <iframe
            title="Vetronaviglio maps"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${MAP_KEY}&q=45.469425,9.000240&zoom=14`}
          />
        </div>
      </div>

      <div className="space-y-6 text-sm">
        <p>Vetronaviglio S.r.l.<br/>
        Via Don Severino Fracassi, 31/39 - 20008 Bareggio (MI) Italy</p>
        <p>
          T. +39 02 9036 4184 &ndash; F. +39 02 9036 4185 &ndash; P.IVA IT03366120271<br/>
          <a href="mailto:info@vetronaviglio.eu" className="underline">info@vetronaviglio.eu</a>
        </p>
        <p>{t('contact_info_label')} <a href="mailto:infostore@vetronaviglio.eu" className="underline">infostore@vetronaviglio.eu</a></p>
      </div>
    </div>
  );
}
