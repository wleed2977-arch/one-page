import { state } from '../core/state.js';
import { authApi } from '../api/auth.api.js';
import { onboardingApi } from '../api/onboarding.api.js';

export const refreshAuthUser = async () => {
  const data = await authApi.getCurrentUser();
  state.set('user', data.data.user);
  return data.data.user;
};

export const redirectAfterAuth = async () => {
  try {
    const res = await onboardingApi.getStatus();
    if (res.data?.completed) {
      window.appRouter.navigate('/dashboard');
    } else {
      window.appRouter.navigate('/onboarding');
    }
  } catch {
    window.appRouter.navigate('/onboarding');
  }
};
