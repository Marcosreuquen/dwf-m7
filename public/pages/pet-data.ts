import { Router } from "@vaadin/router";
import { state } from "../state";

class PetData extends HTMLElement {
  connectedCallback() {
    this.render({
      name: "nyme",
      imgURL: "",
      _geoloc: { lat: 1, lng: 2 },
      id: 1,
    });
  }
  render(pet?) {
    const type = pet ? "Editar" : "Reportar";

    this.innerHTML = `
      <div>
      <x-navbar></x-navbar>
      <form class="login">
        <x-text type="title" style="bold">${type} mascota perdida</x-text>
        <label>
        <span>NOMBRE</span>
        <input type="text" name="name" placeholder=${pet?.name}>
        </label>
        <label>
          <img src=${pet?.imgURL}>
          <x-button type="secondary">agregar/modificar foto</x-button>
        </label>
        <label>
          <map></map>
          <span>UBICACION</span>
          <input type="text">
        </label>
        <x-text type="body">BUSCÁ UUN PUNTO DE REFERENCIA PARA REPORTAR A TU MASCOTA. PUEDE SER UNA DIRECCIÓN, UN BARRIO O UNA CIUDAD</x-text>
        <x-button type="primary">${type}</x-button>
        <x-button type=${pet ? "cancel" : "secondary"}>${
      pet ? "Cancelar" : "Reportar como encontrado"
    }</x-button>
      </form>
    </div>
    `;
  }
}
customElements.define("x-pet-data", PetData);
