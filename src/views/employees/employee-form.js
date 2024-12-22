import "../shared/layout-view";
import { LitElement, html, css } from "lit";
import { router } from "../../utils/router";
import { Router } from "@vaadin/router";
import { store } from "../../store/store";
import IMask from "imask";
import { employeeActions } from "../../store/employee-actions";
import { TranslationMixin } from "../../mixins/translation-mixin";
import "../shared/modal-dialog";

const PHONE_MASK_OPTIONS = {
  mask: "+{9\\0} 000 000 00 00",
  lazy: false,
};

export class EmployeeForm extends TranslationMixin(LitElement) {
  static properties = {
    employee: { type: Object },
    isEdit: { type: Boolean },
    errors: { type: Object },
    employeeId: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    form {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #666;
    }

    input,
    select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      color: #333;
      background: white;
      box-sizing: border-box;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: #ff6b00;
      box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.1);
    }

    .error-message {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #eee;
    }

    button {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    button[type="submit"] {
      background: #ff6b00;
      color: white;
      border: none;
    }

    button[type="submit"]:hover {
      background: #e65c00;
    }

    button[type="button"] {
      background: white;
      color: #666;
      border: 1px solid #ddd;
    }

    button[type="button"]:hover {
      background: #f5f5f5;
    }

    @media (max-width: 768px) {
      form {
        padding: 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      form {
        padding: 1rem;
      }

      .actions {
        flex-direction: column-reverse;
      }

      button {
        width: 100%;
      }
    }
  `;

  constructor() {
    super();
    this.employee = {
      firstName: "",
      lastName: "",
      dateOfEmployment: "",
      dateOfBirth: "",
      phoneNumber: "",
      email: "",
      department: "",
      position: "",
    };
    this.isEdit = false;
    this.errors = {};
    this.employeeId = null;
  }

  maskInput() {
    const phoneInput = this.shadowRoot.getElementById("phoneNumber");
    if (phoneInput) {
      IMask(phoneInput, PHONE_MASK_OPTIONS);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    const path = window.location.pathname;
    const id = path.split("/")[2];

    if (id && id !== "new") {
      this.employeeId = id;
      this.isEdit = true;

      if (!this.employee?.id) {
        const state = store.getState();
        const employeeData = state.employees.find((emp) => emp.id === id);
        if (employeeData) {
          this.employee = { ...employeeData };
        }
      }
    }
    this.maskInput();
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has("employee")) {
      this.maskInput();

      if (this.isEdit && this.employee?.id === this.employeeId) {
        Object.keys(this.employee).forEach((field) => {
          const input = this.shadowRoot?.querySelector(`#${field}`);
          if (input) {
            input.value = this.employee[field];
          }
        });
      }
    }
  }

  validateField(fieldName, value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-zçığöşüÇİĞÖŞÜ\s'-]+$/;

    switch (fieldName) {
      case "firstName":
      case "lastName":
        if (!value.trim()) return "required";
        if (!nameRegex.test(value.trim())) return "invalidName";
        return "";

      case "email":
        if (!value.trim()) return "required";
        if (!emailRegex.test(value)) return "invalid";
        return "";

      case "phoneNumber":
        if (!value.trim()) return "required";
        try {
          const unmaskedValue = IMask.pipe(value, PHONE_MASK_OPTIONS);
          if (unmaskedValue.replace(/\D/g, "").length !== 12) {
            return "invalid";
          }
        } catch (error) {
          return "invalid";
        }
        return "";

      case "dateOfBirth":
        if (!value) return "required";
        const birthDate = new Date(value);
        const minAge = new Date();
        minAge.setFullYear(minAge.getFullYear() - 18);
        if (birthDate > minAge) return "underage";
        return "";

      case "dateOfEmployment":
        if (!value) return "required";
        const employmentDate = new Date(value);
        const today = new Date();
        if (employmentDate > today) return "future";
        return "";

      case "department":
      case "position":
        return value ? "" : "required";

      default:
        return "";
    }
  }

  handleInput(e) {
    const { id, value } = e.target;
    let newValue = value;

    this.employee = {
      ...this.employee,
      [id]: newValue,
    };

    const error = this.validateField(id, newValue);
    if (error) {
      this.errors = {
        ...this.errors,
        [id]: error,
      };
    } else {
      const { [id]: removed, ...rest } = this.errors;
      this.errors = rest;
    }
  }

  validateForm() {
    const errors = {};
    const fields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "dateOfBirth",
      "dateOfEmployment",
      "department",
      "position",
    ];

    fields.forEach((field) => {
      const error = this.validateField(field, this.employee[field]);
      if (error) {
        errors[field] = error;
      }
    });

    // Check for duplicate email and phone number
    const state = store.getState();
    const existingEmployees = state.employees;

    // Check for duplicate email
    const emailExists = existingEmployees.some(
      (emp) =>
        emp.email === this.employee.email &&
        (!this.isEdit || emp.id !== this.employee.id)
    );

    // Check for duplicate phone number (compare without spaces and special characters)
    const normalizedPhone = this.employee.phoneNumber.replace(/\D/g, "");
    const phoneExists = existingEmployees.some(
      (emp) =>
        emp.phoneNumber.replace(/\D/g, "") === normalizedPhone &&
        (!this.isEdit || emp.id !== this.employee.id)
    );

    if (emailExists) {
      errors.email = "exists";
    }

    if (phoneExists) {
      errors.phoneNumber = "exists";
    }

    return errors;
  }

  getErrorMessage(fieldName, errorType) {
    switch (errorType) {
      case "required":
        return this.t("validation.required", {
          field: this.t(`employeeForm.${fieldName}`),
        });
      case "invalid":
        switch (fieldName) {
          case "email":
            return this.t("validation.invalidEmail");
          case "phoneNumber":
            return this.t("validation.invalidPhone");
          default:
            return this.t("validation.invalid");
        }
      case "underage":
        return this.t("validation.underage");
      case "future":
        return this.t("validation.futureDate");
      case "exists":
        switch (fieldName) {
          case "email":
            return this.t("validation.emailExists");
          case "phoneNumber":
            return this.t("validation.phoneExists");
          default:
            return this.t("validation.exists");
        }
      case "invalidName":
        return this.t("validation.invalidName");
      default:
        return "";
    }
  }

  renderField(fieldName, type = "text", options = null) {
    const error = this.errors[fieldName];
    const hasError = !!error;

    if (options) {
      return html`
        <div class="form-group">
          <label for="${fieldName}"
            >${this.t(`employeeForm.${fieldName}`)}</label
          >
          <select
            id="${fieldName}"
            @change=${this.handleInput}
            class="${hasError ? "error" : ""}"
          >
            <option value="">
              ${this.t(
                `employeeForm.select${
                  fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
                }`
              )}
            </option>
            ${options.map(
              (opt) => html`
                <option
                  value="${opt}"
                  ?selected=${this.employee[fieldName] === opt}
                >
                  ${this.t(`${fieldName}s.${opt.toLowerCase()}`)}
                </option>
              `
            )}
          </select>
          ${hasError
            ? html`<div class="error-message">
                ${this.getErrorMessage(fieldName, error)}
              </div>`
            : ""}
        </div>
      `;
    }

    return html`
      <div class="form-group">
        <label for="${fieldName}">${this.t(`employeeForm.${fieldName}`)}</label>
        <input
          type="${type}"
          id="${fieldName}"
          .value=${this.employee[fieldName]}
          @input=${this.handleInput}
          class="${hasError ? "error" : ""}"
        />
        ${hasError
          ? html`<div class="error-message">
              ${this.getErrorMessage(fieldName, error)}
            </div>`
          : ""}
      </div>
    `;
  }

  handleCancel() {
    Router.go("/employees");
  }

  render() {
    return html`
      <layout-view
        title=${this.isEdit
          ? this.t("employeeForm.editEmployee")
          : this.t("employeeForm.addEmployee")}
      >
        <form @submit=${this.handleSubmit}>
          <div class="form-grid">
            ${this.renderField("firstName")} ${this.renderField("lastName")}
            ${this.renderField("dateOfEmployment", "date")}
            ${this.renderField("dateOfBirth", "date")}
            ${this.renderField("phoneNumber", "tel")}
            ${this.renderField("email", "email")}
            ${this.renderField("department", "select", ["Analytics", "Tech"])}
            ${this.renderField("position", "select", [
              "Junior",
              "Medior",
              "Senior",
            ])}
          </div>

          <div class="actions">
            <button type="button" @click=${this.handleCancel}>
              ${this.t("employeeForm.cancel")}
            </button>
            <button type="submit">
              ${this.isEdit
                ? this.t("employeeForm.update")
                : this.t("employeeForm.create")}
            </button>
          </div>
        </form>
      </layout-view>
    `;
  }

  async handleSubmit(e) {
    e.preventDefault();
    const errors = this.validateForm();

    if (Object.keys(errors).length > 0) {
      this.errors = errors;
      return;
    }

    const modalDialog = document.createElement("modal-dialog");
    modalDialog.title = this.isEdit
      ? this.t("employeeForm.editEmployee")
      : this.t("employeeForm.addEmployee");

    const content = document.createElement("p");
    content.textContent = this.isEdit
      ? this.t("employeeForm.confirmUpdate")
      : this.t("employeeForm.confirmCreate");
    modalDialog.appendChild(content);

    modalDialog.addEventListener("proceed", async () => {
      try {
        if (this.isEdit) {
          await employeeActions.updateEmployee(this.employee);
        } else {
          await employeeActions.addEmployee(this.employee);
        }
        await this.updateComplete;
        try {
          await router.go("/employees");
        } catch (error) {
          console.warn(
            "Router navigation failed, falling back to window.location",
            error
          );
          window.location.href = "/employees";
        }
      } catch (error) {
        console.error("Error saving employee:", error);
      }
    });

    document.body.appendChild(modalDialog);
    modalDialog.open = true;

    modalDialog.addEventListener("cancel", () => {
      document.body.removeChild(modalDialog);
    });

    modalDialog.addEventListener("proceed", () => {
      document.body.removeChild(modalDialog);
    });
  }
}

customElements.define("employee-form", EmployeeForm);
