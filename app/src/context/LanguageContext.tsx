import { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'it' | 'en';
const LanguageContext = createContext<{ lang: Lang, setLang: (lang: Lang) => void }>({ lang: 'it', setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('it');
  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
