export const brandLogo = (className = 'brand-logo__img') =>
  `<img src="/logo.svg" alt="" class="${className}" width="36" height="36" decoding="async">`;

export const brandMark = (options = {}) => {
  const { href = '/', link = true, className = 'brand-logo', showText = true } = options;
  const inner = `
    ${brandLogo()}
    ${showText ? '<span class="brand-logo__text">OnePage</span>' : ''}
  `;
  if (!link) return `<div class="${className}">${inner}</div>`;
  return `<a href="${href}" class="${className}" data-link>${inner}</a>`;
};
