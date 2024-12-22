import { en } from "./en";
import { tr } from "./tr";

class TranslationService {
  constructor() {
    this._translations = {
      en,
      tr,
    };
    this._language = this._getInitialLanguage();

    // Set initial HTML lang attribute
    document.documentElement.lang = this._language;
  }

  _getInitialLanguage() {
    // Check localStorage first
    const savedLang = localStorage.getItem("preferred-language");
    if (savedLang && this._translations[savedLang]) {
      return savedLang;
    }

    // Then check HTML lang attribute
    const htmlLang = document.documentElement.lang;
    if (htmlLang && this._translations[htmlLang]) {
      return htmlLang;
    }

    // Default to 'en'
    return "en";
  }

  setLanguage(lang) {
    if (this._translations[lang]) {
      this._language = lang;
      document.documentElement.lang = lang;
      // Save preference
      localStorage.setItem("preferred-language", lang);

      // Dispatch event for any listeners
      window.dispatchEvent(
        new CustomEvent("language-changed", {
          detail: { language: lang },
          bubbles: true,
        })
      );
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
