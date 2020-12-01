const express = require("express");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
require("dotenv").config();
const cors = require("cors");

const cards = require("./modules/cards");

const checkJwt = jwt({
  //Provide signing key
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestPerMinute: 5,
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  //Validate audience
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

const app = express();
app.use(cors());

app.get("/public", (req, res) => {
  res.json({
    message: "Hello from public",
  });
});

app.get("/cards", checkJwt, (req, res) => {
  cards
    .getAllCards(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.send(result);
    });
});

app.listen(process.env.PORT);
console.log("API Server listening");
