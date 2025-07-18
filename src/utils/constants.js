const ROLES = {
  admin: 'admin',
  user: 'user'
};

// constants/apiResponse.js
const ApiResponse = {
  SUCCESS: {
    status: 200,
    message: 'SUCCESS',
    messageCode: null
  },
  CREATED: {
    status: 201,
    success: true,
    message: 'RESOURCE_CREATED',
    messageCode: null
  },
  BAD_REQUEST: {
    status: 400,
    message: 'BAD_REQUEST',
    messageCode: null
  },
  UNAUTHORIZED: {
    status: 401,
    message: 'UNAUTHORIZED',
    messageCode: null
  },
  FORBIDDEN: {
    status: 403,
    message: 'FORBIDDEN',
    messageCode: null
  },
  NOT_FOUND: {
    status: 404,
    message: 'NOT_FOUND',
    messageCode: null
  },
  VALIDATION_ERROR: {
    status: 422,
    message: 'VALIDATION_ERROR',
    messageCode: null
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: 'INTERNAL_SERVER_ERROR',
    messageCode: null
  }
};

module.exports = { ApiResponse, ROLES };
