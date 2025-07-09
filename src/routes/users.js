const express = require('express');
const { sendSuccessResponse } = require('../utils/response');
const router = express.Router();

const { ApiResponse } = require('../utils/constants');

router.get('/', (req, res) => {
  // res.status(200).json({ status: 200, data: {}, message: 'User route is working' });
  console.log(req);
  sendSuccessResponse(res, { ...ApiResponse.SUCCESS, data: {} });
});

module.exports = { userRoutes: router };
