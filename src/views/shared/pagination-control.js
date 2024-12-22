import { LitElement, html, css } from "lit";

export class PaginationControl extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalItems: { type: Number },
    itemsPerPage: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      color: #666;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    button:hover:not(:disabled) {
      background: #f5f5f5;
      border-color: #ccc;
    }

    button.active {
      background: #ff6b00;
      color: white;
      border-color: #ff6b00;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  render() {
    return html`
      <div class="pagination">
        <button
          ?disabled=${this.currentPage === 1}
          @click=${() => this._emitPageChange(this.currentPage - 1)}
        >
          ←
        </button>
        ${this._renderPageNumbers()}
        <button
          ?disabled=${this.currentPage === this.totalPages}
          @click=${() => this._emitPageChange(this.currentPage + 1)}
        >
          →
        </button>
      </div>
    `;
  }

  _renderPageNumbers() {
    const pages = [];
    const totalPages = this.totalPages;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= this.currentPage - 2 && i <= this.currentPage + 2)
      ) {
        pages.push(html`
          <button
            class="${i === this.currentPage ? "active" : ""}"
            @click=${() => this._emitPageChange(i)}
          >
            ${i}
          </button>
        `);
      } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
        pages.push(html`...`);
      }
    }

    return pages;
  }

  _emitPageChange(page) {
    this.dispatchEvent(
      new CustomEvent("page-change", {
        detail: { page },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("pagination-control", PaginationControl);
