import { expect } from "@esm-bundle/chai";
import { translationService } from "../../src/i18n/translation-service";

describe("TranslationService", () => {
  beforeEach(() => {
    document.documentElement.lang = "en";
  });

  it("should initialize with default language", () => {
    expect(translationService.language).to.equal("en");
  });

  it("should change language", () => {
    translationService.setLanguage("tr");
    expect(translationService.language).to.equal("tr");
    expect(document.documentElement.lang).to.equal("tr");
  });

  it("should translate simple keys", () => {
    translationService.setLanguage("en");
    expect(translationService.t("navigation.employeeList")).to.equal(
      "Employee List"
    );
  });

  it("should translate with parameters", () => {
    expect(
      translationService.t("validation.required", { field: "First Name" })
    ).to.equal("First Name is required");
  });

  it("should return key if translation not found", () => {
    expect(translationService.t("nonexistent.key")).to.equal("nonexistent.key");
  });

  it("should translate in Turkish", () => {
    translationService.setLanguage("tr");
    expect(translationService.t("navigation.employeeList")).to.equal(
      "Çalışan Listesi"
    );
  });
});
