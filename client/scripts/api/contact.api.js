export const contactApi = {
  sendMessage: async (slug, { name, email, message }) => {
    const response = await fetch(`/api/v1/contact/${encodeURIComponent(slug)}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message');
    }
    return data;
  },
};
