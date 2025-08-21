const UserModel = require('../models/users.js');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { ApiResponse, ROLES } = require('../utils/constants.js');

const createUserController = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (loggedInUser.role !== ROLES.admin)
      return sendErrorResponse(res, {
        ...ApiResponse.UNAUTHORIZED,
        message: 'You do not have permission to create a user'
      });

    const data = req.body;

    const newUser = new UserModel({ ...data });

    await newUser.save();

    sendSuccessResponse(res, {
      ...ApiResponse.CREATED,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Something went wrong.',
      error
    });
  }
};

const updateUserController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const userId = req.params.id;
    const data = req.body;

    if (loggedInUser.role !== ROLES.admin)
      return sendErrorResponse(res, {
        ...ApiResponse.UNAUTHORIZED,
        message: 'You do not have permission to update a user'
      });

    if ('password' in data) {
      return sendErrorResponse(res, {
        ...ApiResponse.VALIDATION_ERROR,
        message: 'Password update is not allowed in this API.'
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true
    }).select({ password: 0 });

    if (!updatedUser) {
      return sendSuccessResponse(res, {
        ...ApiResponse.NOT_FOUND,
        message: 'User not found',
        data: []
      });
    }

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    // res.status(500).json({ error: 'Something went wrong.' });
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Something went wrong.',
      error
    });
  }
};

const getUsersListController = async (req, res) => {
  try {
    const { page, rows, search = '' } = req.query;

    const offset = (page - 1) * rows;

    const filter = {
      // $and: [{ $text: { $search: search } }, { deleted_at: null }, { role: { $ne: ROLES.admin } }]
      deleted_at: null,
      role: { $ne: ROLES.admin }
    };

    if (search.trim()) {
      // filter['$text'] = { $search: search.trim() };
      // const regex = new RegExp(search.trim(), 'i'); // 'i' for case-insensitive
      const regex = new RegExp('^' + search.trim(), 'i'); // Match from the start
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const totalRecords = await UserModel.countDocuments(filter);

    // const results = await UserModel.find(filter).select({ password: 0 }).skip(offset).limit(rows);
    const results = await UserModel.find(filter)
      // .select({ password: 0, score: { $meta: 'textScore' } })
      // .sort(search ? { score: { $meta: 'textScore' } } : { created_at: -1 })
      .select({ password: 0 })
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(rows);

    if (!results || results.length === 0) {
      return sendSuccessResponse(res, {
        ...ApiResponse.SUCCESS,
        message: 'No users found',
        data: { results: [], total: 0 }
      });
    }

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      data: { results, total: totalRecords },
      message: 'Users fetched successfully'
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Something went wrong.',
      error
    });
  }
};

const getUsersByIdController = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return sendErrorResponse(res, {
        ...ApiResponse.BAD_REQUEST,
        message: 'User ID is required'
      });
    }

    const user = await UserModel.findOne({ _id: userId, deleted_at: null }).select({ password: 0 });

    if (!user) {
      return sendSuccessResponse(res, {
        ...ApiResponse.NOT_FOUND,
        message: 'No users found',
        data: []
      });
    }

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      data: user
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Something went wrong.',
      error
    });
  }
};

const deleteUsersByIdController = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return sendErrorResponse(res, {
        ...ApiResponse.BAD_REQUEST,
        message: 'User ID is required'
      });
    }

    const user = await UserModel.find({ _id: userId, deleted_at: null });

    if (!user) {
      return sendSuccessResponse(res, {
        ...ApiResponse.NOT_FOUND,
        message: 'No users found',
        data: []
      });
    }

    const deletedUser = await UserModel.findByIdAndUpdate(
      userId,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!deletedUser) {
      return sendErrorResponse(res, {
        ...ApiResponse.BAD_REQUEST,
        message: 'Failed to delete user',
        data: []
      });
    }

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      data: deletedUser,
      message: 'User deleted successfully'
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Something went wrong.',
      error
    });
  }
};

module.exports = {
  createUserController,
  getUsersListController,
  getUsersByIdController,
  deleteUsersByIdController,
  updateUserController
};
