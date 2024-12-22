import { expect } from "@esm-bundle/chai";
import { fixture, html } from "@open-wc/testing";

window.expect = expect;

// Mock router for testing
export const mockRouter = {
  navigate: (path) => {},
  setOutlet: (outlet) => {},
  go: () => {},
};

// Mock translations event
export const dispatchLanguageChange = () => {
  window.dispatchEvent(new Event("languagechange"));
};
