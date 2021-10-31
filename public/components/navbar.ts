const huella = require("url:../assets/huella.png");
const burger = require("url:../assets/burger.png");
import { state } from "../state";
import swal from "sweetalert";
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
    <div class="navbar has-background-white-ter" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a href="/welcome" class="navbar-item">
          <img class="navbar__logo navbar-brand" src="${huella}">
        </a>
        <a role="button" class="navbar-burger is-pulled-right	" aria-label="menu" aria-expanded="false" data-target="menubar">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu has-background-white-ter" id="menubar">
      <div class="navbar-start">
      <div class="navbar-item">
      <a href="/my-data" class="navbar-item">Mis datos</a>
      </div>
      </div>
      <div class="navbar-start">
        <div class="navbar-item">
        <a href="/my-pets" class="navbar-item">Mis mascotas reportadas</a>
        </div>
      </div>
      <div class="navbar-start">
        <div class="navbar-item">
          <a href="/pet-data" class="navbar-item">Reportar mascota</a>
          </div>
      </div>
      <div class="navbar-end navbar-item">
        <span>${cs.user?.email ? cs.user.email : ""}</span>
        <hr class="navbar-divider">
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
