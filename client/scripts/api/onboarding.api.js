import { http } from './http.js';

export const onboardingApi = {
  getStatus: () => http.get('/onboarding/status'),
  complete: (data) => http.post('/onboarding/complete', data),
};
