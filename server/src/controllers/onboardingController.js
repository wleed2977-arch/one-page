import * as onboardingService from '../services/onboardingService.js';
import { sendResponse } from '../utils/response.js';

export const getStatus = async (req, res, next) => {
  try {
    const data = await onboardingService.getStatus(req.user.id);
    sendResponse(res, 200, true, 'Onboarding status', data);
  } catch (error) {
    next(error);
  }
};

export const complete = async (req, res, next) => {
  try {
    const data = await onboardingService.complete(req.user.id, req.body);
    sendResponse(res, 200, true, 'Onboarding completed', data);
  } catch (error) {
    next(error);
  }
};
