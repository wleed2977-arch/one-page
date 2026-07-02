/** OnePage app shell always uses the brand theme (see BRAND_SYSTEM.md). */
export const APP_BRAND_THEME = 'light';

export const DEFAULT_THEME = APP_BRAND_THEME;

/** Lock dashboard, landing, auth, builder chrome to OnePage brand. */
export const applyAppBrand = () => {
  document.documentElement.setAttribute('data-theme', APP_BRAND_THEME);
  document.body.setAttribute('data-theme', APP_BRAND_THEME);
};

/** Full-page theme for public profile routes only. */
export const applyPublicTheme = (theme = 'light') => {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
};

/** Preview a user theme inside a container without changing app chrome. */
export const applyScopedTheme = (element, theme = 'light') => {
  if (element) element.setAttribute('data-theme', theme);
};

export const clearScopedTheme = (element) => {
  if (element) element.removeAttribute('data-theme');
};

/** @deprecated Use applyPublicTheme or applyScopedTheme */
export const applyTheme = applyPublicTheme;

export const resetTheme = applyAppBrand;
