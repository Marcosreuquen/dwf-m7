import { Router } from "@vaadin/router";
import { state } from "../state";

class Login extends HTMLElement {
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
        <x-text type="title" style="bold">Ingresar</x-text>
        <label>
        <span>EMAIL</span>
        <input type="email" name="email">
        </label>
        <x-button type="primary">Siguiente</x-button>
      </form>
    </div>
    `;
    this.querySelector(".login").addEventListener("submit", (e:any) => {
      e.preventDefault();
      this.renderPass(e.target.email.value);
    });
    this.addStyle();
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
    this.querySelector(".login").addEventListener("submit", async (e:any) => {
      e.preventDefault();
      const userData = { email, password: e.target.password.value }
      await state.createOrFindUser(userData).then((res)=>{
        Router.go("/my-data");

      })
    });
    this.addStyle();
  }
}
customElements.define("x-login", Login);
