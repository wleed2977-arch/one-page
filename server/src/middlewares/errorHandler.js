import { sendResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const isProduction = process.env.NODE_ENV === 'production';
  const errors = isProduction ? null : err.issues || err.errors || null;

  sendResponse(res, statusCode, false, message, {}, errors);
};
