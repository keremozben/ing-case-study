import { fixture, html, expect } from "@open-wc/testing";
import { dispatchLanguageChange } from "../setup";
import "../../src/views/employees/components/employee-table";

describe("EmployeeTable", () => {
  let element;
  const mockEmployees = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      department: "Tech",
      position: "Senior",
      phoneNumber: "1234567890",
      dateOfBirth: "1990-01-01",
      dateOfEmployment: "2020-01-01",
    },
  ];

  beforeEach(async () => {
    element = await fixture(html`
      <employee-table
        .employees=${mockEmployees}
        .selectedEmployees=${[]}
      ></employee-table>
    `);
  });

  it("renders table with correct headers", () => {
    const headers = element.shadowRoot.querySelectorAll("th");
    expect(headers.length).to.equal(10); // Including checkbox column
    expect(headers[1].textContent).to.equal(
      element.t("employeeList.firstName")
    );
  });

  it("renders employee rows correctly", () => {
    const rows = element.shadowRoot.querySelectorAll("tbody tr");
    expect(rows.length).to.equal(1);

    const cells = rows[0].querySelectorAll("td");
    expect(cells[1].textContent).to.equal(mockEmployees[0].firstName);
    expect(cells[2].textContent).to.equal(mockEmployees[0].lastName);
    expect(cells[6].textContent).to.equal(mockEmployees[0].email);
  });

  it("handles toggle all checkbox", async () => {
    let eventFired = false;
    element.addEventListener("toggle-all", (e) => {
      eventFired = true;
      expect(e.detail.isChecked).to.be.false;
    });

    const checkbox = element.shadowRoot.querySelector(".checkbox");
    checkbox.click();
    await element.updateComplete;

    expect(eventFired).to.be.true;
  });

  it("handles row selection", async () => {
    let eventFired = false;
    element.addEventListener("toggle-employee", (e) => {
      eventFired = true;
      expect(e.detail.employeeId).to.equal("1");
    });

    const checkbox = element.shadowRoot.querySelector("tbody .checkbox");
    checkbox.click();

    expect(eventFired).to.be.true;
  });

  it("handles edit employee action", async () => {
    let eventFired = false;
    element.addEventListener("edit-employee", (e) => {
      eventFired = true;
      expect(e.detail.employee).to.equal(mockEmployees[0]);
    });

    const editButton = element.shadowRoot.querySelector(".edit-btn");
    editButton.click();

    expect(eventFired).to.be.true;
  });

  it("handles delete employee action", async () => {
    let eventFired = false;
    element.addEventListener("delete-employee", (e) => {
      eventFired = true;
      expect(e.detail.employee).to.equal(mockEmployees[0]);
    });

    const deleteButton = element.shadowRoot.querySelector(".delete-btn");
    deleteButton.click();

    expect(eventFired).to.be.true;
  });

  it("updates checkboxes when selectedEmployees changes", async () => {
    element.selectedEmployees = ["1"];
    await element.updateComplete;

    const checkbox = element.shadowRoot.querySelector("tbody .checkbox");
    expect(checkbox.classList.contains("checked")).to.be.true;
  });

  it("translates headers when language changes", async () => {
    document.documentElement.lang = "tr";
    dispatchLanguageChange();
    await element.updateComplete;

    const firstNameHeader = element.shadowRoot.querySelector("th:nth-child(2)");
    expect(firstNameHeader.textContent).to.equal(
      element.t("employeeList.firstName")
    );
  });

  describe("_handleToggleAll", () => {
    it("dispatches event with isChecked=true when not all rows are selected", async () => {
      const employees = [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          department: "Tech",
          position: "Senior",
          phoneNumber: "1234567890",
          dateOfBirth: "1990-01-01",
          dateOfEmployment: "2020-01-01",
        },
        {
          id: "2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          department: "HR",
          position: "Manager",
          phoneNumber: "0987654321",
          dateOfBirth: "1985-05-15",
          dateOfEmployment: "2018-06-15",
        },
      ];

      element = await fixture(html`
        <employee-table
          .employees=${employees}
          .selectedEmployees=${["1"]}
        ></employee-table>
      `);

      let eventDetail = null;
      element.addEventListener("toggle-all", (e) => {
        eventDetail = e.detail;
      });

      element._handleToggleAll();
      expect(eventDetail.isChecked).to.be.false;
    });

    it("dispatches event with isChecked=false when all rows are selected", async () => {
      const employees = [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          department: "Tech",
          position: "Senior",
          phoneNumber: "1234567890",
          dateOfBirth: "1990-01-01",
          dateOfEmployment: "2020-01-01",
        },
        {
          id: "2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          department: "HR",
          position: "Manager",
          phoneNumber: "0987654321",
          dateOfBirth: "1985-05-15",
          dateOfEmployment: "2018-06-15",
        },
      ];

      element = await fixture(html`
        <employee-table
          .employees=${employees}
          .selectedEmployees=${["1", "2"]}
        ></employee-table>
      `);

      let eventDetail = null;
      element.addEventListener("toggle-all", (e) => {
        eventDetail = e.detail;
      });

      element._handleToggleAll();
      expect(eventDetail.isChecked).to.be.true;
    });
  });

  describe("_handleToggleEmployee", () => {
    it("dispatches event with correct employeeId", async () => {
      let capturedEvent = null;
      element.addEventListener("toggle-employee", (e) => {
        capturedEvent = e;
      });

      element._handleToggleEmployee("test-id");

      expect(capturedEvent).to.not.be.null;
      expect(capturedEvent.detail.employeeId).to.equal("test-id");
      expect(capturedEvent.bubbles).to.be.true;
      expect(capturedEvent.composed).to.be.true;
    });
  });

  describe("_handleEdit", () => {
    it("dispatches edit event with employee data", async () => {
      const testEmployee = { id: "1", firstName: "John", lastName: "Doe" };
      let capturedEvent = null;

      element.addEventListener("edit-employee", (e) => {
        capturedEvent = e;
      });

      element._handleEdit(testEmployee);

      expect(capturedEvent).to.not.be.null;
      expect(capturedEvent.detail.employee).to.deep.equal(testEmployee);
      expect(capturedEvent.bubbles).to.be.true;
      expect(capturedEvent.composed).to.be.true;
    });
  });

  describe("_handleDelete", () => {
    it("dispatches delete event with employee data", async () => {
      const testEmployee = { id: "1", firstName: "John", lastName: "Doe" };
      let capturedEvent = null;

      element.addEventListener("delete-employee", (e) => {
        capturedEvent = e;
      });

      element._handleDelete(testEmployee);

      expect(capturedEvent).to.not.be.null;
      expect(capturedEvent.detail.employee).to.deep.equal(testEmployee);
      expect(capturedEvent.bubbles).to.be.true;
      expect(capturedEvent.composed).to.be.true;
    });
  });
});
