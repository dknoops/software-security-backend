const connection = require("./connection");

async function getAllCards() {
  return await new Promise((resolve, reject) => {
    connection.query("SELECT * FROM cards", (err, res) => {
      return err || res.length === 0
        ? reject({ error: "Cannot retrieve cards" })
        : resolve(res);
    });
  });
}

module.exports = {
  getAllCards: getAllCards,
};
