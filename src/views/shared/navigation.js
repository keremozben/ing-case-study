import { LitElement, html, css } from "lit";
import { TranslationMixin } from "../../mixins/translation-mixin";
import "./nav-button";
import "./language-selector";

export class Navigation extends TranslationMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: bold;
      font-size: 1rem;
      color: #333;
      text-decoration: none;
    }

    .logo-img {
      width: 32px;
      height: 32px;
      background: #ff6b00;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    @media (max-width: 1320px) {
      .container {
        padding: 0 2rem;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
    }
  `;

  render() {
    return html`
      <div class="container">
        <nav>
          <a href="/" class="logo">
            <div class="logo-img">ING</div>
            <span>ING</span>
          </a>
          <div class="actions">
            <nav-button href="/employees" icon="👥">
              ${this.t("navigation.employeeList")}
            </nav-button>
            <nav-button href="/employees/new" icon="+">
              ${this.t("navigation.addEmployee")}
            </nav-button>
            <language-selector></language-selector>
          </div>
        </nav>
      </div>
    `;
  }
}

customElements.define("app-navigation", Navigation);
