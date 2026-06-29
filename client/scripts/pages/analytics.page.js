import { analyticsApi } from '../api/analytics.api.js';
import { dashboardNav, bindDashboardLayout } from '../utils/layout.js';

export const AnalyticsPage = {
  render: async () => `
    <div class="dashboard-layout">
      ${dashboardNav('analytics')}
      <main class="dashboard-content">
        <div class="dashboard-header"><h2>Analytics</h2></div>
        <div id="analytics-stats" class="dashboard-stats-grid"></div>
        <div class="analytics-chart" style="margin-top: 2rem; background: var(--color-surface); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
          <h3 style="margin-bottom: 1.5rem;">Traffic (Last 7 Days)</h3>
          <canvas id="trafficChart" style="width: 100%; height: 300px;"></canvas>
        </div>
      </main>
    </div>
  `,

  afterRender: async () => {
    bindDashboardLayout();

    const statsEl = document.getElementById('analytics-stats');
    let data = { totalViews: 0, widgetCount: 0, daily: [] };

    try {
      const res = await analyticsApi.getMyAnalytics();
      data = res.data;
    } catch {
      /* empty */
    }

    statsEl.innerHTML = `
      <div class="card"><div class="card-body">
        <p style="color: var(--color-text-secondary); font-size: 0.875rem;">Total Views (7 days)</p>
        <h3>${data.totalViews}</h3>
      </div></div>
      <div class="card"><div class="card-body">
        <p style="color: var(--color-text-secondary); font-size: 0.875rem;">Widgets Active</p>
        <h3>${data.widgetCount}</h3>
      </div></div>
      <div class="card"><div class="card-body">
        <p style="color: var(--color-text-secondary); font-size: 0.875rem;">Avg. Daily Views</p>
        <h3>${data.daily?.length ? Math.round(data.totalViews / data.daily.length) : 0}</h3>
      </div></div>
    `;

    const loadChart = () => {
      const ctx = document.getElementById('trafficChart');
      if (!ctx || !window.Chart) return;
      new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: (data.daily || []).map((d) => d.label),
          datasets: [{
            label: 'Page Views',
            data: (data.daily || []).map((d) => d.views),
            borderColor: '#4F46E5',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
          }],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    };

    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
      script.onload = loadChart;
      document.head.appendChild(script);
    } else {
      loadChart();
    }
  },
};
