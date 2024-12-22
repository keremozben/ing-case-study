import { fixture, html, expect } from "@open-wc/testing";
import sinon from "sinon";
import { mockRouter } from "../setup";
import "../../src/views/employees/employee-view";
import { store } from "../../src/store/store";
import { employeeActions } from "../../src/store/employee-actions";

describe("EmployeeView", () => {
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
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      department: "Analytics",
      position: "Medior",
      phoneNumber: "0987654321",
      dateOfBirth: "1992-01-01",
      dateOfEmployment: "2021-01-01",
    },
  ];

  beforeEach(async () => {
    window.router = mockRouter;
    store.setState({ employees: mockEmployees, viewMode: "table" });
    element = await fixture(html`<employee-view></employee-view>`);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders employee list in table mode", async () => {
    const table = element.shadowRoot.querySelector("employee-table");
    expect(table).to.exist;
    expect(table.employees).to.deep.equal(mockEmployees);
  });

  it("renders employee list in list mode", async () => {
    store.setState({ ...store.getState(), viewMode: "list" });
    await element.updateComplete;

    const listView = element.shadowRoot.querySelector(".list-view");
    const cards = listView.querySelectorAll("employee-card");
    expect(cards.length).to.equal(mockEmployees.length);
  });

  it("handles view mode toggle", async () => {
    const listViewButton = element.shadowRoot.querySelector(
      ".view-toggle button:nth-child(2)"
    );
    listViewButton.click();
    await element.updateComplete;

    expect(store.getState().viewMode).to.equal("list");
  });

  it("handles search filtering", async () => {
    element.searchQuery = "John";
    await element.updateComplete;

    const filteredEmployees = element.filteredEmployees;
    expect(filteredEmployees.length).to.equal(1);
    expect(filteredEmployees[0].firstName).to.equal("John");
  });

  it("handles department filtering", async () => {
    element.filters = { ...element.filters, department: "Tech" };
    await element.updateComplete;

    const filteredEmployees = element.filteredEmployees;
    expect(filteredEmployees.length).to.equal(1);
    expect(filteredEmployees[0].department).to.equal("Tech");
  });

  it("handles position filtering", async () => {
    element.filters = { ...element.filters, position: "Senior" };
    await element.updateComplete;

    const filteredEmployees = element.filteredEmployees;
    expect(filteredEmployees.length).to.equal(1);
    expect(filteredEmployees[0].position).to.equal("Senior");
  });

  it("handles employee selection", async () => {
    element.toggleEmployee("1");
    await element.updateComplete;

    expect(element.selectedEmployees).to.include("1");
  });

  it("handles employee deletion", async () => {
    const deleteActionSpy = sinon.spy(employeeActions, "deleteEmployee");

    element.deleteEmployee(mockEmployees[0]);
    await element.updateComplete;

    expect(element.employeeToDelete).to.deep.equal(mockEmployees[0]);

    element._confirmDelete();
    expect(deleteActionSpy.calledWith(mockEmployees[0].id)).to.be.true;
    expect(element.employeeToDelete).to.be.null;
  });

  it("handles pagination", async () => {
    const event = new CustomEvent("page-change", {
      detail: { page: 2 },
    });
    element._handlePageChange(event);
    await element.updateComplete;

    expect(element.currentPage).to.equal(2);
  });

  it("handles filter changes", async () => {
    const filterEvent = new CustomEvent("filter-change", {
      detail: { type: "searchQuery", value: "John" },
    });
    element._handleFilterChange(filterEvent);
    await element.updateComplete;

    expect(element.searchQuery).to.equal("John");
  });

  it("maintains store subscription", () => {
    const unsubscribeSpy = sinon.spy();
    element._unsubscribe = unsubscribeSpy;
    element.disconnectedCallback();
    expect(unsubscribeSpy.called).to.be.true;
  });

  it("loads sample data when store is empty", async () => {
    const loadSampleDataSpy = sinon.spy(employeeActions, "loadSampleData");
    store.setState({ employees: [] });

    element = await fixture(html`<employee-view></employee-view>`);

    expect(loadSampleDataSpy.called).to.be.true;
  });
});
