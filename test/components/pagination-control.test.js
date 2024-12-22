import { fixture, html, expect } from "@open-wc/testing";
import "../../src/views/shared/pagination-control";

describe("PaginationControl", () => {
  let element;
  const defaultProps = {
    currentPage: 1,
    totalItems: 48,
    itemsPerPage: 10,
  };

  beforeEach(async () => {
    element = await fixture(html`
      <pagination-control
        .currentPage=${defaultProps.currentPage}
        .totalItems=${defaultProps.totalItems}
        .itemsPerPage=${defaultProps.itemsPerPage}
      ></pagination-control>
    `);
  });

  it("renders pagination buttons correctly", () => {
    const buttons = element.shadowRoot.querySelectorAll("button");
    expect(buttons.length).to.be.greaterThan(2);
  });

  it("disables previous button on first page", () => {
    const prevButton = element.shadowRoot.querySelector("button");
    expect(prevButton.disabled).to.be.true;
  });

  it("disables next button on last page", async () => {
    element.currentPage = 5;
    await element.updateComplete;

    const buttons = element.shadowRoot.querySelectorAll("button");
    const nextButton = buttons[buttons.length - 1];
    expect(nextButton.disabled).to.be.true;
  });

  it("enables both buttons on middle pages", async () => {
    element.currentPage = 2;
    await element.updateComplete;

    const buttons = element.shadowRoot.querySelectorAll("button");
    const prevButton = buttons[0];
    const nextButton = buttons[buttons.length - 1];

    expect(prevButton.disabled).to.be.false;
    expect(nextButton.disabled).to.be.false;
  });

  it("handles previous page click", async () => {
    element.currentPage = 2;
    await element.updateComplete;

    let eventFired = false;
    element.addEventListener("page-change", (e) => {
      eventFired = true;
      expect(e.detail.page).to.equal(1);
    });

    const prevButton = element.shadowRoot.querySelector("button");
    prevButton.click();

    expect(eventFired).to.be.true;
  });

  it("handles next page click", async () => {
    let eventFired = false;
    element.addEventListener("page-change", (e) => {
      eventFired = true;
      expect(e.detail.page).to.equal(2);
    });

    const buttons = element.shadowRoot.querySelectorAll("button");
    const nextButton = buttons[buttons.length - 1];
    nextButton.click();

    expect(eventFired).to.be.true;
  });

  it("handles page number click", async () => {
    let eventFired = false;
    element.addEventListener("page-change", (e) => {
      eventFired = true;
      expect(e.detail.page).to.equal(2);
    });

    const pageButtons = element.shadowRoot.querySelectorAll("button");
    const pageButton = Array.from(pageButtons).find(
      (btn) => btn.textContent.trim() === "2"
    );
    pageButton.click();

    expect(eventFired).to.be.true;
  });

  it("renders correct number of page buttons", async () => {
    const pageButtons = element.shadowRoot.querySelectorAll(
      "button:not(:first-child):not(:last-child)"
    );
    expect(pageButtons.length).to.be.at.least(3);
  });

  it("handles edge case of single page", async () => {
    element.totalItems = 5;
    element.itemsPerPage = 10;
    await element.updateComplete;

    const buttons = element.shadowRoot.querySelectorAll("button");
    const prevButton = buttons[0];
    const nextButton = buttons[buttons.length - 1];

    expect(prevButton.disabled).to.be.true;
    expect(nextButton.disabled).to.be.true;
  });
});
