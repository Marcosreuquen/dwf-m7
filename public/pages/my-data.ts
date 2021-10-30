import { Router } from "@vaadin/router";
import { state } from "../state";

class MyData extends HTMLElement {
  connectedCallback() {
    const cs = state.getState();
    cs.user ? this.render(cs.user) : Router.go("login");
  }
  render(userData?) {
    this.innerHTML = `
      <div class="my-data">
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

    if (userData) {
      const loginForm: any = this.querySelector(".login");
      loginForm.name.value = userData.name;
    }

    const formLogin = this.addEventListener("submit", async (e: any) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const value = Object.fromEntries(data.entries());
      const update = await state.updateUser(value);

      console.log(update);
    });
  }
}
customElements.define("x-my-data", MyData);
