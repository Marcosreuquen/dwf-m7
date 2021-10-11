import { Router } from "@vaadin/router";

export const router = new Router(document.querySelector(".root"));
router.setRoutes([
  {
    path: `/welcome`,
    component: "x-welcome",
  },
]);

if (location.pathname === "/") {
  Router.go(`/welcome`);
}
