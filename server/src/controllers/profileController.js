import * as profileService from '../services/profileService.js';
import { sendResponse } from '../utils/response.js';

export const getMyProfile = async (req, res, next) => {
  try {
    const data = await profileService.getMyProfile(req.user.id);
    sendResponse(res, 200, true, 'Profile fetched', data);
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateMyProfile(req.user.id, req.body);
    sendResponse(res, 200, true, 'Profile updated', { profile });
  } catch (error) {
    next(error);
  }
};
