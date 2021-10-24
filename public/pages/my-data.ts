import { Router } from "@vaadin/router";
import { state } from "../state";

class MyData extends HTMLElement {
  connectedCallback() {
    const cs = state.getState()
    cs.user.created? this.render(cs.user) : this.render();
  }
  render(userData?) {
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
  }
}
customElements.define("x-my-data", MyData);
