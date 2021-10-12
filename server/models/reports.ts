import { Model, DataTypes } from "sequelize";
import { sequelize } from "./db/connection";

export class Reports extends Model {}
Reports.init(
  {
    name: DataTypes.STRING,
    tel: DataTypes.INTEGER,
    report: DataTypes.TEXT,
  },
  { sequelize, modelName: "report" }
);
