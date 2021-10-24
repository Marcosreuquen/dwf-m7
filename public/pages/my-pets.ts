import { Router } from "@vaadin/router";
import { state } from "../state";

class MyPets extends HTMLElement {
  connectedCallback() {
    this.render([
      {
        name: "nyme",
        imgURL:
          "https://hips.hearstapps.com/es.h-cdn.co/mcres/images/mi-casa/terraza-jardines-porche/cuidados-gatos-lactantes/1471229-1-esl-ES/me-he-encontrado-un-gatito-que-hago.jpg",
        _geoloc: { lat: 1, lng: 2 },
        id: 1,
      },
      {
        name: "nyme",
        imgURL: "",
        _geoloc: { lat: 1, lng: 2 },
        id: 1,
      },
      {
        name: "nyme",
        imgURL: "",
        _geoloc: { lat: 1, lng: 2 },
        id: 1,
      },
    ]);
  }
  render(pets?) {
    this.innerHTML = `
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
    `;
  }
}
customElements.define("x-my-pets", MyPets);
