import { Model, DataTypes } from "sequelize";
import { sequelize } from "./db/connection";

export class Pets extends Model {}
Pets.init(
  {
    name: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    state: DataTypes.BOOLEAN,
    imgURL: DataTypes.STRING,
  },
  { sequelize, modelName: "pet" }
);
