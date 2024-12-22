import { LitElement, html, css } from "lit";
import { TranslationMixin } from "../../../mixins/translation-mixin";

export class EmployeeTableRow extends TranslationMixin(LitElement) {
  static properties = {
    employee: { type: Object },
    selected: { type: Boolean },
  };

  static styles = css`
    :host {
      display: table-row;
      border-bottom: 1px solid #eee;
    }

    td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .checkbox {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: #ff6b00;
    }

    .actions {
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

    .col-checkbox {
      width: 40px;
    }
    .col-name {
      width: 150px;
    }
    .col-date {
      width: 120px;
    }
    .col-phone {
      width: 120px;
    }
    .col-email {
      width: 200px;
    }
    .col-department {
      width: 120px;
    }
    .col-position {
      width: 120px;
    }
    .col-actions {
      width: 100px;
    }
  `;

  render() {
    return html`
      <td class="col-checkbox">
        <div class="checkbox">
          <input
            type="checkbox"
            .checked=${this.selected}
            @change=${(e) => this._handleToggle(e)}
          />
        </div>
      </td>
      <td class="col-name">${this.employee.firstName}</td>
      <td class="col-name">${this.employee.lastName}</td>
      <td class="col-date">${this.employee.dateOfEmployment}</td>
      <td class="col-date">${this.employee.dateOfBirth}</td>
      <td class="col-phone">${this.employee.phoneNumber}</td>
      <td class="col-email">${this.employee.email}</td>
      <td class="col-department">${this.employee.department}</td>
      <td class="col-position">${this.employee.position}</td>
      <td class="col-actions">
        <div class="actions">
          <button class="edit-btn" @click=${() => this._handleEdit()}>✎</button>
          <button class="delete-btn" @click=${() => this._handleDelete()}>
            🗑
          </button>
        </div>
      </td>
    `;
  }

  _handleToggle(e) {
    this.dispatchEvent(
      new CustomEvent("toggle-select", {
        detail: {
          employeeId: this.employee.id,
          checked: e.target.checked,
        },
        bubbles: true,
        composed: true,
      })
    );
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
}

customElements.define("employee-table-row", EmployeeTableRow);
