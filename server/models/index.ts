import { User } from "./users";
import { Pets } from "./pets";
import { Reports } from "./reports";
import { Auth } from "./auth";

User.hasOne(Auth);
Auth.belongsTo(User);

User.hasMany(Pets);
Pets.belongsTo(User);

User.hasMany(Reports);
Reports.belongsTo(User);

Pets.hasMany(Reports);
Reports.belongsTo(Pets);

export { User, Pets, Reports, Auth };
