import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import * as bearerToken from "bearer-token";

export async function checkBody(req, res, next) {
  //check if req contains a body
  if (req.body) {
    next();
  } else {
    res.status(401).send("Missing body");
  }
}

export async function checkId(req, res, next) {
  //Check if req.query contains an id
  const { id } = req.query;
  if (id) {
    next();
  } else {
    res.status(401).send("Missing propertys on body");
  }
}

export async function middlewareToken(req, res, next) {
  //check if the token received was signed with Secret key
  console.log(req.headers);
  bearerToken(req, async (err, token) => {
    if (token) {
      try {
        req._user = jwt.verify(token, process.env.SECRET);
        next();
      } catch (err) {
        res.status(401).json(err);
      }
    } else {
      res.status(401).json(err);
    }
  });
}

export function getSHA256ofSTRING(req, res, next) {
  //create a hash "sha256" from an input (password)
  const { password } = req.body;
  req._SHA256Password = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  next();
}

export function createToken(id) {
  //create a signed token from id with Secret key
  return jwt.sign({ id }, process.env.SECRET);
}
