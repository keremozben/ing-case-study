import { en } from "./en";
import { tr } from "./tr";

class TranslationService {
  constructor() {
    this._translations = {
      en,
      tr,
    };
    this._language = document.documentElement.lang || "en";
  }

  setLanguage(lang) {
    if (this._translations[lang]) {
      this._language = lang;
      document.documentElement.lang = lang;
    }
  }

  get language() {
    return this._language;
  }

  t(key, params = {}) {
    const keys = key.split(".");
    let value = this._translations[this._language];

    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }

    if (!value) return key;

    return Object.entries(params).reduce(
      (str, [param, val]) => str.replace(`{${param}}`, val),
      value
    );
  }
}

export const translationService = new TranslationService();
