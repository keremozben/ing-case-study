import { fixture, html, expect } from "@open-wc/testing";
import { dispatchLanguageChange } from "../setup";
import "../../src/views/shared/navigation";

describe("Navigation", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<app-navigation></app-navigation>`);
  });

  it("renders logo and navigation links", () => {
    const logo = element.shadowRoot.querySelector(".logo");
    const logoImg = logo.querySelector(".logo-img");
    const navButtons = element.shadowRoot.querySelectorAll("nav-button");

    expect(logo.href).to.include("/");
    expect(logoImg.textContent).to.equal("ING");
    expect(navButtons.length).to.equal(2);
  });

  it("renders employee list navigation button", () => {
    const listButton = element.shadowRoot.querySelector(
      'nav-button[href="/employees"]'
    );
    expect(listButton).to.exist;
    expect(listButton.textContent.trim()).to.equal(
      element.t("employeeList.title")
    );
  });

  it("renders add employee navigation button", () => {
    const addButton = element.shadowRoot.querySelector(
      'nav-button[href="/employees/new"]'
    );
    expect(addButton).to.exist;
    expect(addButton.textContent.trim()).to.equal(
      element.t("navigation.addEmployee")
    );
  });

  it("includes language selector", () => {
    const languageSelector =
      element.shadowRoot.querySelector("language-selector");
    expect(languageSelector).to.exist;
  });

  it("translates navigation items", async () => {
    document.documentElement.lang = "tr";
    dispatchLanguageChange();
    await element.updateComplete;

    const listButton = element.shadowRoot.querySelector(
      'nav-button[href="/employees"]'
    );
    expect(listButton.textContent.trim()).to.equal(
      element.t("employeeList.title")
    );
  });

  it("applies responsive styles on mobile view", async () => {
    // Simulate mobile viewport
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (query) => ({
      matches: query.includes("max-width: 768px"),
      addListener: () => {},
      removeListener: () => {},
    });

    element = await fixture(html`<app-navigation></app-navigation>`);

    const container = element.shadowRoot.querySelector(".container");
    const styles = window.getComputedStyle(container);
    expect(styles.padding).to.equal("0px 32px");

    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it("maintains nav button alignment", () => {
    const actions = element.shadowRoot.querySelector(".actions");
    const styles = window.getComputedStyle(actions);

    expect(styles.display).to.equal("flex");
    expect(styles.alignItems).to.equal("center");
    expect(styles.gap).to.equal("16px");
  });

  it("applies correct logo styles", () => {
    const logoImg = element.shadowRoot.querySelector(".logo-img");
    const styles = window.getComputedStyle(logoImg);

    expect(styles.width).to.equal("32px");
    expect(styles.height).to.equal("32px");
    expect(styles.backgroundColor).to.equal("rgb(255, 107, 0)");
    expect(styles.color).to.equal("rgb(255, 255, 255)");
    expect(styles.borderRadius).to.equal("4px");
    expect(styles.display).to.equal("flex");
    expect(styles.alignItems).to.equal("center");
    expect(styles.justifyContent).to.equal("center");
  });

  it("maintains fixed height on all viewport sizes", () => {
    const nav = element.shadowRoot.querySelector("nav");
    const styles = window.getComputedStyle(nav);
    expect(styles.height).to.equal("64px");
  });

  it("handles navigation button hover states", async () => {
    const listButton = element.shadowRoot.querySelector(
      'nav-button[href="/employees"]'
    );
    listButton.dispatchEvent(new MouseEvent("mouseover"));
    await element.updateComplete;

    const styles = window.getComputedStyle(listButton);
    expect(styles.backgroundColor).to.not.equal("transparent");
  });

  it("maintains logo visibility on small screens", async () => {
    // Simulate mobile viewport
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (query) => ({
      matches: query.includes("max-width: 768px"),
      addListener: () => {},
      removeListener: () => {},
    });

    element = await fixture(html`<app-navigation></app-navigation>`);

    const logo = element.shadowRoot.querySelector(".logo");
    const logoText = logo.querySelector("span");
    const styles = window.getComputedStyle(logoText);
    expect(styles.display).to.not.equal("none");

    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it("maintains layout on language change", async () => {
    const initialHeight = element.offsetHeight;

    document.documentElement.lang = "tr";
    dispatchLanguageChange();
    await element.updateComplete;

    expect(element.offsetHeight).to.equal(initialHeight);
  });

  it("applies correct container padding based on viewport", async () => {
    // Test default/large viewport
    let container = element.shadowRoot.querySelector(".container");
    let styles = window.getComputedStyle(container);
    expect(styles.maxWidth).to.equal("1280px");
    expect(styles.padding).to.equal("0px 32px");

    // Test medium viewport (max-width: 1320px)
    window.matchMedia = (query) => ({
      matches: query.includes("max-width: 1320px"),
      addListener: () => {},
      removeListener: () => {},
    });
    element = await fixture(html`<app-navigation></app-navigation>`);
    container = element.shadowRoot.querySelector(".container");
    styles = window.getComputedStyle(container);
    expect(styles.padding).to.equal("0px 32px");

    // Test mobile viewport (max-width: 768px)
    window.matchMedia = (query) => ({
      matches: query.includes("max-width: 768px"),
      addListener: () => {},
      removeListener: () => {},
    });
    element = await fixture(html`<app-navigation></app-navigation>`);
    container = element.shadowRoot.querySelector(".container");
    styles = window.getComputedStyle(container);
    expect(styles.padding).to.equal("0px 32px");
  });

  it("applies correct logo text styles", () => {
    const logo = element.shadowRoot.querySelector(".logo");
    const styles = window.getComputedStyle(logo);

    expect(styles.display).to.equal("flex");
    expect(styles.alignItems).to.equal("center");
    expect(styles.gap).to.equal("8px");
    expect(styles.fontWeight).to.equal("700");
    expect(styles.fontSize).to.equal("16px");
    expect(styles.color).to.equal("rgb(51, 51, 51)"); // #333
    expect(styles.textDecoration).to.equal("none solid rgb(51, 51, 51)");
  });
});
