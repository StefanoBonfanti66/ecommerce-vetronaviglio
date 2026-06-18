import { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '../constants/translations';

type Lang = 'it' | 'en';
const LanguageContext = createContext<{ lang: Lang, setLang: (lang: Lang) => void, t: (key: keyof typeof translations.it) => string }>({ 
    lang: 'it', 
    setLang: () => {}, 
    t: (key) => translations.it[key] 
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('it');
  
  const t = (key: keyof typeof translations.it) => translations[lang][key] || key;

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
