import { Router } from "@vaadin/router";
import { state } from "../state";
import * as map from "lodash/map";
class MyPets extends HTMLElement {
  async connectedCallback() {
    const { token } = state.getState().user;
    if (token) {
      const { myPets } = await state.getMyPets();
      if (myPets) {
        myPets.length > 0 ? this.render(myPets) : this.render();
      } else {
        this.render();
      }
    } else {
      Router.go("/login");
    }
  }
  addListener(container?) {
    console.log(container);
    map(container, (pet) => {
      pet.addEventListener("report-pet", async (e) => {
        const { id } = e.detail;
        state.setPetData({ id: parseInt(id) });
        Router.go("pet-data");
      });
    });
  }
  render(pets?) {
    this.innerHTML = pets
      ? `
      <div>
      <x-navbar></x-navbar>
      <x-text type="title" style="bold">Mis mascotas reportadas</x-text>
      <div class="pets-container">
        ${
          !pets
            ? `<x-text type="body">AUN NO REPORTASTE MASCOTAS PERDIDAS</x-text>`
            : map(pets, (pet) => {
                return `<x-pet-card img=${pet.imgURL} petId=${pet.id}>${pet.name}</x-pet-card>`;
              }).join("")
        }
      </div>
      </div>
    `
      : `
    <div>
      <x-navbar></x-navbar>
      <x-text type="title" style="bold">Mis mascotas reportadas</x-text>
      <x-text type="subtitle">Aun no reportaste mascotas perdidas</x-text>
    </div>
    `;
    this.addListener(this.querySelectorAll("x-pet-card"));
  }
}
customElements.define("x-my-pets", MyPets);
