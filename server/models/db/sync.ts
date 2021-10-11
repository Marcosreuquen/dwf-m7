import { sequelize } from "./connection";

const typeSync = { alter: true };

sequelize.sync(typeSync).then((res) => {
  console.log(`Connected! the sync is config on: ${typeSync}.`);
});
