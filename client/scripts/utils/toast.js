export const showToast = (message, type = 'info') => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = 'padding:0.75rem 1.25rem;background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);box-shadow:var(--shadow-md);animation:fadeIn 0.2s ease;';
  if (type === 'error') toast.style.borderColor = 'var(--color-danger)';
  if (type === 'success') toast.style.borderColor = 'var(--color-success)';

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};
