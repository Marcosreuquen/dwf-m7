//init Router
import { initRouter } from "./router";
//Components
import "./components/navbar";
import "./components/text";
import "./components/button";
import "./components/pet-card";
//Pages
import "./pages/welcome";
import "./pages/login";
import "./pages/my-data";
import "./pages/pet-data";
import "./pages/my-pets";

(() => {
  console.log("funcionando");
  initRouter(document.querySelector("#root"));
})();
