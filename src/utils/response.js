// utils/responseHandler.js

/**
 * Send a standardized success response
 * @param {object} res - Express response object
 * @param {object} options - Response options
 * @param {number} [options.statusCode=200] - HTTP status code
 * @param {any} [options.data=null] - Main response data
 * @param {string} [options.message='Request was successful'] - Success message
 * @param {object} [options.meta] - Optional metadata (e.g., pagination)
 */
const sendSuccessResponse = (
  res,
  { status = 200, message = 'Request was successful', data = null, meta }
) => {
  const response = {
    success: true,
    status,
    message,
    data
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(status).json(response);
};

/**
 * Send a standardized error response
 * @param {object} res - Express response object
 * @param {object} options - Error response options
 * @param {number} [options.statusCode=500] - HTTP status code
 * @param {string} [options.message='An error occurred'] - Error message for client
 * @param {any} [options.error=null] - Optional error object for internal logging
 */
const sendErrorResponse = (res, { status = 500, message = 'An error occurred', error = null }) => {
  // Optional: Log the error (could be to console, file, external logger)
  if (error) {
    console.error('[API Error]', error);
  }

  return res.status(statusCode).json({
    success: false,
    status,
    message
  });
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse
};
