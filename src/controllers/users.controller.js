const UserModel = require('../models/users.js');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { ApiResponse } = require('../utils/constants.js');

const createUserController = async (req, res) => {
  try {
    console.log({ req });
    const data = req.body;

    const newUser = new UserModel({ ...data });

    await newUser.save();

    sendSuccessResponse(res, {
      ...ApiResponse.CREATED,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    // res.status(500).json({ error: 'Failed to create user' });
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create user',
      error
    });
  }
};

const getUsersListController = async (req, res) => {
  try {
    const users = await UserModel.find({});

    if (!users || users.length === 0) {
      return sendSuccessResponse(res, {
        ...ApiResponse.NOT_FOUND,
        message: 'No users found',
        data: []
      });
    }

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      data: users
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to fetch users',
      error
    });
  }
};

module.exports = { createUserController, getUsersListController };
