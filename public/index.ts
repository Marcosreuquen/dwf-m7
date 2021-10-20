//init Router
import { initRouter } from "./router";
//Components
import "./components/navbar";
//Pages
import "./pages/welcome";

(() => {
  console.log("funcionando");
  initRouter(document.querySelector("#root"));
})();
