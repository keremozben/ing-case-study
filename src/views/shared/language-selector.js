import { LitElement, html, css } from "lit";
import { translationService } from "../../i18n/translation-service";
import { TranslationMixin } from "../../mixins/translation-mixin";

export class LanguageSelector extends TranslationMixin(LitElement) {
  static properties = {
    currentLanguage: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    select {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ddd;
      background-color: white;
      cursor: pointer;
      font-size: 14px;
    }

    select:focus {
      outline: none;
      border-color: #4caf50;
    }

    @media (max-width: 768px) {
      select {
        width: 100%;
      }
    }
  `;

  constructor() {
    super();
    this.currentLanguage = translationService.language;
  }

  render() {
    return html`
      <select
        @change=${this._handleLanguageChange}
        .value=${this.currentLanguage}
        aria-label="Select language"
      >
        <option value="en">${this.t("languageSelector.english")}</option>
        <option value="tr">${this.t("languageSelector.turkish")}</option>
      </select>
    `;
  }

  _handleLanguageChange(e) {
    const newLanguage = e.target.value;
    this.currentLanguage = newLanguage;
    translationService.setLanguage(newLanguage);

    window.dispatchEvent(new Event("languagechange"));
  }
}

customElements.define("language-selector", LanguageSelector);
