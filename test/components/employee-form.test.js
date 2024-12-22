import { fixture, html, expect } from "@open-wc/testing";
import "../../src/views/employees/employee-form";
import { store } from "../../src/store/store";

describe("EmployeeForm", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <employee-form
        .employee=${{
          firstName: "",
          lastName: "",
          dateOfEmployment: "",
          dateOfBirth: "",
          phoneNumber: "",
          email: "",
          department: "",
          position: "",
        }}
        .isEdit=${false}
        .errors=${{}}
      ></employee-form>
    `);
  });

  it("validates required fields", async () => {
    const form = element.shadowRoot.querySelector("form");
    form.dispatchEvent(new SubmitEvent("submit", { cancelable: true }));
    await element.updateComplete;

    const errors = Object.keys(element.errors);
    expect(errors).to.include.members([
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "dateOfBirth",
      "dateOfEmployment",
      "department",
      "position",
    ]);
  });

  it("validates email format", async () => {
    const emailInput = element.shadowRoot.querySelector("#email");
    emailInput.value = "invalid-email";
    emailInput.dispatchEvent(new Event("input"));
    await element.updateComplete;

    expect(element.errors.email).to.equal("invalid");
  });

  it("validates phone number format", async () => {
    const phoneInput = element.shadowRoot.querySelector("#phoneNumber");
    phoneInput.value = "123";
    phoneInput.dispatchEvent(new Event("input"));
    await element.updateComplete;

    expect(element.errors.phoneNumber).to.equal("invalid");
  });

  it("validates name format", async () => {
    const firstNameInput = element.shadowRoot.querySelector("#firstName");
    firstNameInput.value = "John123";
    firstNameInput.dispatchEvent(new Event("input"));
    await element.updateComplete;

    expect(element.errors.firstName).to.equal("invalidName");
  });

  it("validates date of birth (underage)", async () => {
    const dobInput = element.shadowRoot.querySelector("#dateOfBirth");
    const today = new Date();
    const underageDate = new Date(today.setFullYear(today.getFullYear() - 17));
    dobInput.value = underageDate.toISOString().split("T")[0];
    dobInput.dispatchEvent(new Event("input"));
    await element.updateComplete;

    expect(element.errors.dateOfBirth).to.equal("underage");
  });

  it("validates date of employment (future date)", async () => {
    const doeInput = element.shadowRoot.querySelector("#dateOfEmployment");
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    doeInput.value = futureDate.toISOString().split("T")[0];
    doeInput.dispatchEvent(new Event("input"));
    await element.updateComplete;

    expect(element.errors.dateOfEmployment).to.equal("future");
  });

  it("prevents duplicate email", async () => {
    store.setState({
      employees: [
        {
          id: "1",
          email: "test@example.com",
          phoneNumber: "+90 555 555 55 55",
        },
      ],
    });

    element.employee = {
      ...element.employee,
      email: "test@example.com",
    };

    const errors = element.validateForm();
    expect(errors.email).to.equal("exists");
  });

  it("prevents duplicate phone number", async () => {
    store.setState({
      employees: [
        {
          id: "1",
          email: "other@example.com",
          phoneNumber: "+90 555 555 55 55",
        },
      ],
    });

    element.employee = {
      ...element.employee,
      phoneNumber: "+90 555 555 55 55",
    };

    const errors = element.validateForm();
    expect(errors.phoneNumber).to.equal("exists");
  });

  it("loads existing employee data in edit mode", async () => {
    const testEmployee = {
      id: "test-id",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phoneNumber: "+90 555 555 55 55",
      dateOfBirth: "1990-01-01",
      dateOfEmployment: "2020-01-01",
      department: "Tech",
      position: "Senior",
    };

    store.setState({
      employees: [testEmployee],
    });

    element = await fixture(html`<employee-form></employee-form>`);
    element.isEdit = true;
    element.employee = testEmployee;
    await element.updateComplete;

    expect(element.isEdit).to.be.true;
    expect(element.employee).to.deep.equal(testEmployee);
  });
});
