const BASE_URL = process.env.REACT_APP_API_URL;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  };
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || 'Error en la petición');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // Auth
  async login(username, password) {
    return request('/auth/login', { method: 'POST', body: { username, password } });
  },

  // Users
  async getUsers() {
    return request('/users');
  },

  // Projects
  async getProjects() {
    return request('/projects');
  },
  async addProject(project) {
    return request('/projects', { method: 'POST', body: project });
  },
  async updateProject(id, project) {
    return request(`/projects/${id}`, { method: 'PUT', body: project });
  },
  async deleteProject(id) {
    return request(`/projects/${id}`, { method: 'DELETE' });
  },

  // Tasks
  async getTasks() {
    return request('/tasks');
  },
  async addTask(task) {
    return request('/tasks', { method: 'POST', body: task });
  },
  async updateTask(id, task) {
    return request(`/tasks/${id}`, { method: 'PUT', body: task });
  },
  async deleteTask(id, userId) {
    const q = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return request(`/tasks/${id}${q}`, { method: 'DELETE' });
  },

  // Comments
  async getComments(taskId) {
    const q = taskId ? `?taskId=${encodeURIComponent(taskId)}` : '';
    return request(`/comments${q}`);
  },
  async addComment(comment) {
    return request('/comments', { method: 'POST', body: comment });
  },

  // History
  async getHistory(taskId) {
    const q = taskId ? `?taskId=${encodeURIComponent(taskId)}` : '';
    return request(`/history${q}`);
  },
  async addHistory(entry) {
    return request('/history', { method: 'POST', body: entry });
  },

  // Notifications
  async getNotifications(userId, unreadOnly = true) {
    const params = new URLSearchParams();
    if (userId) params.set('userId', userId);
    if (unreadOnly) params.set('unreadOnly', 'true');
    return request(`/notifications?${params}`);
  },
  async markNotificationsRead(userId) {
    return request('/notifications/read', { method: 'PATCH', body: { userId } });
  }
};

/**
 * Comprueba si el backend está disponible
 */
export async function isApiAvailable() {
  try {
    const res = await fetch(`${BASE_URL.replace('/api', '')}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export default api;
