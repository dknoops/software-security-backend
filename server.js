const express = require("express");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
require("dotenv").config();
const cors = require("cors");
const { PORT = 8080 } = process.env;

const cards = require("./modules/cards");
const users = require("./modules/users");
const auth0 = require("./modules/auth0");

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

const options = {
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  credentials: true,
  //origin: process.env.REACT_APP_URL,
};

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.format({
    "application/json": () => next(),
    default: () => res.status(406).end(),
  });
});

app.get("/", cors(options), (req, res) => {
  res.send("This is the backend api for my software security web application");
});

app.options("/", cors({ ...options, methods: "GET, OPTIONS" }));

app.all("/", (req, res) => {
  res.set("Allow", "GET, OPTIONS");
  res.status(405).end();
});

app.param("card_id", (req, res, next, id) => {
  req.card_id = id;
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
  if (req.body.user_id) {
    cards
      .getOwner(req.body.card_id)
      .then((owner_id) => {
        if (owner_id === req.body.user_id) {
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
  if (req.card_id) {
    cards
      .getById(req.card_id)
      .then((card) => {
        req.isAdmin = card[0].user_id === req.caller_id;
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
app.post("/users", checkJwt, cors(options), (req, res) => {
  users
    .store(req.user, req.body)
    .then((result) => {
      res.status(201).location(`/users/${result}`).send();
    })
    .catch((result) => {
      res.status(400).end();
    });
});

app.get("/me", checkJwt, cors(options), (req, res) => {
  users
    .me(req.user)
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.status(404).end();
    });
});

app.put("/users", checkJwt, cors(options), (req, res) => {
  users
    .update(req.body, req.user)
    .then((result) => {
      res.end();
    })
    .catch((result) => {
      res.status(400).end();
    });
});

app.delete("/users", checkJwt, cors(options), (req, res) => {
  users
    .destroy(req.user)
    .then((result) => {
      res.end();
    })
    .catch((result) => {
      res.status(400).end();
    });

  auth0
    .deleteAuthzAccount(req.user)
    .then((result) => {
      res.end();
    })
    .catch((result) => {
      res.status(400).end();
    });
});

app.options(
  "/users",
  cors({ ...options, methods: "POST, PUT, DELETE, OPTIONS" })
);
app.options("/me", cors({ ...options, methods: "GET, OPTIONS" }));

app.all("/users", (req, res) => {
  res.set("Allow", "POST, PUT, DELETE, OPTIONS");
  res.status(405).end();
});

app.all("/me", (req, res) => {
  res.set("Allow", "GET, OPTIONS");
  res.status(405).end();
});

/* CARDS */
app.get("/cards", cors(options), (req, res) => {
  cards
    .getAll()
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.status(404).end();
    });
});

app.get("/user-cards", checkJwt, getUserID, cors(options), (req, res) => {
  cards
    .getByUser(req.caller_id)
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.status(404).end();
    });
});

app.get("/cards/:card_id", checkJwt, cors(options), (req, res) => {
  cards
    .getById(req.card_id)
    .then((result) => {
      res.send(result);
    })
    .catch((result) => {
      res.status(404).end();
    });
});

app.post("/cards", checkJwt, getUserID, cors(options), isAdmin, (req, res) => {
  if (!req.isAdmin) {
    cards
      .store(req.body, req.caller_id)
      .then((result) => {
        res.status(201).location(`/cards/${result}`).send();
      })
      .catch((result) => {
        res.status(400).end();
      });
  } else {
    res.status(403).end();
  }
});

app.put("/cards/:card_id", checkJwt, cors(options), ownUser, (req, res) => {
  cards
    .update(req.body, req.card_id)
    .then((result) => {
      res.end();
    })
    .catch((result) => {
      res.status(400).end();
    });
});

app.delete(
  "/cards/:card_id",
  checkJwt,
  cors(options),
  isOwnUserOrAdmin,
  (req, res) => {
    if (!req.isAdmin) {
      cards
        .destroy(req.card_id)
        .then((result) => {
          res.end();
        })
        .catch((result) => {
          res.status(400).end();
        });
    } else {
      res.status(403).end();
    }
  }
);

app.options("/cards", cors({ ...options, methods: "GET, POST, OPTIONS" }));
app.options("/user-cards", cors({ ...options, methods: "GET, OPTIONS" }));
app.options(
  "/cards/:card_id",
  cors({ ...options, methods: "GET, PUT, DELETE, OPTIONS" })
);

app.all("/cards", (req, res) => {
  res.set("Allow", "GET, POST, OPTIONS");
  res.status(405).end();
});

app.all("/user-cards", (req, res) => {
  res.set("Allow", "GET, OPTIONS");
  res.status(405).end();
});

app.all("/cards/:card_id", (req, res) => {
  res.set("Allow", "GET, PUT, DELETE, OPTIONS");
  res.status(405).end();
});

app.listen(process.env.PORT);
console.log("API Server listening");
