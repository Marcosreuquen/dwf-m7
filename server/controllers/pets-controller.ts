import { Pets } from "../models";

export const PetsController = {
  async newLostPet(data, userId) {
    const { name, imgURL, lat, lng } = data;
    const pet = await Pets.create({
      name,
      lat,
      lng,
      state: true,
      imgURL,
      userId,
    });
    return pet;
  },
  async updatePet(data, petId) {
    const { name, imgURL, lat, lng } = data;
    const pet = await Pets.findByPk(petId);
    const petUpdated = await pet.update({
      name,
      lat,
      lng,
      state: true,
      imgURL,
    });
    return petUpdated;
  },
  async deletePet(petId): Promise<boolean> {
    const pet = await Pets.findByPk(petId);
    const petUpdated = await pet.update({
      state: false,
    });
    return true;
  },
  async findOne(id: number) {
    return await Pets.findByPk(id);
  },
};
