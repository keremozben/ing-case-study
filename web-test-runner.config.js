import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  files: "src/**/*.test.js",
  nodeResolve: true,
  coverage: true,
  coverageConfig: {
    threshold: {
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85,
    },
  },
  browsers: [playwrightLauncher({ product: "chromium" })],
};
