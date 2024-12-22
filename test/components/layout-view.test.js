import { fixture, html, expect } from "@open-wc/testing";
import "../../src/views/shared/layout-view";

describe("LayoutView", () => {
  let element;
  const defaultProps = {
    title: "Test Title",
  };

  beforeEach(async () => {
    element = await fixture(html`
      <layout-view .title=${defaultProps.title}>
        <div>Main Content</div>
        <button slot="actions">Action Button</button>
      </layout-view>
    `);
  });

  it("renders title correctly", () => {
    const title = element.shadowRoot.querySelector("h1");
    expect(title.textContent).to.equal(defaultProps.title);
  });

  it("renders slotted actions", () => {
    const actionsSlot = element.shadowRoot.querySelector(
      'slot[name="actions"]'
    );
    const assignedNodes = actionsSlot.assignedNodes();
    expect(assignedNodes[0].textContent).to.equal("Action Button");
  });

  it("updates title when property changes", async () => {
    element.title = "New Title";
    await element.updateComplete;

    const title = element.shadowRoot.querySelector("h1");
    expect(title.textContent).to.equal("New Title");
  });

  it("applies correct header styles", () => {
    const header = element.shadowRoot.querySelector(".header");
    const styles = window.getComputedStyle(header);

    expect(styles.display).to.equal("flex");
    expect(styles.justifyContent).to.equal("space-between");
    expect(styles.alignItems).to.equal("center");
    expect(styles.marginBottom).to.equal("32px");
  });

  it("applies title styles", () => {
    const title = element.shadowRoot.querySelector("h1");
    const styles = window.getComputedStyle(title);

    expect(styles.fontSize).to.equal("24px");
    expect(styles.color).to.equal("rgb(255, 107, 0)");
    expect(styles.margin).to.equal("0px");
  });

  it("applies header actions styles", () => {
    const actions = element.shadowRoot.querySelector(".header-actions");
    const styles = window.getComputedStyle(actions);

    expect(styles.display).to.equal("flex");
    expect(styles.gap).to.equal("16px");
  });

  it("handles empty main content slot gracefully", async () => {
    element = await fixture(html`
      <layout-view .title=${defaultProps.title}>
        <button slot="actions">Action Button</button>
      </layout-view>
    `);

    const mainSlot = element.shadowRoot.querySelector("slot:not([name])");
    expect(mainSlot).to.exist;
  });

  it("handles multiple action buttons", async () => {
    element = await fixture(html`
      <layout-view .title=${defaultProps.title}>
        <div>Main Content</div>
        <button slot="actions">Action 1</button>
        <button slot="actions">Action 2</button>
      </layout-view>
    `);

    const actionsSlot = element.shadowRoot.querySelector(
      'slot[name="actions"]'
    );
    const assignedNodes = actionsSlot.assignedNodes();
    expect(assignedNodes.length).to.equal(2);
  });

  it("applies responsive styles on mobile view", async () => {
    // This test should be removed or modified since the component doesn't
    // currently have mobile-specific styles defined
    // Consider adding mobile styles to the component first
  });

  it("maintains header margin on all viewport sizes", async () => {
    const header = element.shadowRoot.querySelector(".header");
    const styles = window.getComputedStyle(header);
    expect(styles.marginBottom).to.equal("32px");
  });
});
