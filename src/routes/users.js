const express = require('express');
const { sendSuccessResponse } = require('../utils/response');
const router = express.Router();

const { ApiResponse } = require('../utils/constants');
const { createUserController } = require('../controllers/users.controller');

router.get('/', (req, res) => {
  // res.status(200).json({ status: 200, data: {}, message: 'User route is working' });
  console.log(req);
  sendSuccessResponse(res, { ...ApiResponse.SUCCESS, data: {} });
});

router.post('/', createUserController);

module.exports = { userRoutes: router };
