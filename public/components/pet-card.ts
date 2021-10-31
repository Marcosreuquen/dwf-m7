//`<x-pets img=${pet.imgURL} petId=${pet.objectID}>${pet.name}</x-pets>`;
class PetCard extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addStyle() {
    const style = document.createElement("style");
    style.textContent = `
    .pet-card__img{
      width: 335px;
      height: 335px;
      object-fit: cover;
    }
    .pet-card{
      max-width: 335px;
    }
    `;
    this.appendChild(style);
  }
  addListener(id) {
    this.querySelector(".report").addEventListener("click", (e) => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent("report-pet", { detail: { id } }));
    });
  }
  render() {
    const name = this.textContent;
    const img = this.getAttribute("img");
    const id = this.getAttribute("petId");

    this.innerHTML = `
    <div class="pet-card card">
      <img class="pet-card__img card-image" src=${img} crossorigin="anonymous">
      <div class="pet-card__body card-content">
        <x-text type="subtitle" style="bold">${name}</x-text>
        <ul class="pet-card__links">
          <a class="pet-card__link report">REPORTAR INFORMACIÓN</a>
        </ul>
        </div>
    </div>
    `;
    this.addStyle();
    this.addListener(id);
  }
}
customElements.define("x-pet-card", PetCard);
