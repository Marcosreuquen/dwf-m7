import { Router } from "@vaadin/router";
import { state } from "../state";

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
    const form = this.querySelector(".login");
    form
      .querySelector("x-button")
      .addEventListener("buttonClicked", async (e) => {
        console.log(e, form.email.value);
        const { exist } = await state.checkMail(form.email.value);
        if (exist) {
          this.renderPass(form.email.value);
        } else {
          (() => {
            state.saveMail(form.email.value);
            Router.go("/my-data");
          })();
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

    const form = this.querySelector(".login");
    form
      .querySelector("x-button")
      .addEventListener("buttonClicked", async (e: any) => {
        e.preventDefault();
        const userData = { email, password: form.password.value };
        await state.createOrFindUser(userData).then((res) => {
          Router.go("/my-data");
        });
      });
  }
}
customElements.define("x-login", Login);
