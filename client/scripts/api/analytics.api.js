import { http } from './http.js';

export const analyticsApi = {
  getMyAnalytics: () => http.get('/analytics/my'),
  recordView: (slug) => http.post(`/analytics/view/${slug}`),
};
