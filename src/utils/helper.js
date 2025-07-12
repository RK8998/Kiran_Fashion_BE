require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateJWTToken = (tokenData = {}) => {
  const token = jwt.sign({ ...tokenData }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return token;
};

const validateToken = token => {
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return decode;
};

module.exports = {
  generateJWTToken,
  validateToken
};
