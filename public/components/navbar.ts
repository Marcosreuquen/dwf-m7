const huella = require("url:../assets/huella.png");
const burger = require("url:../assets/burger.png");

class NavBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {
    const menu: any = this.querySelector(".navbar__menu");
    this.querySelector(".navbar__burger").addEventListener("click", (e) => {
      menu.style.display = "inherit";
    });
    menu.addEventListener("click", (e) => {
      menu.style.display = "none";
    });
  }
  render() {
    this.innerHTML = `
    <div class="navbar">
      <a href="/welcome">
        <img class="navbar__logo" src="${huella}">
      </a>
        <img class="navbar__burger" src="${burger}">
      <div class="navbar__menu">
        <div class="menu__box">
          <ul class="menu__links">
            <a class="menu__link-selection" href="/my-data">Mis datos</a>
            <a class="menu__link-selection" href="/my-pets">Mis mascotas reportadas</a>
            <a class="menu__link-selection" href="/pet-data">Reportar mascota</a>
          </ul>
          <footer class="menu__session-options">
            <label class="menu__email">email</label>
            <a class="menu__logout">CERRAR SESION</a>
          </footer>
        </div>
      </div>
    </div>
    `;
    this.addListeners();
  }
}
customElements.define("x-navbar", NavBar);
