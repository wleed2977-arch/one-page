import { http } from './http.js';

export const pagesApi = {
  getMyPage: () => http.get('/pages/my'),
  updatePage: (data) => http.put('/pages/my', data),
  saveWidgets: (widgets) => http.put('/pages/my/widgets', { widgets }),
  getPageBySlug: (slug) => http.get(`/pages/${slug}`),
};
