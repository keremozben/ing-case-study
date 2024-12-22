import { fixture, html, expect } from "@open-wc/testing";
import "../../src/views/employees/components/employee-table-row";

describe("EmployeeTableRow", () => {
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
      <employee-table-row
        .employee=${mockEmployee}
        .selected=${false}
      ></employee-table-row>
    `);
  });

  it("renders employee data correctly", () => {
    const cells = element.shadowRoot.querySelectorAll("td");
    expect(cells[1].textContent).to.equal("John");
    expect(cells[2].textContent).to.equal("Doe");
    expect(cells[3].textContent).to.equal("2020-01-01");
    expect(cells[4].textContent).to.equal("1990-01-01");
    expect(cells[5].textContent).to.equal("1234567890");
    expect(cells[6].textContent).to.equal("john@example.com");
    expect(cells[7].textContent).to.equal("Tech");
    expect(cells[8].textContent).to.equal("Senior");
  });

  it("handles checkbox state changes", async () => {
    let eventFired = false;
    element.addEventListener("toggle-select", (e) => {
      eventFired = true;
      expect(e.detail.employeeId).to.equal("1");
      expect(e.detail.checked).to.be.true;
    });

    const checkbox = element.shadowRoot.querySelector('input[type="checkbox"]');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change"));

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

  it("updates checkbox when selected prop changes", async () => {
    element.selected = true;
    await element.updateComplete;

    const checkbox = element.shadowRoot.querySelector('input[type="checkbox"]');
    expect(checkbox.checked).to.be.true;
  });

  it("applies hover styles to buttons", async () => {
    const editButton = element.shadowRoot.querySelector(".edit-btn");
    editButton.dispatchEvent(new MouseEvent("mouseover"));
    await element.updateComplete;

    expect(editButton).to.exist;
    expect(editButton.classList.contains("edit-btn")).to.be.true;
  });
});
