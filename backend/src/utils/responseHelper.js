// utils/responseHelpers.js
export const successResponse = (data, message = 'Success', statusCode = 200) => ({
  success: true,
  statusCode,
  data,
  message
});

export const errorResponse = (message, statusCode = 400, error = null) => ({
  success: false,
  statusCode,
  message,
  error: error?.message || error
});

export const notFoundResponse = (item = 'Item') => ({
  success: false,
  statusCode: 404,
  message: `${item} not found`
});

export const serverErrorResponse = (error) => ({
  success: false,
  statusCode: 500,
  message: 'Internal server error',
  error: error.message
});