import i18n from 'i18next';
import { initReactI18next } from '@/node_modules/react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';
import hi from './locales/hi.json';
import es from './locales/es.json';
import de from './locales/de.json';
import ar from './locales/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      de: { translation: de },
      hi: { translation: hi },
      es: { translation: es },
      ar: { translation: ar },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
