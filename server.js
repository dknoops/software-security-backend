const express = require("express");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
require("dotenv").config();
const cors = require("cors");
const { PORT = 8080 } = process.env;

const cards = require("./modules/cards");
const users = require("./modules/users");

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
app.use(express.json());
app.use(
  cors({
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);

app.get("/", (req, res) => {
  res.send("This is the backend api for my software security web application");
});

app.param("id", (req, res, next, id) => {
  req.id = id;
  next();
});

/* MIDDLEWARE */
const getUserID = (req, res, next) => {
  if (req.user) {
    users.getUserID(req.user).then((user_id) => {
      req.caller_id = user_id;
      next();
    });
  } else {
    res.status(403).end();
  }
};

const ownUser = (req, res, next) => {
  if (req.userId && req.userId === req.caller_id) {
    next();
  } else if (req.prodId) {
    products
      .getUser(req.prodId)
      .then((owner_id) => {
        if (owner_id === req.caller_id) {
          next();
        } else {
          res.status(403).end();
        }
      })
      .catch((err) => res.status(403).end());
  } else {
    res.status(403).end();
  }
};

const isOwnUserOrAdmin = (req, res, next) => {
  req.isAdmin = false;
  if (req.userId) {
    if (req.userId === req.caller_id) {
      req.isAdmin = true;
      next();
    } else {
      users.isAdmin(req.caller_id).then((isAdmin) => {
        req.isAdmin = isAdmin;
        next();
      });
    }
  } else if (req.prodId) {
    products
      .getUser(req.prodId)
      .then((product_user_id) => {
        req.isAdmin = product_user_id === req.caller_id;
        next();
      })
      .catch(() => res.status(404).end());
  } else {
    res.status(500).end();
  }
};

const isAdmin = (req, res, next) => {
  req.isAdmin = true;
  users.isAdmin(req.caller_id).then((isAdmin) => {
    req.isAdmin = isAdmin;
    next();
  });
};

/* USERS */
app.post("/users", checkJwt, (req, res) => {
  users
    .store(req.user, req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.status(400).end();
    });
});

app.get("/me", checkJwt, (req, res) => {
  users
    .me(req.user)
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.status(404).end();
    });
});

/* CARDS */
app.get("/cards", (req, res) => {
  cards
    .getAll()
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.send(result);
    });
});

app.get("/user-cards", checkJwt, getUserID, (req, res) => {
  cards
    .getByUser(req.caller_id)
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.send(result);
    });
});

app.get("/cards/:id", checkJwt, (req, res) => {
  cards
    .getById(req.id)
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.send(result);
    });
});

app.post("/cards", checkJwt, getUserID, (req, res) => {
  cards
    .store(req.body, req.caller_id)
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.status(400).end();
    });
});

app.put("/cards/:id", checkJwt, (req, res) => {
  cards
    .update(req.body, req.id)
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.status(400).end();
    });
});

app.delete("/cards/:id", checkJwt, (req, res) => {
  cards
    .destroy(req.id)
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.status(400).end();
    });
});

app.listen(process.env.PORT);
console.log("API Server listening");
