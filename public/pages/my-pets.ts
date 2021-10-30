import { Router } from "@vaadin/router";
import { state } from "../state";

class MyPets extends HTMLElement {
  connectedCallback() {
    state
      .getMyPets()
      .then((r) => {
        r.json((myPets) => {
          console.log(myPets);
          this.render(myPets);
        });
      })
      .catch(() => {
        this.render();
      });
  }
  render(pets?) {
    this.innerHTML = pets
      ? `
      <div>
      <x-navbar></x-navbar>
      <x-text type="title" style="bold">Mis mascotas reportadas</x-text>
      <div class="mypets">
        ${
          !pets
            ? `<x-text type="body">AUN NO REPORTASTE MASCOTAS PERDIDAS</x-text>`
            : pets.map((pet) => {
                return `<x-pet-card img=${pet.imgURL} petId=${pet.objectID}>${pet.name}</x-pet-card>`;
              })
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
  }
}
customElements.define("x-my-pets", MyPets);
