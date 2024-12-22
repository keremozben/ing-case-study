import { fixture, html, expect } from "@open-wc/testing";
import { dispatchLanguageChange } from "../setup";
import "../../src/views/employees/components/employee-card";

describe("EmployeeCard", () => {
  let element;
  const mockEmployee = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    department: "Tech",
    position: "Senior",
    phoneNumber: "1234567890",
    dateOfBirth: "1990-01-01",
    dateOfEmployment: "2020-01-01",
  };

  beforeEach(async () => {
    element = await fixture(html`
      <employee-card
        .employee=${mockEmployee}
        .selected=${false}
      ></employee-card>
    `);
  });

  it("renders employee basic info correctly", () => {
    const header = element.shadowRoot.querySelector(".employee-card-header");
    const name = header.querySelector(".employee-name");
    const position = header.querySelector(".employee-position");

    expect(name.textContent.trim()).to.equal("John Doe");
    expect(position.textContent).to.include("Senior");
    expect(position.textContent).to.include("Tech");
  });

  it("renders employee avatar with initials", () => {
    const avatar = element.shadowRoot.querySelector(".employee-avatar");
    expect(avatar.textContent.trim()).to.equal("JD");
  });

  it("renders employee details correctly", () => {
    const details = element.shadowRoot.querySelectorAll(".detail-item");
    const emailDetail = Array.from(details).find((detail) =>
      detail.querySelector(".detail-label").textContent.includes("Email")
    );
    const phoneDetail = Array.from(details).find((detail) =>
      detail.querySelector(".detail-label").textContent.includes("Phone")
    );

    expect(emailDetail.querySelector(".detail-value").textContent).to.equal(
      "john@example.com"
    );
    expect(phoneDetail.querySelector(".detail-value").textContent).to.equal(
      "1234567890"
    );
  });

  it("handles checkbox state changes", async () => {
    let eventFired = false;
    element.addEventListener("toggle-select", (e) => {
      eventFired = true;
      expect(e.detail.employeeId).to.equal("1");
    });

    const checkbox = element.shadowRoot.querySelector(".checkbox");
    checkbox.click();

    expect(eventFired).to.be.true;
  });

  it("handles edit button click", async () => {
    let eventFired = false;
    element.addEventListener("edit-employee", (e) => {
      eventFired = true;
      expect(e.detail.employee).to.equal(mockEmployee);
    });

    const editButton = element.shadowRoot.querySelector(".edit-btn");
    editButton.click();

    expect(eventFired).to.be.true;
  });

  it("handles delete button click", async () => {
    let eventFired = false;
    element.addEventListener("delete-employee", (e) => {
      eventFired = true;
      expect(e.detail.employee).to.equal(mockEmployee);
    });

    const deleteButton = element.shadowRoot.querySelector(".delete-btn");
    deleteButton.click();

    expect(eventFired).to.be.true;
  });

  it("updates selected state visually", async () => {
    element.selected = true;
    await element.updateComplete;

    const checkbox = element.shadowRoot.querySelector(".checkbox");
    expect(checkbox.classList.contains("checked")).to.be.true;
  });

  it("translates labels and content", async () => {
    document.documentElement.lang = "tr";
    dispatchLanguageChange();
    await element.updateComplete;

    const details = element.shadowRoot.querySelectorAll(".detail-item");
    const departmentLabel = Array.from(details).find((detail) =>
      detail
        .querySelector(".detail-label")
        .textContent.trim()
        .includes(element.t("employeeList.department"))
    );

    expect(departmentLabel).to.exist;
    const departmentValue = departmentLabel
      .querySelector(".detail-value")
      .textContent.trim();
    expect(departmentValue).to.equal(element.t("departments.tech"));
  });

  it("formats dates according to locale", async () => {
    document.documentElement.lang = "tr";
    dispatchLanguageChange();
    await element.updateComplete;

    const details = element.shadowRoot.querySelectorAll(".detail-item");
    const employmentDate = Array.from(details).find((detail) =>
      detail
        .querySelector(".detail-label")
        .textContent.includes(element.t("employeeList.dateOfEmployment"))
    );

    expect(employmentDate.querySelector(".detail-value").textContent).to.equal(
      "2020-01-01"
    );
  });

  it("verifies button presence and accessibility", async () => {
    const editButton = element.shadowRoot.querySelector(".edit-btn");
    const deleteButton = element.shadowRoot.querySelector(".delete-btn");

    expect(editButton).to.exist;
    expect(deleteButton).to.exist;
    expect(editButton.getAttribute("class")).to.include("edit-btn");
    expect(deleteButton.getAttribute("class")).to.include("delete-btn");
  });

  it("applies responsive styles on mobile view", async () => {
    element = await fixture(html`
      <employee-card
        .employee=${mockEmployee}
        .selected=${false}
      ></employee-card>
    `);

    const card = element.shadowRoot.querySelector(".employee-card");
    const header = element.shadowRoot.querySelector(".employee-card-header");
    const details = element.shadowRoot.querySelector(".employee-details");

    expect(card).to.exist;
    expect(header).to.exist;
    expect(details).to.exist;
  });

  it("verifies all detail items are present", () => {
    const details = element.shadowRoot.querySelectorAll(".detail-item");
    const labels = Array.from(details).map((detail) =>
      detail.querySelector(".detail-label").textContent.trim()
    );

    expect(labels).to.include(element.t("employeeList.email"));
    expect(labels).to.include(element.t("employeeList.phone"));
    expect(labels).to.include(element.t("employeeList.dateOfEmployment"));
    expect(labels).to.include(element.t("employeeList.dateOfBirth"));
    expect(labels).to.include(element.t("employeeList.department"));
    expect(labels).to.include(element.t("employeeList.position"));
  });

  it("updates when employee data changes", async () => {
    const updatedEmployee = {
      ...mockEmployee,
      firstName: "Jane",
      lastName: "Smith",
      position: "Junior",
    };

    element.employee = updatedEmployee;
    await element.updateComplete;

    const name = element.shadowRoot.querySelector(".employee-name");
    const position = element.shadowRoot.querySelector(".employee-position");
    const avatar = element.shadowRoot.querySelector(".employee-avatar");

    expect(name.textContent.trim()).to.equal("Jane Smith");
    expect(position.textContent).to.include("Junior");
    expect(avatar.textContent.trim()).to.equal("JS");
  });
});
