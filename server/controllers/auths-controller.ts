import { Auth } from "../models";

export const AuthController = {
  async findOne(email: string, password: string) {
    try {
      return await Auth.findOne({
        where: { email, password },
      });
    } catch (err) {
      console.error(err);
    }
  },
  async findOrCreate(userId, data: { email: string; password: string }) {
    const { email, password } = data;
    try {
      const [auth, authCreated] = await Auth.findOrCreate({
        where: { userId },
        defaults: {
          email,
          password,
          userId,
        },
      });
      return [auth, authCreated];
    } catch (err) {
      console.error(err);
    }
  },
};
