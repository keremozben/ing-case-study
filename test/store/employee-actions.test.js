import { expect } from "@open-wc/testing";
import { employeeActions } from "../../src/store/employee-actions";
import { store } from "../../src/store/store";

describe("employeeActions", () => {
  beforeEach(() => {
    // Reset store state before each test
    store.setState({ employees: [] });
  });

  describe("addEmployee", () => {
    it("should add an employee with generated fields", () => {
      const employee = {
        firstName: "John",
        lastName: "Doe",
        email: "john@sourtimes.org",
        dateOfBirth: "1990-01-01",
        dateOfEmployment: "2023-01-01",
        department: "Tech",
        position: "Senior",
        phoneNumber: "+(90) 555 123 45 67",
      };

      const newEmployee = employeeActions.addEmployee(employee);
      const state = store.getState();

      expect(state.employees).to.have.lengthOf(1);
      expect(newEmployee).to.include(employee);
      expect(newEmployee.id).to.be.a("string");
      expect(newEmployee.createdAt).to.be.a("string");
      expect(newEmployee.updatedAt).to.be.a("string");
    });
  });

  describe("updateEmployee", () => {
    it("should update an existing employee", () => {
      // First add an employee
      const employee = employeeActions.addEmployee({
        firstName: "John",
        lastName: "Doe",
      });

      // Update the employee
      const updatedData = {
        ...employee,
        firstName: "Jane",
      };

      const result = employeeActions.updateEmployee(updatedData);

      expect(result.firstName).to.equal("Jane");

      const state = store.getState();
      expect(state.employees[0]).to.deep.equal(result);
    });

    it("should not update non-existing employee", () => {
      const state = store.getState();

      employeeActions.updateEmployee({
        id: "non-existing",
        firstName: "Jane",
      });

      expect(store.getState().employees).to.deep.equal(state.employees);
    });
  });

  describe("deleteEmployee", () => {
    it("should delete an existing employee", () => {
      // Add an employee first
      const employee = employeeActions.addEmployee({
        firstName: "John",
        lastName: "Doe",
      });

      employeeActions.deleteEmployee(employee.id);

      const state = store.getState();
      expect(state.employees).to.have.lengthOf(0);
    });

    it("should not affect state when deleting non-existing employee", () => {
      employeeActions.deleteEmployee("non-existing");
      expect(store.getState().employees).to.have.lengthOf(0);
    });
  });

  describe("getEmployee", () => {
    it("should return employee by id", () => {
      const employee = employeeActions.addEmployee({
        firstName: "John",
        lastName: "Doe",
      });

      const result = employeeActions.getEmployee(employee.id);
      expect(result).to.deep.equal(employee);
    });

    it("should return undefined for non-existing employee", () => {
      const result = employeeActions.getEmployee("non-existing");
      expect(result).to.be.undefined;
    });
  });

  describe("loadSampleData", () => {
    it("should generate 50 employees with required fields", () => {
      employeeActions.loadSampleData();

      const state = store.getState();
      expect(state.employees).to.have.lengthOf(50);

      // Test first employee has all required fields
      const firstEmployee = state.employees[0];

      // Verify required fields exist and have correct types/formats
      expect(firstEmployee).to.have.property("id").that.is.a("string");
      expect(firstEmployee).to.have.property("firstName").that.is.a("string");
      expect(firstEmployee).to.have.property("lastName").that.is.a("string");
      expect(firstEmployee)
        .to.have.property("dateOfEmployment")
        .that.matches(/^\d{4}-\d{2}-\d{2}$/);
      expect(firstEmployee)
        .to.have.property("dateOfBirth")
        .that.matches(/^\d{4}-\d{2}-\d{2}$/);
      expect(firstEmployee)
        .to.have.property("phoneNumber")
        .that.matches(/^\+\(90\) \d{3} \d{3} \d{2} \d{2}$/);
      expect(firstEmployee)
        .to.have.property("email")
        .that.matches(/^.+@sourtimes\.org$/);
      expect(firstEmployee)
        .to.have.property("department")
        .that.is.oneOf(["Analytics", "Tech"]);
      expect(firstEmployee)
        .to.have.property("position")
        .that.is.oneOf(["Junior", "Medior", "Senior"]);
      expect(firstEmployee).to.have.property("createdAt").that.is.a("string");
      expect(firstEmployee).to.have.property("updatedAt").that.is.a("string");

      // Verify employees are sorted by employment date
      const dates = state.employees.map(
        (emp) => new Date(emp.dateOfEmployment)
      );
      const sortedDates = [...dates].sort((a, b) => b - a);
      expect(dates).to.deep.equal(sortedDates);
    });
  });

  describe("setViewMode", () => {
    it("should update view mode in store", () => {
      employeeActions.setViewMode("grid");
      expect(store.getState().viewMode).to.equal("grid");

      employeeActions.setViewMode("list");
      expect(store.getState().viewMode).to.equal("list");
    });
  });
});
