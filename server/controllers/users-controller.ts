import { Pets, Reports, User } from "../models";

export const UserController = {
  async getAll() {
    return await User.findAll();
  },
  async findOrCreate(data) {
    const { name, email } = data;
    const [user, created] = await User.findOrCreate({
      where: { email: data.email },
      defaults: {
        name,
        email,
        state: true,
      },
    });
    return { user, created };
  },
  async findOne(id: number) {
    return await User.findByPk(id);
  },
  async update(id: number, newData: any) {
    const { name, email } = newData;
    const user = await User.findByPk(id);
    return await user.update({ name, email });
  },
  async myPets(id) {
    try {
      const pets = await (
        await User.findByPk(id, {
          include: [{ model: Pets, where: { state: true } }],
        })
      ).get("pets");
      if (pets) {
        return pets;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  },
  async myReports(id) {
    return await (
      await User.findByPk(id, { include: [Reports] })
    ).get("reports");
  },
  async userExist(email: string) {
    const user = await User.findOne({ where: { email } });
    return user ? true : false;
  },
};
