/**
 * Standardize API responses
 */
export const sendResponse = (res, statusCode, success, message, data = {}, errors = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    errors
  });
};
