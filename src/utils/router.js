import { Router } from "@vaadin/router";

let router;

function initRouter(outlet) {
  router = new Router(outlet);

  router.setRoutes([
    {
      path: "/",
      redirect: "/employees",
    },
    {
      path: "/employees",
      component: "employee-view",
    },
    {
      path: "/employees/new",
      component: "employee-form",
    },
    {
      path: "/employees/:id/edit",
      component: "employee-form",
    },
  ]);

  return router;
}

export { router, initRouter };
