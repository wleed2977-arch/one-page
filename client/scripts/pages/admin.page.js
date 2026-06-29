import { adminApi } from '../api/admin.api.js';
import { dashboardNav, bindDashboardLayout } from '../utils/layout.js';
import { showToast } from '../utils/toast.js';

export const AdminPage = {
  render: async () => `
    <div class="dashboard-layout">
      ${dashboardNav('admin')}
      <main class="dashboard-content">
        <div class="dashboard-header"><h2>Admin</h2></div>
        <div class="card">
          <div class="card-body">
            <p id="user-count" style="margin-bottom:1rem;">Loading users...</p>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="border-bottom:1px solid var(--color-border);text-align:left;">
                    <th style="padding:0.5rem;">Email</th>
                    <th style="padding:0.5rem;">Username</th>
                    <th style="padding:0.5rem;">Role</th>
                    <th style="padding:0.5rem;">Joined</th>
                  </tr>
                </thead>
                <tbody id="users-table"></tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,

  afterRender: async () => {
    bindDashboardLayout();

    try {
      const res = await adminApi.getUsers();
      const { count, users } = res.data;
      document.getElementById('user-count').textContent = `${count} registered users`;
      document.getElementById('users-table').innerHTML = users.map((u) => `
        <tr style="border-bottom:1px solid var(--color-border);">
          <td style="padding:0.5rem;">${u.email}</td>
          <td style="padding:0.5rem;">${u.profile?.username || '-'}</td>
          <td style="padding:0.5rem;">${u.role}</td>
          <td style="padding:0.5rem;">${new Date(u.createdAt).toLocaleDateString()}</td>
        </tr>
      `).join('');
    } catch (err) {
      showToast(err.message || 'Admin access denied', 'error');
      setTimeout(() => window.appRouter.navigate('/dashboard'), 1500);
    }
  },
};
