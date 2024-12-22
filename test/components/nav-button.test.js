import { fixture, html, expect } from "@open-wc/testing";
import { mockRouter } from "../setup";
import "../../src/views/shared/nav-button";

describe("NavButton", () => {
  let element;
  const defaultProps = {
    href: "/test",
    icon: "🔍",
  };

  beforeEach(async () => {
    window.router = mockRouter;
    element = await fixture(html`
      <nav-button href=${defaultProps.href} icon=${defaultProps.icon}>
        Test Link
      </nav-button>
    `);
  });

  it("renders button with correct content", () => {
    const button = element.shadowRoot.querySelector("a");
    const icon = button.querySelector(".icon");
    const text = button.querySelector(".text");

    expect(button.href).to.include(defaultProps.href);
    expect(icon.textContent).to.equal(defaultProps.icon);
    expect(text.querySelector("slot")).to.exist;
  });
});
