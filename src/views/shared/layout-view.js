import { LitElement, html, css } from "lit";

export class LayoutView extends LitElement {
  static properties = {
    title: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 1.5rem;
      color: #ff6b00;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }
  `;

  render() {
    return html`
      <div class="header">
        <h1>${this.title}</h1>
        <div class="header-actions">
          <slot name="actions"></slot>
        </div>
      </div>
      <slot></slot>
    `;
  }
}

customElements.define("layout-view", LayoutView);
