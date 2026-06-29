// Global State Management
class StateManager {
  constructor() {
    this.state = {
      user: null,
      profile: null,
      widgets: [],
      projects: [],
      skills: [],
      theme: 'light'
    };
    this.listeners = {};
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    this.state[key] = value;
    this.notify(key, value);
  }

  subscribe(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
  }

  notify(key, value) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => callback(value));
    }
  }
}

export const state = new StateManager();
