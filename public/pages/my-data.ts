import { Router } from "@vaadin/router";
import { state } from "../state";
import Swal from "sweetalert2";

class MyData extends HTMLElement {
  connectedCallback() {
    const cs = state.getState();
    const { email } = state.getState().user;
    if (email) {
      this.render(cs.user);
    } else {
      Router.go("/login");
    }
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
        <input type="password" name="password" class="password">
        </label>
        <label>
        <span>REPETIR CONTRASEÑA</span>
        <input type="password" name="repeatedPassword" class="password">
        </label>
        <x-button type="primary">Guardar</x-button>
      </form>
    </div>
    `;
    const submit = this.querySelector("x-button");
    const loginForm: any = this.querySelector(".login");
    if (userData.token) {
      loginForm.name.value = userData.name;

      submit.addEventListener("buttonClicked", async (e: any) => {
        const data = new FormData(loginForm);
        const value = Object.fromEntries(data.entries());
        const update = await state.updateUser(value);
        Swal.fire({
          icon: "success",
        });
      });
    } else {
      submit.addEventListener("buttonClicked", async (e: any) => {
        const name = loginForm.name.value;
        const email = state.getState().user.email;
        const password = loginForm.password.value;
        const repeatedPassword = loginForm.repeatedPassword.value;

        if (password === repeatedPassword) {
          try {
            await state.createOrFindUser({
              email,
              password,
            });
            await state.updateUser({ name });
            Swal.fire({
              icon: "success",
              title: "Bienvenidx!",
            });
          } catch (err) {
            console.error(err);
          }
        } else {
          Swal.fire("Verificar las contraseñas. No son iguales.");
        }
      });
    }
  }
}
customElements.define("x-my-data", MyData);
