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
import { cloudinary, uploadImgToCloudinary } from "./lib/cloudinary";
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
//cors
import * as cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json({ limit: "100mb" }));
app.use(cors());
//---------------------------------------AUTH
app.get("/users/exist", checkBody, async (req, res) => {
  //crear un User y un Auth; y devuelve el User.
  //recibe en el body: {email, password, lat, lng }
  try {
    const { email } = req.query;

    const exist = await UserController.userExist(email);

    res.send({ email, exist });
  } catch (err) {
    res.send({ err });
  }
});

app.post("/auth", checkBody, getSHA256ofSTRING, async (req, res) => {
  //crear un User y un Auth; y devuelve el User.
  //recibe en el body: {email, password }
  try {
    const data = req.body;

    const { user, created } = await UserController.findOrCreate(data);
    const [auth, authCreated] = await AuthController.findOrCreate(
      user.get("id"),
      { email: data.email, password: req._SHA256Password }
    );
    res.send({ user, created });
  } catch (err) {
    res.send(err);
  }
});

app.post("/auth/token", checkBody, getSHA256ofSTRING, async (req, res) => {
  //SignIn - POST /auth/token (pedís token) Recibe: { email:string, password:string }
  //Este endpoint chequea en la tabla auth que esos datos concuerden con los guardados y genera un token con un objeto que tenga solo el id del user.
  const { email } = req.body;
  const auth = await AuthController.findOne(email, req._SHA256Password);
  const token = createToken(auth.get("userId"));

  if (auth) {
    res.send({ token });
  } else {
    res.send({ error: "Email or password incorrect." });
  }
});

app.get("/me", checkBody, middlewareToken, async (req, res) => {
  //Devuelve el usuario correspondiente a un token
  const { id } = req._user;
  try {
    const user = await UserController.findOne(id);
    res.send({ user });
  } catch (err) {
    res.send({ err });
  }
});

app.put("/me", checkBody, middlewareToken, async (req, res) => {
  //Devuelve el usuario correspondiente a un token
  const { id } = req._user;
  try {
    const user = await UserController.update(id, req.body);
    res.send({ user });
  } catch (err) {
    res.send({ err });
  }
});

app.get("/me/pets", checkBody, middlewareToken, async (req, res) => {
  //Devuelve el usuario correspondiente a un token
  const { id } = req._user;
  try {
    const myPets = await UserController.myPets(id);
    res.send({ myPets });
  } catch (err) {
    res.status(400).send({ err });
  }
});

//---------------------------------------PETS
app.post("/me/pets", checkBody, middlewareToken, async (req, res) => {
  // Verifica el token y crea una mascota como perdida. Carga imagen en cloudinary y el objeto en algolia.
  const { name, img, lat, lng } = req.body;
  try {
    const imgURL = await uploadImgToCloudinary(img);

    const petCreated = await PetsController.newLostPet(
      { name, lat, lng, imgURL },
      req._user.id
    );

    const algoliaRes = await pets_index_algolia.saveObject({
      objectID: petCreated.get("id"),
      name: petCreated.get("name"),
      imgURL,
      _geoloc: {
        lat: petCreated.get("lat"),
        lng: petCreated.get("lng"),
      },
    });
    res.send({ petCreated, algoliaRes });
  } catch (err) {
    res.send({ err });
  }
});

app.put("/me/pets", checkBody, middlewareToken, async (req, res) => {
  //Verifica el token, y modifica una mascota en db, algolia y cloudinary.
  const { name, img, lat, lng } = req.body;
  const { petId } = req.query;
  const imgURL = await uploadImgToCloudinary(img);

  try {
    const petUpdated = await PetsController.updatePet(
      { name, lat, lng, imgURL },
      petId
    );
    const algoliaRes = await pets_index_algolia.partialUpdateObject({
      objectID: petUpdated.get("id"),
      name: petUpdated.get("name"),
      imgURL,
      _geoloc: {
        lat: petUpdated.get("lat"),
        lng: petUpdated.get("lng"),
      },
    });
    res.send({ petUpdated, algoliaRes });
  } catch (err) {
    res.send({ err });
  }
});

app.get("/pets/around", async (req, res) => {
  //Busca en algolia mascotas perdidas cerca de un punto.
  const { lat, lng } = req.query;

  try {
    const { hits } = await pets_index_algolia.search("", {
      aroundLatLng: `${lat},${lng}`,
    });
    res.send(hits);
  } catch (err) {
    res.send(err);
  }
});

app.get("/pets", async (req, res) => {
  const { petId } = req.query;
  try {
    const pet = await PetsController.findOne(petId);
    res.send(pet);
  } catch (err) {
    res.send(err);
  }
});

app.delete("/me/pets", middlewareToken, async (req, res) => {
  //DELETE/me/pets -> Verifica el token y marca una mascota como encontrada (eliminada).
  const { petId } = req.query;
  try {
    const deletedPet = await PetsController.deletePet(petId);
    if (deletedPet) {
      res.send({ message: `Pet ${petId} has been deleted succesfully` });
    } else {
      res.send({ message: `Has been an error deleting pet: ${petId}` });
    }
  } catch (err) {
    res.send({ err });
  }
});

app.get("/me/reports", middlewareToken, async (req, res) => {
  //GET/me/reports -> Verifica el token y busca en Reports los reportes hechos por el user. recibe Auth bearer token.
  const id = req._user.id;
  try {
    const reports = await UserController.myReports(id);
    res.send({ reports });
  } catch (err) {
    res.send({ err });
  }
});

app.post("/pets/report", checkBody, middlewareToken, async (req, res) => {
  //POST/pets/report -> Verifica el token y reporta una mascota. Recbe Authorization bearer token + body:{name,tel,report}. Se requiere sendgrid.
  const { petId } = req.query;
  const userId = req._user.id;
  const data = req.body;
  try {
    const [created, pet] = await await ReportsController.sendReport(
      petId,
      userId,
      data
    );
    const sendedEmail = await sendEmail(
      pet.getDataValue("user").email,
      created.getDataValue("tel"),
      pet.getDataValue("name"),
      created.getDataValue("report")
    );

    res.send({ created, sendedEmail });
  } catch (err) {
    res.send({ err });
    console.log(err);
  }
});
//---------------------------------------STATICS

app.use(express.static(path.resolve(__dirname, "../../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../dist/index.html"));
});

//---------------------------------------LISTENER
app.listen(PORT, () => {
  console.log(
    `\x1b[1m \x1b[31m Server is running on port ${PORT}... \n  and the enviroment is ${process.env.ENVIROMENT}...\x1b[31m \x1b[37m`
  );
});
