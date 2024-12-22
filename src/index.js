import { LitElement, html, css } from "lit";
import { initRouter } from "./utils/router";
import "./views/shared/navigation";
import "./views/employees/employee-view";
import "./views/employees/employee-form";

export class AppRoot extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .header {
      background: white;
      border-bottom: 1px solid #eee;
    }

    main {
      background: #f5f5f5;
      min-height: calc(100vh - 64px);
      padding: 1rem;
    }

    @media (max-width: 1320px) {
      .container {
        padding: 1rem 2rem;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
    }
  `;

  firstUpdated() {
    const outlet = this.shadowRoot.querySelector("#outlet");
    initRouter(outlet);
  }

  render() {
    return html`
      <div class="header">
        <app-navigation></app-navigation>
      </div>
      <main>
        <div id="outlet"></div>
      </main>
    `;
  }
}

customElements.define("app-root", AppRoot);
