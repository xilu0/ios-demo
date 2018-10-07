import ReactNative from 'react-native';
import I18n from 'react-native-i18n';

// Import all locales
import { en } from '../../../locales/en';
import { zh_Hans } from '../../../locales/zh-Hans';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en,
  'zh-CN': zh_Hans, // 国产机型-中国大陆
  'zh-HK': zh_Hans, // 国产机型-中国香港
  'zh-TW': zh_Hans, // 国产机型-中国台湾
  'zh-Hans': zh_Hans, // 国外机型-汉语简体
  'zh-Hant': zh_Hans,  // 国外机型-汉语繁体
};

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export const strings = (name: string, params = {}) => {
  return I18n.t(name, params);
};
