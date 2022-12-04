const jwt = require("jsonwebtoken");

require("dotenv").config();

const generateJWT = async (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.JWT_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("An error occurred while generating the token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
