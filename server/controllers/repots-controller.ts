import { Reports, User, Pets } from "../models";

export const ReportsController = {
  async sendReport(petId, userId, data) {
    const { name, tel, report } = data;
    const created = await Reports.create({
      name,
      tel,
      report,
      petId,
      userId,
    });
    const pet = await Pets.findByPk(petId, { include: [User] });
    return [created, pet];
  },
};
