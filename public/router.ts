import { Router } from "@vaadin/router";

function initRouter(root: Element) {
  console.log("Initializing Router...");
  const router = new Router(root);
  router.setRoutes([
    {
      path: `/welcome`,
      component: "x-welcome",
    },
    {
      path: `/login`,
      component: "x-login",
    },
    {
      path: `/my-data`,
      component: "x-my-data",
    },
    {
      path: `/pet-data`,
      component: "x-pet-data",
    },
    {
      path: `/my-pets`,
      component: "x-my-pets",
    },
  ]);

  if (location.pathname === "/") {
    Router.go(`/welcome`);
  }
}

export { initRouter };
