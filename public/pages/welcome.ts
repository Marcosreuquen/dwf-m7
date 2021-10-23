import { state } from "../state";

class WelcomePage extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addStyle() {
    const styles = document.createElement("style");
    styles.textContent = `
    .welcome{
      padding: 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 100%;
    }
    `;
    this.appendChild(styles);
  }
  addListener() {
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
      });
    });
  }
  render() {
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
    this.addStyle();
    this.addListener();
  }
}
customElements.define("x-welcome", WelcomePage);
