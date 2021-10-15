import { Pets, User } from "../models";

export const UserController = {
  async getAll() {
    return await User.findAll();
  },
  async findOrCreate(data) {
    const { name, email, lat, lng } = data;
    const [user, created] = await User.findOrCreate({
      where: { email: data.email },
      defaults: {
        name,
        email,
        lat,
        lng,
        state: true,
      },
    });
    return { user, created };
  },
  async findOne(id: number) {
    return await User.findByPk(id);
  },
  async update(id: number, newData: any) {
    const { name, email, lat, lng } = newData;
    const user = await User.findByPk(id);
    return await user.update({ name, email, lat, lng });
  },
  async myPets(id) {
    return await (await User.findByPk(id, { include: [Pets] })).get("pets");
  },
};
