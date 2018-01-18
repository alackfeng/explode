// Translations
import I18n from './I18n';

export const translate = (key, locale, interpolation = null) =>
  I18n.t(key, { locale, ...interpolation });

export const locale = 'en'; //I18n.locale;

export * from "./routerTransition";
