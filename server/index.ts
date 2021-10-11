require("dotenv").config();
//packages
import * as express from "express";
import * as path from "path";
//controllers
import { UserController } from "./controllers/users-controller";
import { PetsController } from "./controllers/pets-controller";
import { ReportsController } from "./controllers/repots-controller";
import { AuthController } from "./controllers/auths-controller";
//libs
import { cloudinary } from "./lib/cloudinary";
import { pets_index_algolia, users_index_algolia } from "./lib/algolia";
import { sendEmail } from "./lib/sendgrid";
//middlewares
import {
  checkBody,
  checkId,
  createToken,
  getSHA256ofSTRING,
  middlewareToken,
} from "./middlewares";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json({ limit: "100mb" }));

app.get("/test", async (req, res) => {
  res.json("ok");
});

app.use(express.static(path.resolve(__dirname, "../fe-dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../fe-dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
