// Translations
import I18n from './I18n';

/**
 * Web only libs
 */
// enable icons fonts
import './fonts';

// enable offline support on web platform
if (process.env.NODE_ENV === 'production') {
  require('./pwa');
}

export const translate = (key, locale, interpolation = null) =>
  I18n.t(key, { locale, ...interpolation });

export const locale = I18n.locale;