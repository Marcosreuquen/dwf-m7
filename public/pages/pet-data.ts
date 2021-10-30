import { Router } from "@vaadin/router";
import { state } from "../state";
import { mapping } from "../utils/mapbox";
import { Dropzone } from "dropzone";

class PetData extends HTMLElement {
  async connectedCallback() {
    const { petData } = state.getState();
    if (petData.id) {
      const petData = await state.getPetData();
      this.render(petData);
    } else {
      this.render();
    }
  }
  render(pet?) {
    const type = pet ? "Editar" : "Reportar";

    this.innerHTML = `
      <div>
      <x-navbar></x-navbar>
      <form class="pet-data">
        <x-text type="title" style="bold">${type} mascota perdida</x-text>
        <label>
        <span>NOMBRE</span>
        <input type="text" name="name" placeholder=${pet?.name}>
        </label>
        <label id="img">
          <img class="imgUrlPet" name="imgURL">
          <x-button type="secondary" id="buttonImg">agregar/modificar foto</x-button>
        </label>
        <label>
          <span>UBICACION</span>
          <div id="map" style="width: 335px; height: 335px"></div>
          <input type="text" name="geoloc" class="search-geoloc">
        </label>
        <x-text type="body">BUSCÁ UN PUNTO DE REFERENCIA PARA REPORTAR A TU MASCOTA. PUEDE SER UNA DIRECCIÓN, UN BARRIO O UNA CIUDAD</x-text>
        <x-button class="submit" type="primary">${type}</x-button>
        <x-button type=${pet ? "cancel" : "secondary"} class=${
      pet ? "cancel" : "finded"
    }>${pet ? "Cancelar" : "Reportar como encontrado"}</x-button>
      </form>
    </div>
    `;
    if (pet) {
      const petDataForm: any = this.querySelector(".pet-data");
      petDataForm.name.value = pet.name;
      petDataForm.querySelector(".imgUrlPet").src = pet.imgURL;
      petDataForm.geoloc.value = `${pet._geoloc.lat},${pet._geoloc.lat}`;
    }
    const buttonImg = this.querySelector("#buttonImg");
    mapping();
    const pic = this.querySelector(".imgUrlPet");
    // la url la exige la librería
    const myDropzone = new Dropzone(pic, {
      url: "/falsa",
      autoProcessQueue: false,
      // previewTemplate: document.querySelector("#img").innerHTML,
      clickable: true,
      clickeableElements: buttonImg,
      thumbnail: function (file, dataUrl) {
        // Display the image in your file.previewElement
        pic.setAttribute("src", dataUrl);
      },
      init: function () {
        buttonImg.addEventListener("buttonClicked", (e) => {
          console.log("dropzone iniciando", this, e);
          this.processQueue();
        });
      },
    });

    this.querySelector(".submit").addEventListener("buttonClicked", (e) => {
      const petDataForm: any = this.querySelector(".pet-data");
      if (type == "Editar") {
        state.editPet({
          id: pet.id,
          name: petDataForm.name.value,
          imgURL: petDataForm.imgURL.src,
          _geoloc: petDataForm.geoloc.value,
        });
      }
      if (type == "Reportar") {
        state.createPet({
          name: petDataForm.name.value,
          imgURL: petDataForm.imgURL.src,
          _geoloc: petDataForm.geoloc.value,
        });
      }
      console.log();
    });
    this.querySelector(".cancel").addEventListener("buttonClicked", (e) => {
      //limpiar formulario
    });
    this.querySelector(".finded").addEventListener("buttonClicked", (e) => {
      //enviar al servidor que se encontró a la
      state.findedPet(pet.id);
    });
  }
}
customElements.define("x-pet-data", PetData);
