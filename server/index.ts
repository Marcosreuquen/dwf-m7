//Enviroment
import "./enviroment";
//Connection
import "./models/db/connection";
import "./models/db/sync";
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

//---------------------------------------API TESTER
app.get("/test", async (req, res) => {
  //endpoint de test
  const allUsers = await UserController.getAll();
  res.json(allUsers);
});

//---------------------------------------AUTH
app.post("/auth", checkBody, getSHA256ofSTRING, async (req, res) => {
  //crear un User y un Auth; y devuelve el User.
  //recibe en el body: {email, password, lat, lng, state}

  const data = req.body;
  const { user, created } = await UserController.findOrCreate(data);
  const [auth, authCreated] = await AuthController.findOrCreate(
    user.get("id"),
    { email: data.email, password: req._SHA256Password }
  );
  res.status(201).json(user);
});

app.post("/auth/token", checkBody, getSHA256ofSTRING, async (req, res) => {
  //SignIn - POST /auth/token (pedís token) Recibe: { email:string, password:string }
  //Este endpoint chequea en la tabla auth que esos datos concuerden con los guardados y genera un token con un objeto que tenga solo el id del user.
  const { email } = req.body;
  const auth = await AuthController.findOne(email, req._SHA256Password);
  console.log(auth);
  const token = createToken(auth.get("user_id"));

  if (auth) {
    res.json({ token });
  } else {
    res.status(400).json({ error: "Email or password incorrect." });
  }
});

app.get("/me", checkBody, middlewareToken, async (req, res) => {
  //Devuelve el usuario correspondiente a un token
  const id = req._user.id;
  try {
    const user = await UserController.findOne(req._user.id);
    res.status(201).json(user);
  } catch (err) {
    res.status(401).json(err);
  }
});

app.post("/me", checkBody, middlewareToken, async (req, res) => {
  //Devuelve el usuario correspondiente a un token
  const id = req._user.id;
  try {
    const user = await UserController.update(id, req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(401).json(err);
  }
});

app.get("/me/pets", checkBody, middlewareToken, async (req, res) => {
  //Devuelve el usuario correspondiente a un token
  const id = req._user.id;
  try {
    const user = await UserController.myPets(id);
    res.status(201).json(user);
  } catch (err) {
    res.status(401).json(err);
  }
});

//---------------------------------------AUTH

//---------------------------------------STATICS
app.use(express.static(path.resolve(__dirname, "../fe-dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../fe-dist/index.html"));
});

//---------------------------------------LISTENER
app.listen(PORT, () => {
  console.log(
    `\x1b[1m \x1b[31m Server is running on port ${PORT}... \n  and the enviroment is ${process.env.ENVIROMENT}...\x1b[31m \x1b[37m`
  );
});
