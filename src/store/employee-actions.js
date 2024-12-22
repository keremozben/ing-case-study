import { store } from "./store";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker/locale/tr";

export const employeeActions = {
  addEmployee(employee) {
    const state = store.getState();
    const newEmployee = {
      ...employee,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.setState({
      employees: [newEmployee, ...state.employees],
    });

    return newEmployee;
  },

  updateEmployee(employee) {
    const state = store.getState();
    const updatedEmployee = {
      ...employee,
      updatedAt: new Date().toISOString(),
    };

    store.setState({
      employees: state.employees.map((emp) =>
        emp.id === employee.id ? updatedEmployee : emp
      ),
    });

    return updatedEmployee;
  },

  deleteEmployee(employeeId) {
    const state = store.getState();

    store.setState({
      employees: state.employees.filter((emp) => emp.id !== employeeId),
    });
  },

  getEmployee(employeeId) {
    const state = store.getState();
    return state.employees.find((emp) => emp.id === employeeId);
  },

  // Optional: Add some sample data for testing
  loadSampleData() {
    const departments = ["Analytics", "Tech"];
    const positions = ["Junior", "Medior", "Senior"];

    // Generate 50 random employees
    const sampleEmployees = Array.from({ length: 50 }, () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({
        firstName,
        lastName,
        provider: "sourtimes.org",
      });

      const birthDate = faker.date.between({
        from: "1980-01-01",
        to: "2000-12-31",
      });

      const employmentDate = faker.date.between({
        from: "2021-01-01",
        to: new Date(),
      });

      const formatDate = (date) => date.toISOString().split("T")[0];

      const phoneNumber = `+(90) ${faker.string.numeric({
        length: 3,
        allowLeadingZeros: false,
      })} ${faker.string.numeric({
        length: 3,
        allowLeadingZeros: true,
      })} ${faker.string.numeric({
        length: 2,
        allowLeadingZeros: true,
      })} ${faker.string.numeric({
        length: 2,
        allowLeadingZeros: true,
      })}`;

      return {
        id: uuidv4(),
        firstName,
        lastName,
        dateOfEmployment: formatDate(employmentDate),
        dateOfBirth: formatDate(birthDate),
        phoneNumber,
        email,
        department: faker.helpers.arrayElement(departments),
        position: faker.helpers.arrayElement(positions),
        createdAt: faker.date
          .between({
            from: employmentDate,
            to: new Date(),
          })
          .toISOString(),
        updatedAt: faker.date
          .between({
            from: employmentDate,
            to: new Date(),
          })
          .toISOString(),
      };
    });

    sampleEmployees.sort(
      (a, b) => new Date(b.dateOfEmployment) - new Date(a.dateOfEmployment)
    );

    store.setState({ employees: sampleEmployees });
  },

  setViewMode: (viewMode) => {
    store.setState({ viewMode });
  },
};
