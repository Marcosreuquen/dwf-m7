const huella = require("url:../assets/huella.png");
const burger = require("url:../assets/burger.png");
import { state } from "../state";
class NavBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {
    const burger = this.querySelector(".navbar-burger");
    const menu = this.querySelector("#menubar");
    burger.addEventListener("click", (e) => {
      menu.classList.toggle("is-active");
    });
  }
  render() {
    const cs = state.getState();
    this.innerHTML = `
    <div class="navbar has-background-info" role="navigation" aria-label="main navigation">
      <div class="navbar-start navbar-brand is-justify-content-space-between">
        <div class="navbar-item">
          <a href="/welcome" class="navbar-item">
          <img class="navbar__logo" src="${huella}">
          </a>
        </div>
        <div class="navbar-item navbar-end is-pulled-right">
          <a role="button" class="navbar-burger navbar-end is-pulled-right navbar-item" aria-label="menu" aria-expanded="false" data-target="menubar">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
      </div>
      
      <div class="navbar-menu has-background-info" id="menubar">
        <div class="navbar-item">
          <a href="/my-data" class="navbar-item">Mis datos</a>
        </div>
        <div class="navbar-item">
          <a href="/my-pets" class="navbar-item">Mis mascotas reportadas</a>
        </div>
        <div class="navbar-item">
          <a href="/pet-data" class="navbar-item">Reportar mascota</a>
        </div>

        <span class="is-underlined is-size-6 navbar-item">${
          cs.user?.email ? cs.user.email : ""
        }</span>
        <div class="navbar-end navbar-item has-text-weight-light">
          <a href="/login" class="navbar-item button is-primary">${
            cs.user?.token ? "CERRAR SESION" : "INICIAR SESION"
          }</a>
        </div>
      </div>
    </div>
    `;
    this.addListeners();
  }
}
customElements.define("x-navbar", NavBar);
