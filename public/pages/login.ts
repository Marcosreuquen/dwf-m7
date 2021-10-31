import { Router } from "@vaadin/router";
import { state } from "../state";
import Swal from "sweetalert2";
class Login extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
      <div>
      <x-navbar></x-navbar>
      <form class="login">
        <x-text type="title" style="bold">Ingresar</x-text>
        <label>
        <span>EMAIL</span>
        <input type="email" name="email">
        </label>
        <x-button type="primary">Siguiente</x-button>
      </form>
    </div>
    `;
    const form: any = this.querySelector(".login");
    form
      .querySelector("x-button")
      .addEventListener("buttonClicked", async (e) => {
        const email = form.email.value;
        const { exist } = await state.checkMail(email);
        try {
          if (exist == true) {
            this.renderPass(email);
          }
          if (exist == false) {
            console.log("exist is:", exist, Router);
            state.saveMail(email);
            Router.go("/my-data");
          }
        } catch (error) {
          console.error(error);
        }
      });
  }
  renderPass(email) {
    console.log(email);
    this.innerHTML = `
    <div>
    <x-navbar></x-navbar>
    <form class="login">
      <x-text type="title" style="bold">Ingresar</x-text>
      <label>
      <span>CONTRASEÑA</span>
      <input type="password" name="password">
      </label>
      <x-button type="primary">Ingresar</x-button>
    </form>
    </div>
    `;

    const form: any = this.querySelector(".login");
    form
      .querySelector("x-button")
      .addEventListener("buttonClicked", async (e: any) => {
        e.preventDefault();
        const userData = { email, password: form.password.value };
        await state.createOrFindUser(userData).then((res) => {
          Swal.fire({
            icon: "success",
            title: "Bienvenidx!",
          });
          Router.go("/my-data");
        });
      });
  }
}
customElements.define("x-login", Login);
