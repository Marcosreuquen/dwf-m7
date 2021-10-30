const BASE_URL_API = "http://localhost:8080";

export const state = {
  data: {
    petData: {},
  },
  listeners: [], // los callbacks
  init() {
    const cs = JSON.parse(localStorage.getItem("data")) || {
      user: {},
      petData: {},
    };
    this.setState(cs);
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    // modifica this.data (el state) e invoca los callbacks
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    console.log(this.data);
    localStorage.setItem("data", JSON.stringify(newState));
  },
  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
  },
  async getPetsAroundMe() {
    const { lat, lng } = this.getState()._geoloc;
    return await fetch(`${BASE_URL_API}/pets/around?lat=${lat}&lng=${lng}`);
  },
  async createOrFindUser(userData: { email: string; password: string }) {
    const { user, created } = await (
      await fetch(BASE_URL_API + "/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
    ).json();
    const cs = this.getState();
    cs.user = user;
    cs.user.created = created;
    this.setState(cs);
    this.getToken(userData.email, userData.password);
  },
  async getToken(email, password) {
    // "/auth/token"
    const cs = this.getState();
    const token = await (
      await fetch(BASE_URL_API + "/auth/token", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    cs.user.token = token.token;
    return true;
  },
  async updateUser(data) {
    const cs = this.getState();
    const updated = await await fetch(BASE_URL_API + "/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${cs.user.token}`,
      },
      body: JSON.stringify(data),
    });
    return updated;
  },
  async checkMail(email: string) {
    return await (
      await fetch(BASE_URL_API + "/users/exist?email=" + email)
    ).json();
  },
  saveMail(email: string) {
    const cs = this.getState();
    cs.user = { email };
    this.setState(cs);
  },
  async sendReport(report) {
    const cs = this.getState();
    return await (
      await fetch(BASE_URL_API + `/pets/report?petId=${report.petId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${cs.user.token}`,
        },
        body: JSON.stringify(report),
      })
    ).json();
  },
  async getReports() {
    const cs = this.getState();
    return await (
      await fetch(BASE_URL_API + `/me/report`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${cs.user.token}`,
        },
      })
    ).json();
  },
  async getMyPets() {
    const cs = this.getState();
    const myPets = await (
      await fetch(BASE_URL_API + `/me/pets`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${cs.user.token}`,
        },
      })
    ).json();
    cs.myPets = myPets;
    this.setState(cs);
    return myPets;
  },
  async logout() {
    const cs = this.getState();
    cs.user = {};
    this.setState(cs);
  },
  async getPetData() {
    const cs = this.getState();
    cs.petData = await (
      await fetch(`${BASE_URL_API}/pets?petId=${cs.petData.id}`)
    ).json();
    this.setState(cs);
  },
  setPetData(petData) {
    const cs = this.getState();
    cs.petData = petData;
    this.setState(cs);
  },
  async editPet({ id, name, imgURL, _geoloc }) {},
  async createPet({ name, imgURL, _geoloc }) {},
  async findedPet(id) {},
};
