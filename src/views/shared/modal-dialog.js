import { LitElement, html, css } from "lit";

export class ModalDialog extends LitElement {
  static properties = {
    open: { type: Boolean },
    title: { type: String },
  };

  static styles = css`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 12px;
      padding: 1.25rem;
      width: 460px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: modalIn 0.2s ease-out;
    }

    @keyframes modalIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .modal-title {
      font-size: 1.125rem;
      color: #ff6b00;
      margin: 0;
      font-weight: 500;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #757575;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      transition: all 0.2s;
    }

    .close-button:hover {
      background: #f5f5f5;
    }

    .close-button:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.2);
    }

    .modal-content {
      margin-bottom: 1.5rem;
      color: #424242;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    button {
      padding: 0.625rem 1.25rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    button:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.2);
    }

    .proceed {
      background: #ff6b00;
      color: white;
      border: none;
    }

    .proceed:hover {
      background: #e65c00;
    }

    .cancel {
      background: white;
      color: #616161;
      border: 1px solid #e0e0e0;
    }

    .cancel:hover {
      background: #f5f5f5;
      border-color: #bdbdbd;
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.title = "";
    this._focusableElements = [];
    this._firstFocusable = null;
    this._lastFocusable = null;
    this._previousActiveElement = null;
  }

  firstUpdated() {
    this.addEventListener("keydown", this._handleKeyDown.bind(this));
  }

  updated(changedProperties) {
    if (changedProperties.has("open") && this.open) {
      this._previousActiveElement = document.activeElement;
      this.updateComplete.then(() => {
        this._setupFocusTrap();
        this._firstFocusable?.focus();
      });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._previousActiveElement?.focus();
  }

  _setupFocusTrap() {
    const modal = this.shadowRoot.querySelector(".modal");
    this._focusableElements = Array.from(
      modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
    this._firstFocusable = this._focusableElements[0];
    this._lastFocusable =
      this._focusableElements[this._focusableElements.length - 1];
  }

  _handleKeyDown(e) {
    if (!this.open) return;

    if (e.key === "Escape") {
      this._handleCancel();
      return;
    }

    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === this._firstFocusable) {
          e.preventDefault();
          this._lastFocusable.focus();
        }
      } else {
        if (document.activeElement === this._lastFocusable) {
          e.preventDefault();
          this._firstFocusable.focus();
        }
      }
    }
  }

  render() {
    if (!this.open) return null;

    return html`
      <div class="modal-backdrop" @click=${this._handleBackdropClick}>
        <div class="modal" @click=${this._stopPropagation}>
          <div class="modal-header">
            <h2 class="modal-title">${this.title}</h2>
            <button
              class="close-button"
              @click=${this._handleCancel}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div class="modal-content">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button
              class="cancel"
              @click=${this._handleCancel}
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              class="proceed"
              @click=${this._handleProceed}
              aria-label="Proceed"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _handleBackdropClick(e) {
    this._handleCancel();
  }

  _stopPropagation(e) {
    e.stopPropagation();
  }

  _handleCancel() {
    this.dispatchEvent(new CustomEvent("cancel"));
    this.open = false;
  }

  _handleProceed() {
    this.dispatchEvent(new CustomEvent("proceed"));
    this.open = false;
  }
}

customElements.define("modal-dialog", ModalDialog);
