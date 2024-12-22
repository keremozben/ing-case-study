import { LitElement, html, css } from "lit";
import { TranslationMixin } from "../../mixins/translation-mixin";
import "./components/employee-table-row";

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
      border-bottom: 1px solid #eee;
    }

    th {
      font-weight: 500;
      color: #ff6b00;
      white-space: nowrap;
      text-align: center;
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
  `;

  render() {
    const allSelected =
      this.employees.length > 0 &&
      this.selectedEmployees.length === this.employees.length;

    return html`
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-checkbox">
                <div class="checkbox">
                  <input
                    type="checkbox"
                    .checked=${allSelected}
                    .indeterminate=${this.selectedEmployees.length > 0 &&
                    !allSelected}
                    @change=${this._handleToggleAll}
                  />
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
                  <employee-table-row
                    .employee=${emp}
                    .selected=${this.selectedEmployees.includes(emp.id)}
                    @toggle-select=${(e) =>
                      this._handleToggleEmployee(e.detail)}
                    @edit-employee=${(e) => this._handleEdit(e.detail.employee)}
                    @delete-employee=${(e) =>
                      this._handleDelete(e.detail.employee)}
                  ></employee-table-row>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  _handleToggleAll(e) {
    // Dispatch the toggle-all event with the checked status
    this.dispatchEvent(
      new CustomEvent("toggle-all", {
        detail: { checked: e.target.checked },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleToggleEmployee(event) {
    this.dispatchEvent(
      new CustomEvent("toggle-employee", {
        detail: {
          employeeId: event.employeeId,
          checked: event.checked,
        },
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
