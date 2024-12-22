# Employee Management Application

This is a simple **Employee Management Application** built using **LitElement**.

## Features

- Built with [Lit](https://lit.dev/) for lightweight and efficient web components.
- Routing managed by [Vaadin Router](https://vaadin.com/router).
- Mock data generation using [Faker.js](https://fakerjs.dev/).
- Input masking with [IMask](https://imask.js.org/).
- UUID generation using [uuid](https://www.npmjs.com/package/uuid).
- Development server and testing utilities from Open Web Components.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd employee-management-app
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm start
   ```
   The application will open in your default browser at `http://localhost:8000`.

## Scripts

### Development

- **Start the dev server:**
  ```bash
  npm start
  ```
  Starts the development server with live reloading.

### Testing

- **Run tests with coverage:**

  ```bash
  npm test
  ```

  Runs all tests in the `test/` folder and generates a coverage report.

- **Watch tests:**
  ```bash
  npm run test:watch
  ```
  Watches for file changes and reruns tests automatically.

### Build

- **Build the application:**
  ```bash
  npm run build
  ```
  Uses Rollup to bundle the application for production.

## Project Structure

```plaintext
employee-management-app/
├── src/             # Source files
├── test/            # Unit tests
├── rollup.config.js # Rollup configuration
├── package.json     # Project dependencies and scripts
└── README.md        # Project documentation
```

## Dependencies

### Runtime Dependencies

- **[Lit](https://lit.dev/):** Fast, simple web components.
- **[Vaadin Router](https://vaadin.com/router):** A small, powerful router for web apps.
- **[Faker.js](https://fakerjs.dev/):** Fake data generator for populating mock data.
- **[IMask](https://imask.js.org/):** Input masking library.
- **[uuid](https://www.npmjs.com/package/uuid):** For generating unique IDs.

### Development Dependencies

- **[Open Web Components Testing](https://open-wc.org/testing/testing.html):** Testing tools for web components.
- **[Rollup](https://rollupjs.org/):** JavaScript bundler.
- **[Web Test Runner](https://modern-web.dev/docs/test-runner/overview/):** Test runner for modern web applications.
- **[Sinon](https://sinonjs.org/):** Test spies, stubs, and mocks.
- **[Chai](https://www.chaijs.com/):** Assertion library for tests.
