import { Router } from "@vaadin/router";

function initRouter(root: Element) {
  console.log("Initializing Router...");
  const router = new Router(root);
  router.setRoutes([
    {
      path: `/welcome`,
      component: "x-welcome",
    },
  ]);

  if (location.pathname === "/") {
    Router.go(`/welcome`);
  }
}

export { initRouter };
