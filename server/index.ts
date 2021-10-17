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
  //recibe en el body: {email, password, lat, lng }

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

app.put("/me", checkBody, middlewareToken, async (req, res) => {
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
    const myPets = await UserController.myPets(id);
    res.status(201).json(myPets);
  } catch (err) {
    res.status(401).json(err);
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
    _geoloc: {
      lat: petCreated.get("lat"),
      lng: petCreated.get("lng"),
    },
  });
    res.status(201).json(petCreated, algoliaRes);
  } catch (err) {
    res.json(err);
  }
});

app.put("/me/pets/:petId", checkBody, middlewareToken, async (req, res) => {
  //Verifica el token, y modifica una mascota en db, algolia y cloudinary.
  const { name, img, lat, lng } = req.body;
  const { id } = req.query;
  const imgURL = await uploadImgToCloudinary(img);

  try {
  const petUpdated = await PetsController.updatePet(
    { name, lat, lng, imgURL },
    id
  );
  const algoliaRes = await pets_index_algolia.partialUpdateObject({
    objectID: petUpdated.get("id"),
    name: petUpdated.get("name"),
    _geoloc: {
      lat: petUpdated.get("lat"),
      lng: petUpdated.get("lng"),
    },
  });
    res.status(201).json(petUpdated, algoliaRes);
  } catch (err) {
    res.json(err);
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

app.get("/pets/:petId", async (req, res) => {
  const { petId } = req.query;
  try {
  const pet = await PetsController.findOne(petId);
    res.status(200).json(pet);
  } catch (err) {
    res.json(err);
  }
});

app.delete("/me/pets/:petId", middlewareToken, async (req,res)=>{
  //DELETE/me/pets -> Verifica el token y marca una mascota como encontrada (eliminada).
  const {petId} = req.query;
  try{
  const deletedPet = await PetsController.deletePet(petId);
    if(deletedPet){
      res.status(200).json({message:`Pet ${petId} has been deleted succesfully`});
    }else{
      res.status(404).json({message: `Has been an error deleting pet: ${petId}`});
    }
  }catch(err){
    res.send(err);
  }
});

app.get("/me/reports", middlewareToken, async (req,res)=>{
  //GET/me/reports -> Verifica el token y busca en Reports los reportes hechos por el user. recibe Auth bearer token.
  const id = req._user.id;
  try{
  const reports = await UserController.myReports(id);
    res.status(200).json(reports);
  }catch(err){
    res.status(401).json(err)
  };
});

app.post("/pets/report/:petId", checkBody, middlewareToken, async (req,res)=>{
  //POST/pets/report -> Verifica el token y reporta una mascota. Recbe Authorization bearer token + body:{name,tel,report}. Se requiere sendgrid.
  const {petId} = req.query;
  const userId = req._user.id;
  const data = req.body;
  try{
    const created = (await ReportsController.sendReport(petId,userId,data)).get();
    const user = created.users;
    const pet = created.pets
    const sendedEmail = await sendEmail(user.email, created.tel, pet.name, created.report);
    
    res.status(200)
  }catch(err){
    res.send(401)
  };
});
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
