export const LOGO_SRC = '/logo.png';

export const brandIcon = (size = 36) =>
  `<span class="brand-logo__icon" style="--brand-icon-size:${size}px" aria-hidden="true">
    <img src="${LOGO_SRC}" alt="" class="brand-logo__icon-img" decoding="async">
  </span>`;

export const brandFull = (height = 40, className = 'brand-logo__full') =>
  `<img src="${LOGO_SRC}" alt="OnePage" class="${className}" style="max-height:${height}px" decoding="async">`;

export const brandMark = (options = {}) => {
  const {
    href = '/',
    link = true,
    className = 'brand-logo',
    showText = true,
    variant = 'compact',
    size = 36,
  } = options;

  const inner =
    variant === 'full'
      ? brandFull(size)
      : `${brandIcon(size)}${showText ? '<span class="brand-logo__text">OnePage</span>' : ''}`;

  if (!link) return `<div class="${className}">${inner}</div>`;
  return `<a href="${href}" class="${className}" data-link>${inner}</a>`;
};
