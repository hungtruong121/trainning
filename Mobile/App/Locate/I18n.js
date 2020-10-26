import ReactNative from 'react-native';
import I18n from 'react-native-i18n';
// import moment from 'moment';
import {saveLanguage} from 'App/Utils/storage.helper';
// Import all locales
import en from './en.json';
import jp from './jp.json';
import vi from './vi.json';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en,
  jp,
  vi,
};

const currentLocale = I18n.currentLocale();
// Is it a RTL language?
export const isRTL =
  currentLocale.indexOf('jp') === 0 || currentLocale.indexOf('en') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// Localizing momentjs to Hebrew or English
// if (currentLocale.indexOf('jp') === 0) {
//   require('moment/locale/nl.js');
//   moment.locale('jp');
// } else {
//   moment.locale('en');
// }
export function strings(name, params = {}) {
  return I18n.t(name, params);
}
export const switchLanguage = (userId, lang, component) => {
  saveLanguage(userId, lang);
  I18n.locale = lang;
  component.forceUpdate();
};
export default I18n;
