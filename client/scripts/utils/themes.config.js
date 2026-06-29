export const THEMES = [
  { id: 'light', label: 'Light', color: 'linear-gradient(165deg, #ffffff 0%, #eef2ff 100%)' },
  { id: 'dark', label: 'Dark', color: 'linear-gradient(180deg, #1f1f23 0%, #09090b 100%)' },
  { id: 'linear', label: 'Linear', color: 'linear-gradient(180deg, #111111 0%, #000000 100%)' },
  { id: 'glass', label: 'Glass', color: 'linear-gradient(160deg, #e0e7ff 0%, #fce7f3 100%)' },
  { id: 'forest', label: 'Forest', color: 'linear-gradient(180deg, #1a2e1a 0%, #0f172a 100%)' },
  { id: 'ocean', label: 'Ocean', color: 'linear-gradient(180deg, #bae6fd 0%, #f0f9ff 100%)' },
];

export const renderThemeCards = (selectedId, cardClass = 'onboarding-theme-card') =>
  THEMES.map(
    (t) => `
    <div class="${cardClass} ${selectedId === t.id ? 'selected' : ''}" data-theme="${t.id}">
      <div class="onboarding-theme-swatch" style="background:${t.color};"></div>
      <span>${t.label}</span>
    </div>`
  ).join('');
