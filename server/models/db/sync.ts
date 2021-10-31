import { sequelize } from "./connection";

const typeSync = { alter: true }; //alter/force

sequelize
  .sync(typeSync)
  .then((res) => {
    console.log(
      `Connected! the sync is config on: ${JSON.stringify(typeSync)}.`
    );
  })
  .catch((error) => {
    console.log(
      `Cannot connect with the sync is config on: ${JSON.stringify(
        typeSync
      )}.\t ${error}`
    );
  });
