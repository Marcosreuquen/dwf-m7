import { User } from "./users";
import { Pets } from "./pets";
import { Reports } from "./reports";
import { Auth } from "./auth";

User.hasOne(Auth);
Auth.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Pets);
Pets.belongsToMany(User, { through: "user_id" });

User.hasMany(Reports);
Reports.belongsTo(User, { foreignKey: "user_id" });

Pets.hasMany(Reports);
Reports.belongsTo(Pets, { foreignKey: "pet_id" });

export { User, Pets, Reports, Auth };
