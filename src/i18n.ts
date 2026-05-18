import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      te: { translation: te },
      ta: { translation: ta },
      kn: { translation: kn },
      ml: { translation: ml },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
  }, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    console.log('i18next initialized');
    console.log('Current Language:', i18n.language);
  });

export default i18n;
