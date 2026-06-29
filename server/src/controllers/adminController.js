import * as userRepository from '../repositories/userRepository.js';
import { sendResponse } from '../utils/response.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await userRepository.findAll();
    sendResponse(res, 200, true, 'Users fetched', {
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};
