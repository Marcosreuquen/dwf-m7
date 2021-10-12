import { User } from "../models";

export const UserController = {
  async getAll() {
    return await User.findAll();
  },
  async findOrCreate(data) {
    const { email, lat, lng, state } = data;
    const [user, created] = await User.findOrCreate({
      where: { email: data.email },
      defaults: {
        email,
        lat,
        lng,
        state,
      },
    });
    return { user, created };
  },
  async findOne(id: number) {
    return await User.findByPk(id);
  },
};
