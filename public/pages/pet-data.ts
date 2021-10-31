import { Router } from "@vaadin/router";
import { state } from "../state";
import { mapping } from "../utils/mapbox";
import { dropzonedImg } from "../utils/dropzone";
import Swal from "sweetalert2";
const missingImg = require("url:../assets/missingimg.png");

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
  async render(pet?) {
    const type = pet ? "Editar" : "Reportar";

    this.innerHTML = `
      <div>
      <x-navbar></x-navbar>
      <form class="pet-data card">
        <x-text type="title" style="bold">${type} mascota perdida</x-text>
        <label class="label">
        <span>NOMBRE</span>
        <input type="text" name="name" class="is-success">
        </label>
        <label class="label" id="img">
          <img class="imgUrlPet" name="imgURL" src=${missingImg}>
          <x-button type="secondary" id="buttonImg">agregar/modificar foto</x-button>
        </label>
        <label class="label">
          <span>UBICACION</span>
          <x-text type="body">BUSCÁ UN PUNTO DE REFERENCIA PARA REPORTAR A TU MASCOTA. PUEDE SER UNA DIRECCIÓN, UN BARRIO O UNA CIUDAD</x-text>
          <div id="map" style="width: 335px; height: 335px"></div>
          <input type="text" name="geoloc" class="search-geoloc">
        </label>
        <x-button class="submit" type="primary">${type}</x-button>
        <x-button type=${pet ? "cancel" : "secondary"} class=${
      pet ? "cancel" : "finded"
    }>${pet ? "Cancelar" : "Reportar como encontrado"}</x-button>
      </form>
    </div>
    `;
    if (pet) {
      //inserta los datos de la mascota en el formulario
      const petDataForm: any = this.querySelector(".pet-data");
      petDataForm.name.value = pet.name;
      petDataForm.querySelector(".imgUrlPet").src = pet.imgURL;
      petDataForm.geoloc.value = `${pet._geoloc.lat},${pet._geoloc.lat}`;
    }
    const buttonImg = this.querySelector("#buttonImg");
    const pic = this.querySelector(".imgUrlPet");

    //inicializa el mapa
    mapping();
    //inicializa dropzone
    dropzonedImg(pic, buttonImg);

    this.querySelector(".submit").addEventListener("buttonClicked", (e) => {
      const petDataForm: any = this.querySelector(".pet-data");
      if (type == "Editar") {
        //Edita la mascota
        state.editPet({
          id: pet.id,
          name: petDataForm.name.value,
          imgURL: petDataForm.imgURL.getAttribute("src"),
          _geoloc: petDataForm.geoloc.value,
        });
        Swal.fire({ icon: "success" });
      }
      if (type == "Reportar") {
        //Crea la mascota
        state.createPet({
          name: petDataForm.name.value,
          imgURL: petDataForm.imgURL.getAttribute("src"),
          _geoloc: petDataForm.geoloc.value,
        });
        Swal.fire({ icon: "success" });
      }
      console.log();
    });
    this.querySelector(".cancel").addEventListener("buttonClicked", (e) => {
      //limpiar formulario
      const petDataForm: any = this.querySelector(".pet-data");
      petDataForm.reset();
    });
    this.querySelector(".finded").addEventListener("buttonClicked", (e) => {
      //enviar al servidor que se encontró a la
      state.findedPet(pet.id);
      Swal.fire({ icon: "success", title: "Nos alegra mucho!" });
      const petDataForm: any = this.querySelector(".pet-data");
      petDataForm.reset();
    });
  }
}
customElements.define("x-pet-data", PetData);
