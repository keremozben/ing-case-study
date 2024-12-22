import { translationService } from "../i18n/translation-service";

export const TranslationMixin = (superClass) =>
  class extends superClass {
    constructor() {
      super();
      this._handleLanguageChange = this._handleLanguageChange.bind(this);
    }

    connectedCallback() {
      super.connectedCallback?.();
      window.addEventListener("language-changed", this._handleLanguageChange);
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      window.removeEventListener(
        "language-changed",
        this._handleLanguageChange
      );
    }

    _handleLanguageChange() {
      this.requestUpdate();
    }

    t(key, params = {}) {
      return translationService.t(key, params);
    }
  };
