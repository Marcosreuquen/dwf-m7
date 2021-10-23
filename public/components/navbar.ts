const huella = require("url:../assets/huella.png");
const burger = require("url:../assets/burger.png");

class NavBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addStyle() {
    const style = document.createElement("style");
    style.textContent = `
    .navbar {
      background-color: #FF6868;
      height: 60px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
    }
    .navbar__logo{
      width: 40px;
      height: 40px;
    }
    .navbar__burger{}
    .navbar__menu{
      display: none;
      height: 50vh;
      position: absolute;
      top: 0;
      right: 0;
      background-color: #FF6868ee;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 2;
      text-shadow: 0.2em 0.2em 0.2em #dbdbdb50;
      color: #333;
      font-size: 24px;
      font-weight: 700;
      border-radius: 16px;
    }
    .menu__links, .menu__session-options{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 10%;
    }
    .menu__links a {
      height: 38px;
    }
    .menu__links {
      height: 80%;
    }
    `;
    this.appendChild(style);
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
      <img class="navbar__logo" src="${huella}">
      <img class="navbar__burger" src="${burger}">
      <div class="navbar__menu">
        <ul class="menu__links">
          <a class="menu__link-selection">Mis datos</a>
          <a class="menu__link-selection">Mis mascotas reportadas</a>
          <a class="menu__link-selection">Reportar mascota</a>
        </ul>
        <footer class="menu__session-options">
          <label class="menu__email">email</label>
          <a class="menu__logout">CERRAR SESION</a>
        </footer>
      </div>
    </div>
    `;
    this.addStyle();
    this.addListeners();
  }
}
customElements.define("x-navbar", NavBar);
