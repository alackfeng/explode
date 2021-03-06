// Translations
import I18n from './I18n';
import willTransitionTo from './routerTransition';


export const translate = (key, locale, interpolation = null) =>
  I18n.t(key, { locale, ...interpolation });

export const locale = I18n.locale || 'en';

export const switchLanguage = (language) => {
  I18n.locale = language || 'en';

};

export * from './help';
export * from './Colors';

export { willTransitionTo };

export * from './Utils';
