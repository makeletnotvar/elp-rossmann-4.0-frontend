import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationPL from './locales/pl/translation.json';

// the translations
const resources = {
	pl: {
		translation: translationPL,
	},
};

i18n.use(initReactI18next).init({
	resources,
	fallbackLng: 'pl',
	debug: false,
	interpolation: {
		escapeValue: false, // not needed for react as it escapes by default
	},
});

export default i18n;
