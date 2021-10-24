import { state } from "../state";

class WelcomePage extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListenerGeoloc() {
    const cs = state.getState();
    this.querySelector("x-button").addEventListener("buttonClicked", (e) => {
      navigator.geolocation.getCurrentPosition(async (geo) => {
        const { latitude, longitude } = geo.coords;
        console.info({ lat: latitude, lng: longitude });
        cs.user._geoloc = { lat: latitude, lng: longitude };
        state.setState(cs);
        const pets = await (
          await state.getPetsAroundMe(cs.user._geoloc)
        ).json();
        console.log(pets);
        this.render(pets);
      });
    });
  }
  addListenerPetReport() {
    const pets = document.querySelectorAll("x-pet-card");
    for (const pet of pets) {
      pet.addEventListener("click", (e) => {
        this.reportPet({ name: "nyme" });
      });
    }
  }
  reportPet(pet) {
    const div = document.createElement("div");
    div.innerHTML = `
    <x-text type="title" style="bold">Reportar info de ${pet.name}</x-text>
    <form class="report-pet__form">
      <label class="report-pet__label">
        <span>TU NOMBRE</span>
        <input  class="report-pet__input" type="text" name="name">
      </label>
      <label class="report-pet__label">
        <span>TU TELEFONO</span>
        <input  class="report-pet__input" type="phone" name="tel">
      </label>
      <label class="report-pet__label">
        <span>¿DÓNDE LO VISTE?</span>
        <textarea class="report-pet__input" ></textarea>
      </label>
    </form>
    `;
    div.className = "report-pet";
    this.appendChild(div);
  }
  render(pets?) {
    if (!pets) {
      this.innerHTML = `
      <div>
      <x-navbar></x-navbar>
      <div class="welcome">
      <x-text type="title" style="bold">Mascotas perdidas cerca tuyo</x-text>
      <x-text type="subtitle" style="thin">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</x-text>
      <x-button type="primary">Dar mi ubicación</x-button>
      </div>
    </div>
    `;
      this.addListenerGeoloc();
    }
    if (pets) {
      const petsString = pets
        .map((pet) => {
          return `<x-pet-card img=${pet.imgURL} petId=${pet.objectID}>${pet.name}</x-pet-card>`;
        })
        .join("");
      this.innerHTML = `
      <div>
      <x-navbar></x-navbar>
      <div class="welcome">
      <x-text type="title" style="bold">Mascotas perdidas cerca tuyo</x-text>
      <div class="pets-container">
        ${petsString}
      </div>
      </div>
    </div>
    `;
      this.addListenerPetReport();
    }
  }
}
customElements.define("x-welcome", WelcomePage);
