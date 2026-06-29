import { http } from './http.js';

export const profileApi = {
  getMyProfile: () => http.get('/profile/me'),
  updateProfile: (data) => http.put('/profile/me', data),
};
