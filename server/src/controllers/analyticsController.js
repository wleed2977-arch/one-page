import * as analyticsService from '../services/analyticsService.js';
import { sendResponse } from '../utils/response.js';

export const recordView = async (req, res, next) => {
  try {
    await analyticsService.recordView(req.params.slug);
    sendResponse(res, 200, true, 'View recorded');
  } catch (error) {
    next(error);
  }
};

export const getMyAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getMyAnalytics(req.user.id);
    sendResponse(res, 200, true, 'Analytics fetched', data);
  } catch (error) {
    next(error);
  }
};
