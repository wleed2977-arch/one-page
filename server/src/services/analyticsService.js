import * as analyticsRepository from '../repositories/analyticsRepository.js';

export const recordView = async (slug) => {
  return await analyticsRepository.recordView(slug);
};

export const getMyAnalytics = async (userId) => {
  return await analyticsRepository.getMyAnalytics(userId);
};
