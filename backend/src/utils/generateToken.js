const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('./../constants');

const generateToken = (payload) => {
  //sign Token
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY }, (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = generateToken;
