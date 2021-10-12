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
  async findOrCreate(user_id, data: { email: string; password: string }) {
    const { email, password } = data;
    try {
      const [auth, authCreated] = await Auth.findOrCreate({
        where: { user_id: user_id },
        defaults: {
          email: email,
          password: password,
          user_id: user_id,
        },
      });
      return [auth, authCreated];
    } catch (err) {
      console.error(err);
    }
  },
};
