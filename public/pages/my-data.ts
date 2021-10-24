import { Router } from "@vaadin/router";
import { state } from "../state";

class MyData extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addStyle() {
    const styles = document.createElement("style");
    styles.textContent = `
    .login{
      padding: 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 100%;
    }
    `;
    this.appendChild(styles);
  }
  render() {
    this.innerHTML = `
      <div>
      <x-navbar></x-navbar>
      <form class="login">
        <x-text type="title" style="bold">Mis datos</x-text>
        <label>
        <span>NOMBRE</span>
        <input type="text" name="name">
        </label>
        <label>
        <span>CONTRASEÑA</span>
        <input type="password" name="password">
        </label>
        <label>
        <span>REPETIR CONTRASEÑA</span>
        <input type="password" name="repeated-password">
        </label>
        <x-button type="primary">Guardar</x-button>
      </form>
    </div>
    `;

    this.addStyle();
  }
}
customElements.define("x-my-data", MyData);
