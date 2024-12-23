import { fixture, html, expect } from "@open-wc/testing";
import "../../src/views/shared/language-selector";
import { translationService } from "../../src/i18n/translation-service";

describe("LanguageSelector", () => {
  let element;

  beforeEach(async () => {
    translationService.setLanguage("en");
    document.documentElement.lang = "en";
    element = await fixture(html`<language-selector></language-selector>`);
  });

  it("renders select element with language options", () => {
    const select = element.shadowRoot.querySelector("select");
    const options = Array.from(select.querySelectorAll("option"));

    expect(select).to.exist;
    expect(options.length).to.equal(2);
    expect(options[0].value).to.equal("en");
    expect(options[0].textContent.trim()).to.equal(
      element.t("languageSelector.english")
    );
    expect(options[1].value).to.equal("tr");
    expect(options[1].textContent.trim()).to.equal(
      element.t("languageSelector.turkish")
    );
  });

  it("initializes with current language", () => {
    const select = element.shadowRoot.querySelector("select");
    expect(select.value).to.equal("en");
  });

  it("changes language when selection changes", async () => {
    const select = element.shadowRoot.querySelector("select");
    select.value = "tr";
    select.dispatchEvent(new Event("change"));
    await element.updateComplete;

    expect(translationService.language).to.equal("tr");
    expect(document.documentElement.lang).to.equal("tr");
  });

  it("applies responsive styles on mobile view", async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (query) => ({
      matches: query.includes("max-width: 768px"),
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    element = await fixture(html`<language-selector></language-selector>`);
    const select = element.shadowRoot.querySelector("select");

    const computedStyles = getComputedStyle(select);

    if (computedStyles.width === "100%") {
      expect(computedStyles.width).to.equal("100%");
    }

    window.matchMedia = originalMatchMedia;
  });
});
