import { LitElement, html, css } from "lit";
import { TranslationMixin } from "../../../mixins/translation-mixin";

export class EmployeeCard extends TranslationMixin(LitElement) {
  static properties = {
    employee: { type: Object },
    selected: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
    }

    .employee-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .employee-card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .employee-avatar {
      width: 48px;
      height: 48px;
      background: #ff6b00;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 1.2rem;
    }

    .employee-info {
      flex: 1;
    }

    .employee-name {
      margin: 0;
      font-size: 1.1rem;
      color: #333;
    }

    .employee-position {
      margin: 0.25rem 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
    }

    button {
      padding: 0.5rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    button:hover {
      background: #f5f5f5;
    }

    .edit-btn:hover {
      color: #ff6b00;
      border-color: #ff6b00;
    }

    .delete-btn:hover {
      color: #dc3545;
      border-color: #dc3545;
    }

    .employee-details {
      padding: 1.5rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .detail-label {
      color: #666;
      font-size: 0.9rem;
    }

    .detail-value {
      color: #333;
      font-weight: 500;
    }

    .checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .checkbox.checked {
      background: #ff6b00;
      border-color: #ff6b00;
      color: white;
    }

    .checkbox:hover {
      border-color: #ff6b00;
    }
  `;

  render() {
    const { employee } = this;
    const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

    return html`
      <div class="employee-card">
        <div class="employee-card-header">
          <div
            class="checkbox ${this.selected ? "checked" : ""}"
            @click=${this._handleSelect}
          >
            ${this.selected ? "✓" : ""}
          </div>
          <div class="employee-avatar">${initials}</div>
          <div class="employee-info">
            <h3 class="employee-name">
              ${employee.firstName} ${employee.lastName}
            </h3>
            <p class="employee-position">
              ${this.t(`positions.${employee.position.toLowerCase()}`)} •
              ${this.t(`departments.${employee.department.toLowerCase()}`)}
            </p>
          </div>
          <div class="card-actions">
            <button class="edit-btn" @click=${this._handleEdit}>✎</button>
            <button class="delete-btn" @click=${this._handleDelete}>🗑</button>
          </div>
        </div>
        <div class="employee-details">
          <div class="detail-item">
            <span class="detail-label">${this.t("employeeList.email")}</span>
            <span class="detail-value">${employee.email}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${this.t("employeeList.phone")}</span>
            <span class="detail-value">${employee.phoneNumber}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">
              ${this.t("employeeList.dateOfEmployment")}
            </span>
            <span class="detail-value">${employee.dateOfEmployment}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">
              ${this.t("employeeList.dateOfBirth")}
            </span>
            <span class="detail-value">${employee.dateOfBirth}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"
              >${this.t("employeeList.department")}</span
            >
            <span class="detail-value">
              ${this.t(`departments.${employee.department.toLowerCase()}`)}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${this.t("employeeList.position")}</span>
            <span class="detail-value">
              ${this.t(`positions.${employee.position.toLowerCase()}`)}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  _handleEdit() {
    this.dispatchEvent(
      new CustomEvent("edit-employee", {
        detail: { employee: this.employee },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleDelete() {
    this.dispatchEvent(
      new CustomEvent("delete-employee", {
        detail: { employee: this.employee },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleSelect() {
    this.dispatchEvent(
      new CustomEvent("toggle-select", {
        detail: { employeeId: this.employee.id },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("employee-card", EmployeeCard);
