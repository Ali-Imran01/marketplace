import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "welcome": "Welcome to SecondChance",
            "get_started": "Get Started",
            "tagline": "Your guided experience for buying and selling used items."
        }
    },
    bm: {
        translation: {
            "welcome": "Selamat Datang ke SecondChance",
            "get_started": "Mula Sekarang",
            "tagline": "Pengalaman berpandu anda untuk jual beli barangan terpakai."
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('language') || 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
