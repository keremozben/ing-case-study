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
    this._handleLanguageChange = this._handleLanguageChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("language-changed", this._handleLanguageChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("language-changed", this._handleLanguageChange);
  }

  _handleLanguageChange(e) {
    this.currentLanguage = e.detail.language;
    this.requestUpdate();
  }

  _handleSelectChange(e) {
    const newLanguage = e.target.value;
    this.currentLanguage = newLanguage;
    translationService.setLanguage(newLanguage);
  }

  render() {
    return html`
      <select
        @change=${this._handleSelectChange}
        .value=${this.currentLanguage}
        aria-label=${this.t("languageSelector.ariaLabel")}
      >
        <option value="en" ?selected=${this.currentLanguage === "en"}>
          ${this.t("languageSelector.english")}
        </option>
        <option value="tr" ?selected=${this.currentLanguage === "tr"}>
          ${this.t("languageSelector.turkish")}
        </option>
      </select>
    `;
  }
}

customElements.define("language-selector", LanguageSelector);
