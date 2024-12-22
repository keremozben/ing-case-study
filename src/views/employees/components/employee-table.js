import { LitElement, html, css } from "lit";
import { TranslationMixin } from "../../../mixins/translation-mixin";

export class EmployeeTable extends TranslationMixin(LitElement) {
  static properties = {
    employees: { type: Array },
    selectedEmployees: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
    }

    .table-wrapper {
      overflow-x: auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    th,
    td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      font-weight: 500;
      color: #666;
      white-space: nowrap;
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
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-checkbox">
                <div
                  class="checkbox ${this.employees.length > 0 &&
                  this.selectedEmployees.length === this.employees.length
                    ? "checked"
                    : ""}"
                  @click=${this._handleToggleAll}
                >
                  ${this.employees.length > 0 &&
                  this.selectedEmployees.length === this.employees.length
                    ? "✓"
                    : ""}
                </div>
              </th>
              <th class="col-name">${this.t("employeeList.firstName")}</th>
              <th class="col-name">${this.t("employeeList.lastName")}</th>
              <th class="col-date">
                ${this.t("employeeList.dateOfEmployment")}
              </th>
              <th class="col-date">${this.t("employeeList.dateOfBirth")}</th>
              <th class="col-phone">${this.t("employeeList.phone")}</th>
              <th class="col-email">${this.t("employeeList.email")}</th>
              <th class="col-department">
                ${this.t("employeeList.department")}
              </th>
              <th class="col-position">${this.t("employeeList.position")}</th>
              <th class="col-actions">${this.t("employeeList.actions")}</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.map(
              (emp) => html`
                <tr>
                  <td class="col-checkbox">
                    <div
                      class="checkbox ${this.selectedEmployees.includes(emp.id)
                        ? "checked"
                        : ""}"
                      @click=${() => this._handleToggleEmployee(emp.id)}
                    >
                      ${this.selectedEmployees.includes(emp.id) ? "✓" : ""}
                    </div>
                  </td>
                  <td class="col-name">${emp.firstName}</td>
                  <td class="col-name">${emp.lastName}</td>
                  <td class="col-date">${emp.dateOfEmployment}</td>
                  <td class="col-date">${emp.dateOfBirth}</td>
                  <td class="col-phone">${emp.phoneNumber}</td>
                  <td class="col-email">${emp.email}</td>
                  <td class="col-department">
                    ${this.t(`departments.${emp.department.toLowerCase()}`)}
                  </td>
                  <td class="col-position">
                    ${this.t(`positions.${emp.position.toLowerCase()}`)}
                  </td>
                  <td class="col-actions">
                    <div class="actions">
                      <button
                        class="edit-btn"
                        @click=${() => this._handleEdit(emp)}
                      >
                        ✎
                      </button>
                      <button
                        class="delete-btn"
                        @click=${() => this._handleDelete(emp)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  _handleToggleAll() {
    this.dispatchEvent(
      new CustomEvent("toggle-all", {
        detail: {
          isChecked:
            this.employees.length > 0 &&
            this.selectedEmployees.length === this.employees.length,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleToggleEmployee(employeeId) {
    this.dispatchEvent(
      new CustomEvent("toggle-employee", {
        detail: { employeeId },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleEdit(employee) {
    this.dispatchEvent(
      new CustomEvent("edit-employee", {
        detail: { employee },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleDelete(employee) {
    this.dispatchEvent(
      new CustomEvent("delete-employee", {
        detail: { employee },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("employee-table", EmployeeTable);
