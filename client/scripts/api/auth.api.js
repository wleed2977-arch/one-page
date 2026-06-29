import { http } from './http.js';

export const authApi = {
  login: async (email, password) => {
    return await http.post('/auth/login', { email, password });
  },
  
  register: async (email, password, confirmPassword) => {
    return await http.post('/auth/register', { email, password, confirmPassword });
  },

  logout: async () => {
    return await http.post('/auth/logout');
  },

  getCurrentUser: async () => {
    return await http.get('/auth/me');
  }
};
