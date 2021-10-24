export const state = {
  data: {
    user: {},
  },
  listeners: [], // los callbacks
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
  },
  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
  },
  async getPetsAroundMe(_geoloc: { lat; lng }) {
    return await fetch(
      `http://localhost:8080/pets/around?lat=${_geoloc.lat}&lng=${_geoloc.lng}`
    );
  },
  async createOrFindUser(userData:{email:string, password:string}){
    const {user, created} = await (await fetch("/auth", { 
      method: "POST", 
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })).json();
    const cs = this.getState();
    cs.user = user;
    cs.user.created = created;
    this.setState(cs)
  }
};
