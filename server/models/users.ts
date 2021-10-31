import { Model, DataTypes } from "sequelize";
import { sequelize } from "./db/connection";

export class User extends Model {}
User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    state: DataTypes.BOOLEAN,
  },
  { sequelize, modelName: "user" }
);
