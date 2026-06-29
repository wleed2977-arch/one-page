export const DEFAULT_THEME = 'light';

export const applyTheme = (theme = DEFAULT_THEME) => {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
};

export const resetTheme = () => applyTheme(DEFAULT_THEME);
