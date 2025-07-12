// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const { ApiResponse } = require('../utils/constants.js');
const { sendErrorResponse } = require('../utils/response.js');
const { validateToken } = require('../utils/helper.js');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // console.log(authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendErrorResponse(res, {
      ...ApiResponse.UNAUTHORIZED,
      message: 'Token missing or malformed'
    });
  }

  const token = authHeader.split(' ')[1];
  // console.log('Token:', token);
  try {
    const decoded = validateToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    console.log({ error });
    return sendErrorResponse(res, {
      ...ApiResponse.UNAUTHORIZED,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = { authenticate };
