const connection = require("./connection");

async function getUserID({ sub }) {
  return await new Promise((resolve, reject) => {
    connection.query(
      "SELECT `id` FROM users WHERE `sub` = ?",
      [sub],
      (err, res) => {
        return err || res.length === 0 ? reject() : resolve(res[0].id);
      }
    );
  });
}

async function isAdmin(userId) {
  return await new Promise((resolve, reject) => {
    connection.query(
      "SELECT `admin` FROM users WHERE `id` = ?",
      [userId],
      (err, res) => {
        return err || res.length === 0 ? reject() : resolve(res[0].admin);
      }
    );
  });
}

async function me({ sub }) {
  return await new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE `sub` = ?",
      [sub],
      (err, user) => {
        if (err || user.length === 0) {
          return reject();
        }
        return resolve(user[0]);
      }
    );
  });
}

async function store({ sub }, { name }) {
  return await new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO users VALUES(NULL, ?, ?, 0)",
      [sub, name],
      (err, res) => {
        return err || res.length === 0 ? reject() : resolve(res.insertId);
      }
    );
  });
}

async function update({ name }, { sub }) {
  return await new Promise((resolve, reject) => {
    connection.query(
      "UPDATE users SET `name` = ? WHERE `sub` = ?",
      [name, sub],
      (err, res) => {
        return err || res.length === 0 ? reject() : resolve();
      }
    );
  });
}

async function destroy({ sub }) {
  return await new Promise((resolve, reject) => {
    connection.query("DELETE FROM users WHERE `sub` = ?", [sub], (err, res) => {
      return err || res.affectedRows === 0 ? reject() : resolve();
    });
  });
}

module.exports = {
  getUserID,
  isAdmin,
  me,
  store,
  update,
  destroy,
};
