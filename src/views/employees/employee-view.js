import { LitElement, html, css } from "lit";
import { router } from "../../utils/router";
import { Router } from "@vaadin/router";
import { store } from "../../store/store";
import { employeeActions } from "../../store/employee-actions";
import { TranslationMixin } from "../../mixins/translation-mixin";
import "../shared/modal-dialog";
import "../shared/layout-view";
import "../shared/pagination-control";
import "./components/filter-controls";
import "./components/employee-card";
import "./employee-table";

export class EmployeeView extends TranslationMixin(LitElement) {
  static properties = {
    employees: { type: Array },
    viewMode: { type: String },
    currentPage: { type: Number },
    searchQuery: { type: String },
    itemsPerPage: { type: Number },
    filters: { type: Object },
    sortField: { type: String },
    sortDirection: { type: String },
    employeeToDelete: { type: Object },
    selectedEmployees: { type: Array },
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

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    th,
    td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    th {
      background: #fff;
      font-weight: 500;
      color: #ff6b00;
      text-align: center;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .edit-btn,
    .delete-btn {
      padding: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
      font-size: 1.5rem;
      color: #ff6b00;
    }

    .edit-btn:hover {
      background: #f0f0f0;
    }

    .delete-btn:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .list-view {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    @media (max-width: 1024px) {
      .table-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      table {
        min-width: 800px;
      }
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
      }

      .filter-group {
        width: 100%;
      }

      select {
        flex: 1;
      }
    }

    @media (max-width: 480px) {
      .view-toggle {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }

      .list-view {
        grid-template-columns: 1fr;
      }
    }

    /* Table styles */
    .table-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin: 0 -1rem;
      padding: 0 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      min-width: 800px; /* Minimum width for horizontal scroll */
    }

    td {
      vertical-align: middle;
    }

    /* Column specific styles */
    .col-checkbox {
      width: 40px;
    }

    .col-name {
      min-width: 120px;
    }

    .col-date {
      min-width: 110px;
    }

    .col-phone {
      min-width: 140px;
    }

    .col-email {
      min-width: 200px;
    }

    .col-department,
    .col-position {
      min-width: 100px;
    }

    .col-actions {
      width: 100px;
    }

    /* Responsive breakpoints */
    @media (max-width: 1280px) {
      .list-view {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }

      .filters {
        gap: 0.75rem;
      }

      .search-box {
        min-width: 180px;
      }

      select {
        min-width: 140px;
      }
    }

    @media (max-width: 1024px) {
      .list-view {
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      }

      .table-wrapper {
        margin: 0 -1rem;
        padding: 0 1rem;
        border-radius: 0;
      }

      table {
        border-radius: 0;
      }
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
      }

      .filters {
        flex-direction: column;
      }

      .filter-group {
        width: 100%;
        justify-content: space-between;
      }

      select {
        flex: 1;
        min-width: 0;
      }

      .list-view {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      }
    }

    @media (max-width: 560px) {
      .header {
        margin-bottom: 1.5rem;
      }

      .list-view {
        grid-template-columns: 1fr;
      }

      .employee-card {
        padding: 1rem;
      }

      .employee-details {
        grid-template-columns: 1fr;
      }

      .search-box input {
        font-size: 0.875rem;
      }

      select {
        font-size: 0.875rem;
      }
    }

    @media (max-width: 480px) {
      .header h1 {
        font-size: 1.25rem;
      }

      .employee-card-header {
        flex-wrap: wrap;
      }

      .employee-info {
        width: calc(100% - 60px);
      }

      .actions {
        width: 100%;
        justify-content: flex-end;
        margin-top: 0.5rem;
      }

      .employee-avatar {
        width: 40px;
        height: 40px;
        font-size: 1rem;
      }
    }

    /* Card View Styles */
    .list-view {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .employee-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      height: 100%; /* Ensure full height */
    }

    .employee-card:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .employee-card-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.25rem;
      border-bottom: 1px solid #eee;
      background: #fff;
      flex: 0 0 auto; /* Don't allow header to grow/shrink */
    }

    .employee-avatar {
      width: 48px;
      height: 48px;
      background: #ff6b00;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: white;
      font-weight: 500;
      flex-shrink: 0;
    }

    .employee-info {
      flex: 1;
      min-width: 0;
      overflow: hidden; /* Prevent text overflow */
    }

    .employee-name {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .employee-position {
      margin: 0.25rem 0 0;
      font-size: 0.875rem;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .employee-details {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: #fafafa;
      flex: 1;
      min-height: 0;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.875rem;
      overflow: hidden; /* Prevent text overflow */
    }

    .detail-label {
      color: #666;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .detail-value {
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      margin-left: auto;
      padding-left: 0.5rem;
    }

    .card-actions button {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: none;
      border-radius: 4px;
      cursor: pointer;
      color: #666;
      transition: all 0.2s;
    }

    .card-actions .edit-btn:hover {
      background: #f0f0f0;
      color: #ff6b00;
    }

    .card-actions .delete-btn:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    @media (max-width: 560px) {
      .employee-card {
        height: auto; /* Allow natural height on mobile */
        border-radius: 0;
        margin: 0 -1rem;
        width: calc(100% + 2rem);
      }

      .employee-details {
        grid-template-columns: 1fr;
      }

      .detail-item {
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
      }

      .detail-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
    }

    .view-toggle {
      display: flex;
      gap: 0.5rem;
      background: #f5f5f5;
      padding: 0.25rem;
      border-radius: 6px;
    }

    .view-toggle button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      background: none;
      border-radius: 4px;
      cursor: pointer;
      color: #666;
      transition: all 0.2s ease;
    }

    .view-toggle button:hover {
      background: #e0e0e0;
      color: #333;
    }

    .view-toggle button.active {
      background: white;
      color: #ff6b00;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

    th .checkbox {
      margin: 0 auto;
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.viewMode = store.getState().viewMode;
    this.currentPage = 1;
    this.searchQuery = "";
    this.itemsPerPage = 10;
    this.filters = {
      department: "",
      position: "",
    };
    this.sortField = "";
    this.sortDirection = "asc";
    this._unsubscribe = null;
    this.employeeToDelete = null;
    this.selectedEmployees = [];

    this._unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.viewMode = state.viewMode;
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = store.subscribe((state) => {
      this.employees = state.employees;
      this.requestUpdate();
    });

    const state = store.getState();
    this.employees = state.employees;

    if (this.employees.length === 0) {
      employeeActions.loadSampleData();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  get filteredEmployees() {
    return this.employees
      .filter((emp) => {
        const searchLower = this.searchQuery.toLowerCase();
        const matchesSearch =
          !this.searchQuery ||
          emp.firstName.toLowerCase().includes(searchLower) ||
          emp.lastName.toLowerCase().includes(searchLower) ||
          emp.email.toLowerCase().includes(searchLower) ||
          emp.phoneNumber.includes(searchLower);

        const matchesDepartment =
          !this.filters.department ||
          emp.department === this.filters.department;
        const matchesPosition =
          !this.filters.position || emp.position === this.filters.position;

        return matchesSearch && matchesDepartment && matchesPosition;
      })
      .sort((a, b) => {
        if (!this.sortField) return 0;

        const aValue = this.getSortValue(a, this.sortField);
        const bValue = this.getSortValue(b, this.sortField);

        const direction = this.sortDirection === "asc" ? 1 : -1;
        return aValue > bValue ? direction : -direction;
      });
  }

  getSortValue(employee, field) {
    switch (field) {
      case "name":
        return `${employee.firstName} ${employee.lastName}`.toLowerCase();
      case "dateOfEmployment":
      case "dateOfBirth":
        return new Date(employee[field]);
      default:
        return employee[field].toLowerCase();
    }
  }

  handleSort(field) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortField = field;
      this.sortDirection = "asc";
    }
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredEmployees.slice(start, end);
  }

  render() {
    return html`
      <layout-view title=${this.t("employeeList.title")}>
        <div slot="actions" class="view-toggle">
          <button
            class="${this.viewMode === "table" ? "active" : ""}"
            @click=${() => this._handleViewModeChange("table")}
            title="Table View"
          >
            <span class="icon">☰</span>
          </button>
          <button
            class="${this.viewMode === "list" ? "active" : ""}"
            @click=${() => this._handleViewModeChange("list")}
            title="List View"
          >
            <span class="icon">⊞</span>
          </button>
        </div>

        <filter-controls
          .searchQuery=${this.searchQuery}
          .filters=${this.filters}
          @filter-change=${this._handleFilterChange}
        ></filter-controls>

        ${this.viewMode === "table" ? this.renderTable() : this.renderList()}

        <pagination-control
          .currentPage=${this.currentPage}
          .totalItems=${this.filteredEmployees.length}
          .itemsPerPage=${this.itemsPerPage}
          @page-change=${this._handlePageChange}
        ></pagination-control>

        <modal-dialog
          ?open=${!!this.employeeToDelete}
          title=${this.t("employeeList.deleteConfirmation")}
          @cancel=${() => (this.employeeToDelete = null)}
          @proceed=${this._confirmDelete}
        >
          ${this.employeeToDelete
            ? this.t("employeeList.deleteConfirmationMessage", {
                name: `${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName}`,
              })
            : ""}
        </modal-dialog>
      </layout-view>
    `;
  }

  _handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  renderTable() {
    return html`
      <employee-table
        .employees=${this.paginatedEmployees}
        .selectedEmployees=${this.selectedEmployees}
        @toggle-all=${this.toggleAllEmployees}
        @toggle-employee=${(e) => this.toggleEmployee(e.detail.employeeId)}
        @edit-employee=${(e) => this.editEmployee(e.detail.employee)}
        @delete-employee=${(e) => this.deleteEmployee(e.detail.employee)}
      ></employee-table>
    `;
  }

  renderList() {
    return html`
      <div class="list-view">
        ${this.paginatedEmployees.map(
          (emp) => html`
            <employee-card
              .employee=${emp}
              .selected=${this.selectedEmployees.includes(emp.id)}
              @edit-employee=${() => this.editEmployee(emp)}
              @delete-employee=${() => this.deleteEmployee(emp)}
              @toggle-select=${() => this.toggleEmployee(emp.id)}
            ></employee-card>
          `
        )}
      </div>
    `;
  }

  async deleteEmployee(employee) {
    this.employeeToDelete = employee;
  }

  _confirmDelete() {
    if (this.employeeToDelete) {
      employeeActions.deleteEmployee(this.employeeToDelete.id);
      this.employeeToDelete = null;
    }
  }

  editEmployee(employee) {
    Router.go(`/employees/${employee.id}/edit`);
  }

  _handleFilterChange(e) {
    const { type, value } = e.detail;
    if (type === "searchQuery") {
      this.searchQuery = value;
    } else {
      this.filters = {
        ...this.filters,
        [type]: value,
      };
    }
  }

  toggleAllEmployees(e) {
    const isChecked = e.target.classList.contains("checked");
    if (isChecked) {
      this.selectedEmployees = [];
    } else {
      this.selectedEmployees = this.paginatedEmployees.map((emp) => emp.id);
    }
  }

  toggleEmployee(empId) {
    if (this.selectedEmployees.includes(empId)) {
      this.selectedEmployees = this.selectedEmployees.filter(
        (id) => id !== empId
      );
    } else {
      this.selectedEmployees = [...this.selectedEmployees, empId];
    }
  }

  _handleViewModeChange(mode) {
    employeeActions.setViewMode(mode);
  }
}

customElements.define("employee-view", EmployeeView);
