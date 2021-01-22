const axios = require("axios");
const qs = require("qs");

async function requestBearerToken() {
  return await new Promise((resolve, reject) => {
    axios
      .request({
        method: "POST",
        url: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
          grant_type: "client_credentials",
          client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
          client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
          audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
        }),
      })
      .then((response) => resolve(response.data.access_token))
      .catch((error) => reject(error));
  });
}

async function deleteAuthzAccount({ sub }) {
  return await new Promise((resolve, reject) => {
    requestBearerToken()
      .then((token) => {
        axios({
          method: "DELETE",
          url: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${sub}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => resolve())
          .catch((error) => reject(error));
      })
      .catch((err) => reject(err));
  });
}

module.exports = {
  deleteAuthzAccount,
};
