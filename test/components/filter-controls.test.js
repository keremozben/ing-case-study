import { fixture, html, expect } from "@open-wc/testing";
import { dispatchLanguageChange } from "../setup";
import "../../src/views/employees/components/filter-controls";

describe("FilterControls", () => {
  let element;
  const defaultProps = {
    searchQuery: "",
    filters: {
      department: "",
      position: "",
    },
  };

  beforeEach(async () => {
    element = await fixture(html`
      <filter-controls
        .searchQuery=${defaultProps.searchQuery}
        .filters=${defaultProps.filters}
      ></filter-controls>
    `);
  });

  it("renders search box and filter dropdowns", () => {
    const searchBox = element.shadowRoot.querySelector('input[type="search"]');
    const departmentSelect = element.shadowRoot.querySelector(
      'select[data-filter="department"]'
    );
    const positionSelect = element.shadowRoot.querySelector(
      'select[data-filter="position"]'
    );

    expect(searchBox).to.exist;
    expect(departmentSelect).to.exist;
    expect(positionSelect).to.exist;
  });

  it("handles search input changes", async () => {
    let eventFired = false;
    element.addEventListener("filter-change", (e) => {
      eventFired = true;
      expect(e.detail.type).to.equal("searchQuery");
      expect(e.detail.value).to.equal("John");
    });

    const searchBox = element.shadowRoot.querySelector('input[type="search"]');
    searchBox.value = "John";
    searchBox.dispatchEvent(new Event("input"));

    expect(eventFired).to.be.true;
  });

  it("handles department filter changes", async () => {
    let eventFired = false;
    element.addEventListener("filter-change", (e) => {
      eventFired = true;
      expect(e.detail.type).to.equal("department");
      expect(e.detail.value).to.equal(element.t("departments.tech"));
    });

    const departmentSelect = element.shadowRoot.querySelector(
      'select[data-filter="department"]'
    );
    departmentSelect.value = "Tech";
    departmentSelect.dispatchEvent(new Event("change"));

    expect(eventFired).to.be.true;
  });

  it("handles position filter changes", async () => {
    let eventFired = false;
    element.addEventListener("filter-change", (e) => {
      eventFired = true;
      expect(e.detail.type).to.equal("position");
      expect(e.detail.value).to.equal(element.t("positions.senior"));
    });

    const positionSelect = element.shadowRoot.querySelector(
      'select[data-filter="position"]'
    );
    positionSelect.value = "Senior";
    positionSelect.dispatchEvent(new Event("change"));

    expect(eventFired).to.be.true;
  });

  it("updates search input when searchQuery prop changes", async () => {
    element.searchQuery = "John";
    await element.updateComplete;

    const searchBox = element.shadowRoot.querySelector('input[type="search"]');
    expect(searchBox.value).to.equal("John");
  });

  it("updates filter selects when filters prop changes", async () => {
    element.filters = {
      department: "Tech",
      position: "Senior",
    };
    await element.updateComplete;

    const departmentSelect = element.shadowRoot.querySelector(
      'select[data-filter="department"]'
    );
    const positionSelect = element.shadowRoot.querySelector(
      'select[data-filter="position"]'
    );

    expect(departmentSelect.value).to.equal("Tech");
    expect(positionSelect.value).to.equal("Senior");
  });

  it("translates filter options", async () => {
    document.documentElement.lang = "tr";
    dispatchLanguageChange();
    await element.updateComplete;

    const departmentSelect = element.shadowRoot.querySelector(
      'select[data-filter="department"]'
    );
    const techOption = departmentSelect.querySelector('option[value="Tech"]');

    expect(techOption.textContent.trim()).to.equal(
      element.t("departments.tech")
    );
  });

  it("translates placeholder text", async () => {
    document.documentElement.lang = "tr";
    dispatchLanguageChange();
    await element.updateComplete;

    const searchBox = element.shadowRoot.querySelector('input[type="search"]');
    expect(searchBox.placeholder).to.equal(element.t("employeeList.search"));
  });

  it("applies responsive styles on mobile view", async () => {
    // Simulate mobile viewport
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (query) => ({
      matches: query.includes("max-width: 768px"),
      addListener: () => {},
      removeListener: () => {},
    });

    element = await fixture(html`
      <filter-controls
        .searchQuery=${defaultProps.searchQuery}
        .filters=${defaultProps.filters}
      ></filter-controls>
    `);

    const filterGroup = element.shadowRoot.querySelector(".filter-group");
    expect(filterGroup).to.exist;

    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it("handles keyboard navigation in search box", async () => {
    const searchBox = element.shadowRoot.querySelector('input[type="search"]');

    let eventFired = false;
    element.addEventListener("filter-change", (e) => {
      eventFired = true;
      expect(e.detail.type).to.equal("searchQuery");
      expect(e.detail.value).to.equal("John");
    });

    searchBox.value = "John";
    searchBox.dispatchEvent(new Event("input"));

    expect(eventFired).to.be.true;
  });

  it("maintains filter state after re-render", async () => {
    // Set initial filters
    element.filters = {
      department: "Tech",
      position: "Senior",
    };
    await element.updateComplete;

    // Force re-render
    element.requestUpdate();
    await element.updateComplete;

    const departmentSelect = element.shadowRoot.querySelector(
      'select[data-filter="department"]'
    );
    const positionSelect = element.shadowRoot.querySelector(
      'select[data-filter="position"]'
    );

    expect(departmentSelect.value).to.equal("Tech");
    expect(positionSelect.value).to.equal("Senior");
  });
});
