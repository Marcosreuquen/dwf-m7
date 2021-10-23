//init Router
import { initRouter } from "./router";
//Components
import "./components/navbar";
import "./components/text";
import "./components/button";
//Pages
import "./pages/welcome";

(() => {
  console.log("funcionando");
  initRouter(document.querySelector("#root"));
})();
