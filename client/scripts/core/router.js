import { applyAppBrand } from '../utils/theme.js';

export class Router {
  constructor(routes) {
    this.routes = routes;
    this.rootElement = document.getElementById('app');
    this.defaultTitle = 'OnePage | Build your online identity.';
    window.addEventListener('popstate', () => this.handleRoute());
  }

  matchRoute(path) {
    for (const route of this.routes) {
      if (route.path === path) return { route, params: {} };

      if (route.path.includes(':')) {
        const routeParts = route.path.split('/');
        const pathParts = path.split('/');
        if (routeParts.length !== pathParts.length) continue;

        const params = {};
        let matched = true;
        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i].startsWith(':')) {
            params[routeParts[i].slice(1)] = pathParts[i];
          } else if (routeParts[i] !== pathParts[i]) {
            matched = false;
            break;
          }
        }
        if (matched) return { route, params };
      }
    }
    return null;
  }

  async handleRoute() {
    const path = window.location.pathname;
    const match = this.matchRoute(path);

    let route = match?.route;
    const params = match?.params || {};

    if (!route) {
      route = this.routes.find((r) => r.path === '/');
    }

    window.routeParams = params;

    if (route.middleware) {
      const canProceed = await route.middleware();
      if (!canProceed) return;
    }

    if (route.component) {
      const isPublicProfile = route.path === '/p/:slug';
      if (!isPublicProfile) applyAppBrand();

      document.title = this.defaultTitle;
      const html = await route.component.render(params);
      this.rootElement.innerHTML = html;
      if (route.component.afterRender) {
        await route.component.afterRender(params);
      }
    }
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }
}
