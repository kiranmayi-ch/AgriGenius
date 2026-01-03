"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import en from '@/lib/locales/en.json';
import te from '@/lib/locales/te.json';
// Import other languages similarly, using placeholders for now
import hi from '@/lib/locales/en.json';
import ta from '@/lib/locales/en.json';
import ml from '@/lib/locales/en.json';
import bn from '@/lib/locales/en.json';
import mr from '@/lib/locales/en.json';
import or from '@/lib/locales/en.json';
import pa from '@/lib/locales/en.json';
import gu from '@/lib/locales/en.json';


export type Language = 'en' | 'te' | 'hi' | 'ta' | 'ml' | 'bn' | 'mr' | 'or' | 'pa' | 'gu';

const translations = {
  en,
  te,
  hi,
  ta,
  ml,
  bn,
  mr,
  or,
  pa,
  gu,
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: typeof en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo(() => {
    return {
      language,
      setLanguage,
      translations: translations[language],
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
