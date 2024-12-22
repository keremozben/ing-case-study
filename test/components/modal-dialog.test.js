import { fixture, html, expect } from "@open-wc/testing";
import "../../src/views/shared/modal-dialog";

describe("ModalDialog", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <modal-dialog .open=${false} .title=${"Test Modal"}>
        <p>Test Content</p>
      </modal-dialog>
    `);
  });

  it("renders when open", async () => {
    element.open = true;
    await element.updateComplete;

    const modal = element.shadowRoot.querySelector(".modal");
    expect(modal).to.exist;
    expect(modal.querySelector(".modal-title").textContent).to.equal(
      "Test Modal"
    );
  });

  it("handles close button click", async () => {
    element.open = true;
    await element.updateComplete;

    let eventFired = false;
    element.addEventListener("cancel", () => {
      eventFired = true;
    });

    const closeButton = element.shadowRoot.querySelector(".close-button");
    closeButton.click();

    expect(eventFired).to.be.true;
  });

  it("handles escape key", async () => {
    element.open = true;
    await element.updateComplete;

    let eventFired = false;
    element.addEventListener("cancel", () => {
      eventFired = true;
    });

    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(eventFired).to.be.true;
  });

  it("handles backdrop click", async () => {
    element.open = true;
    await element.updateComplete;

    let eventFired = false;
    element.addEventListener("cancel", () => {
      eventFired = true;
    });

    const backdrop = element.shadowRoot.querySelector(".modal-backdrop");
    backdrop.click();

    expect(eventFired).to.be.true;
  });

  it("handles cancel button click", async () => {
    element.open = true;
    await element.updateComplete;

    let eventFired = false;
    element.addEventListener("cancel", () => {
      eventFired = true;
    });

    const cancelButton = element.shadowRoot.querySelector("button.cancel");
    cancelButton.click();

    expect(eventFired).to.be.true;
    expect(element.open).to.be.false;
  });

  it("handles proceed button click", async () => {
    element.open = true;
    await element.updateComplete;

    let eventFired = false;
    element.addEventListener("proceed", () => {
      eventFired = true;
    });

    const proceedButton = element.shadowRoot.querySelector("button.proceed");
    proceedButton.click();

    expect(eventFired).to.be.true;
    expect(element.open).to.be.false;
  });
});
