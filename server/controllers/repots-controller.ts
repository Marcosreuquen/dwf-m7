import { Reports } from "../models";

export const ReportsController = {
    async sendReport(pet_id, user_id, data){
        const {name, tel, report}=data;
        return await Reports.create({
            name, tel, report, pet_id, user_id
        })
    }
};
