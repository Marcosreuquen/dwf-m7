//`<x-pets img=${pet.imgURL} petId=${pet.objectID}>${pet.name}</x-pets>`;
class PetCard extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addStyle() {
    const style = document.createElement("style");
    style.textContent = `
    .pet-card{
      display: grid;
      grid-template-rows: 2fr 1fr;
      border: 2px solid #333;
      height: 234px;
      width: 335px;
      border-radius: 4px;
    }
    .pet-card__img{

    }
    .pet-card__body{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
    .pet-card__links{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    .pet-card__link{}
    `;
    this.appendChild(style);
  }
  addListener() {}
  render() {
    const name = this.textContent;
    const img = this.getAttribute("img");
    const id = this.getAttribute("petId");

    this.innerHTML = `
    <div class="pet-card">
      <img class="pet-card__img" src=${img}>
      <div class="pet-card__body">
        <x-text type="subtitle" style="bold">${name}</x-text>
        <ul class="pet-card__links">
          <a class="pet-card__link">REPORTAR</a>
          <a class="pet-card__link">INFORMACIÓN</a>
        </ul>
        </div>
    </div>
    `;
    this.addStyle();
    this.addListener();
  }
}
customElements.define("x-pet-card", PetCard);