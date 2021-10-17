import { Pets } from "../models";

export const PetsController = {
  async newLostPet(data, user_id) {
    const { name, imgURL, lat, lng } = data;
    const pet = await Pets.create({
      name,
      lat,
      lng,
      state: true,
      imgURL,
      user_id,
    });
    return pet;
  },
  async updatePet(data, pet_id) {
    const { name, imgURL, lat, lng } = data;
    const pet = await Pets.findByPk(pet_id);
    const petUpdated = await pet.update({
      name,
      lat,
      lng,
      state: true,
      imgURL,
    });
    return petUpdated;
  },
  async findOne(id: number) {
    return await Pets.findByPk(id);
  },
};
