import { expect } from "@open-wc/testing";
import { router, initRouter } from "../../src/utils/router";
import { Router } from "@vaadin/router";

describe("Router", () => {
  let outlet;

  beforeEach(() => {
    outlet = document.createElement("div");
    document.body.appendChild(outlet);
  });

  afterEach(() => {
    document.body.removeChild(outlet);
  });

  it("should export router instance after initialization", () => {
    const routerInstance = initRouter(outlet);
    expect(router).to.equal(routerInstance);
  });
});
