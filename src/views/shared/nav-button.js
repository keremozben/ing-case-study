import { LitElement, html, css } from "lit";

export class NavButton extends LitElement {
  static properties = {
    href: { type: String },
    icon: { type: String },
    primary: { type: Boolean },
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      color: var(--nav-button-color, #ff6b00);
      background: var(--nav-button-bg, transparent);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      white-space: nowrap;
      transition: all 0.2s;
    }

    a:hover {
      background: var(--nav-button-hover-bg, #ff6b00);
      color: var(--nav-button-hover-color, #fff);
    }

    :host([primary]) a {
      --nav-button-color: white;
      --nav-button-bg: #ff6b00;
      --nav-button-hover-bg: #e65c00;
    }

    .icon {
      font-size: 1.2rem;
    }

    @media (max-width: 480px) {
      .text {
        display: none;
      }

      a {
        padding: 0.5rem;
      }
    }
  `;

  render() {
    return html`
      <a href=${this.href}>
        <span class="icon">${this.icon}</span>
        <span class="text">
          <slot></slot>
        </span>
      </a>
    `;
  }
}

customElements.define("nav-button", NavButton);
