const connection = require("./connection");
const users = require("./users");

async function getAll() {
  return await new Promise((resolve, reject) => {
    connection.query("SELECT * FROM cards", (err, res) => {
      return err || res.length === 0 ? reject() : resolve(res);
    });
  });
}

async function getByUser(user_id) {
  return await new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM cards WHERE user_id = ?",
      [user_id],
      (err, res) => {
        return err || res.length === 0 ? reject() : resolve(res);
      }
    );
  });
}

async function getById(id) {
  return await new Promise((resolve, reject) => {
    connection.query("SELECT * FROM cards WHERE id = ?", [id], (err, res) => {
      return err || res.length === 0 ? reject() : resolve(res);
    });
  });
}

async function store({ name, image }, user_id) {
  return await new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO cards VALUES(NULL, ?, ?, ?)",
      [user_id, name, image],
      (err, res) => {
        return err || res.length === 0 ? reject() : resolve(res);
      }
    );
  });
}

async function update({ name }, id) {
  return await new Promise((resolve, reject) => {
    connection.query(
      "UPDATE cards SET name = ? WHERE id = ?",
      [name, id],
      (err, res) => {
        return err || res.length === 0 ? reject() : resolve(res);
      }
    );
  });
}

async function destroy(id) {
  return await new Promise((resolve, reject) => {
    connection.query("DELETE FROM cards WHERE id = ?", [id], (err, res) => {
      return err || res.length === 0 ? reject() : resolve(res);
    });
  });
}

module.exports = {
  getAll,
  getByUser,
  getById,
  store,
  update,
  destroy,
};
