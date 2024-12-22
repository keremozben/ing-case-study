import { translationService } from "../i18n/translation-service";

export const TranslationMixin = (superClass) =>
  class extends superClass {
    t(key, params) {
      return translationService.t(key, params);
    }

    static get properties() {
      return {
        ...super.properties,
        language: { type: String },
      };
    }

    constructor() {
      super();
      this.language = translationService.language;
    }

    connectedCallback() {
      super.connectedCallback();
      this._handleLanguageChange = () => {
        this.language = document.documentElement.lang;
        this.requestUpdate();
      };
      window.addEventListener("languagechange", this._handleLanguageChange);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      window.removeEventListener("languagechange", this._handleLanguageChange);
    }
  };
