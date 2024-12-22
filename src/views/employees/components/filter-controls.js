import { LitElement, html, css } from "lit";
import { TranslationMixin } from "../../../mixins/translation-mixin";

export class FilterControls extends TranslationMixin(LitElement) {
  static properties = {
    searchQuery: { type: String },
    filters: { type: Object },
  };

  static styles = css`
    :host {
      display: block;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 200px;
      position: relative;
    }

    .search-box input {
      width: 100%;
      padding: 0.75rem;
      padding-left: 2.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }

    .filter-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      min-width: 150px;
    }
  `;

  render() {
    return html`
      <div class="filters">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="search"
            .value=${this.searchQuery}
            @input=${this._handleSearchInput}
            placeholder=${this.t("employeeList.search")}
          />
        </div>
        <div class="filter-group">
          <select
            data-filter="department"
            .value=${this.filters.department}
            @change=${this._handleDepartmentChange}
          >
            <option value="">${this.t("employeeList.allDepartments")}</option>
            <option value="Analytics">
              ${this.t("departments.analytics")}
            </option>
            <option value="Tech">${this.t("departments.tech")}</option>
          </select>
          <select
            data-filter="position"
            .value=${this.filters.position}
            @change=${this._handlePositionChange}
          >
            <option value="">${this.t("employeeList.allPositions")}</option>
            <option value="Junior">${this.t("positions.junior")}</option>
            <option value="Medior">${this.t("positions.medior")}</option>
            <option value="Senior">${this.t("positions.senior")}</option>
          </select>
        </div>
      </div>
    `;
  }

  _handleSearchInput(e) {
    this._emitFilterChange("searchQuery", e.target.value);
  }

  _handleDepartmentChange(e) {
    this._emitFilterChange("department", e.target.value);
  }

  _handlePositionChange(e) {
    this._emitFilterChange("position", e.target.value);
  }

  _emitFilterChange(type, value) {
    this.dispatchEvent(
      new CustomEvent("filter-change", {
        detail: { type, value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("filter-controls", FilterControls);
