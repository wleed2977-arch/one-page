import { http } from './http.js';

export const adminApi = {
  getUsers: () => http.get('/admin/users'),
};
