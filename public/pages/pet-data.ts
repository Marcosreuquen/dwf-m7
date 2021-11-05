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
  render(pet?) {
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
          <img class="imgUrlPet" name="imgURL" src=${missingImg} crossorigin="anonymous">
          <x-button type="secondary" id="buttonImg">agregar/modificar foto</x-button>
        </label>
        <label class="label">
          <span>UBICACION</span>
          <x-text type="body">BUSCÁ UN PUNTO DE REFERENCIA PARA REPORTAR A TU MASCOTA. PUEDE SER UNA DIRECCIÓN, UN BARRIO O UNA CIUDAD</x-text>
          <div id="map" style="width: 335px; height: 335px"></div>
          <input type="text" name="geoloc" class="search-geoloc">
        </label>
        <x-button class="submit" type="primary">${type}</x-button>
        <x-button type=${pet ? "secondary" : "cancel"} class=${
      pet ? "finded" : "finded"
    }>${pet ? "Reportar como encontrado" : "Cancelar"}</x-button>
      </form>
    </div>
    `;
    const pic = this.querySelector(".imgUrlPet");
    const petDataForm: any = this.querySelector(".pet-data");
    const buttonImg = this.querySelector("#buttonImg");

    if (pet) {
      //inserta los datos de la mascota en el formulario
      petDataForm.name.value = pet.name;
      pic.setAttribute("src", pet.imgURL);
      petDataForm.geoloc.value = `${pet.lat},${pet.lng}`;
    }

    //inicializa el mapa
    pet ? mapping([pet.lat, pet.lng]) : mapping();
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
        });
        Swal.fire({ icon: "success" });
      }
      if (type == "Reportar") {
        //Crea la mascota
        state.createPet({
          name: petDataForm.name.value,
          imgURL: petDataForm.imgURL.getAttribute("src"),
        });
        Swal.fire({ icon: "success" });
      }
      console.log();
    });
    this.querySelector(".cancel")?.addEventListener("buttonClicked", (e) => {
      //limpiar formulario
      const petDataForm: any = this.querySelector(".pet-data");
      petDataForm.reset();
    });
    this.querySelector(".finded")?.addEventListener("buttonClicked", (e) => {
      //enviar al servidor que se encontró a la
      state.findedPet(pet.id);
      Swal.fire({ icon: "success", title: "Nos alegra mucho!" });
      const petDataForm: any = this.querySelector(".pet-data");
      state.data.petData = {};
      petDataForm.reset();
    });
  }
}
customElements.define("x-pet-data", PetData);
