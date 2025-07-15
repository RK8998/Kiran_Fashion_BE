const UserModel = require('../models/users.js');
const { ApiResponse } = require('../utils/constants.js');
const { generateJWTToken } = require('../utils/helper.js');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/response.js');
const bcrypt = require('bcrypt');

const loginController = async (req, res) => {
  try {
    const email = req?.body?.email || '';
    const password = req?.body?.password || '';

    if (!email || !password) throw new Error('Email and password are required.');

    const user = await UserModel.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, {
        ...ApiResponse.NOT_FOUND,
        message: 'User not found with this email'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, {
        ...ApiResponse.UNAUTHORIZED,
        message: 'Invalid email or password'
      });
    }

    // 4. Check if active
    if (!user.isActive) {
      return sendErrorResponse(res, {
        ...ApiResponse.FORBIDDEN,
        message: 'Your account is not active'
      });
    }

    const userData = user.toObject();
    delete userData.password; // Remove password from the response

    // 5. Generate token
    const token = generateJWTToken({
      ...userData
    });

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      message: 'Login successful',
      data: { token, user: userData }
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to fetch users',
      error
    });
  }
};

module.exports = { loginController };
