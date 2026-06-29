// Centralized HTTP Client
export const http = {
  async request(endpoint, options = {}) {
    const url = `/api/v1${endpoint}`;
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    if (options.body && typeof options.body === 'object') {
      finalOptions.body = JSON.stringify(options.body);
    }

    let response;
    try {
      response = await fetch(url, finalOptions);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          'Cannot reach the server. Run "npm run dev" from the project root and keep both client and server running.'
        );
      }
      throw error;
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Server returned an invalid response. Is the API running on port 3000?');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};
