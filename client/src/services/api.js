import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('krishi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauth
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        // clear and redirect
        localStorage.removeItem('krishi_token');
        localStorage.removeItem('krishi_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const farmAPI = {
  getAll: () => API.get('/farms'),
  getById: (id) => API.get(`/farms/${id}`),
  create: (data) => API.post('/farms', data),
  update: (id, data) => API.put(`/farms/${id}`, data),
  delete: (id) => API.delete(`/farms/${id}`),
};

export const cropAPI = {
  getAll: () => API.get('/crops'),
  getById: (id) => API.get(`/crops/${id}`),
  create: (data) => API.post('/crops', data),
  update: (id, data) => API.put(`/crops/${id}`, data),
  delete: (id) => API.delete(`/crops/${id}`),
};

export const soilAPI = {
  getAll: () => API.get('/soil'),
  create: (data) => API.post('/soil', data),
  delete: (id) => API.delete(`/soil/${id}`),
};

export const weatherAPI = {
  get: (location) => API.get(`/weather?location=${encodeURIComponent(location || 'Bhopal')}`),
};

export const mandiAPI = {
  get: (params) => API.get('/mandi', { params }),
};

export const cropDoctorAPI = {
  diagnose: (data) => API.post('/crop-doctor/diagnose', data),
  getList: () => API.get('/crop-doctor/list'),
};

export const cropAdvisorAPI = {
  recommend: (data) => API.post('/crop-advisor/recommend', data),
  getCatalog: () => API.get('/crop-advisor/crops'),
};

export const pestAPI = {
  getAll: (params) => API.get('/pests', { params }),
  create: (data) => API.post('/pests', data),
  update: (id, data) => API.put(`/pests/${id}`, data),
  delete: (id) => API.delete(`/pests/${id}`),
};

export const resourceAPI = {
  getAll: (params) => API.get('/resources', { params }),
  getById: (id) => API.get(`/resources/${id}`),
  create: (data) => API.post('/resources', data),
  update: (id, data) => API.put(`/resources/${id}`, data),
  delete: (id) => API.delete(`/resources/${id}`),
};

export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMy: () => API.get('/orders/my'),
  getById: (id) => API.get(`/orders/${id}`),
  getAllAdmin: () => API.get('/orders/all'),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
};

export const expertAPI = {
  getAll: (params) => API.get('/experts', { params }),
  create: (data) => API.post('/experts', data),
  update: (id, data) => API.put(`/experts/${id}`, data),
  delete: (id) => API.delete(`/experts/${id}`),
  book: (data) => API.post('/experts/consultations', data),
  getMyConsultations: () => API.get('/experts/consultations/my'),
  getAllAdmin: () => API.get('/experts/consultations/all'),
  updateConsultation: (id, data) => API.put(`/experts/consultations/${id}`, data),
};

export const communityAPI = {
  getAll: (params) => API.get('/community', { params }),
  getById: (id) => API.get(`/community/${id}`),
  create: (data) => API.post('/community', data),
  toggleLike: (id) => API.post(`/community/${id}/like`),
  addComment: (id, comment) => API.post(`/community/${id}/comments`, { comment }),
  delete: (id) => API.delete(`/community/${id}`),
};

export const activityAPI = {
  getAll: () => API.get('/activities'),
  create: (data) => API.post('/activities', data),
  update: (id, data) => API.put(`/activities/${id}`, data),
  delete: (id) => API.delete(`/activities/${id}`),
  toggle: (id) => API.patch(`/activities/${id}/toggle`),
};

export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  markAsRead: (id) => API.patch(`/notifications/${id}/read`),
  markAllAsRead: () => API.patch('/notifications/read-all'),
};

export const assistantAPI = {
  ask: (message) => API.post('/assistant/ask', { message }),
};

export const analyticsAPI = {
  getFarmer: () => API.get('/analytics/farmer'),
  getAdmin: () => API.get('/analytics/admin'),
};

export const adminAPI = {
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleUserStatus: (id) => API.patch(`/admin/users/${id}/toggle-status`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getFarms: () => API.get('/admin/farms'),
  getCrops: () => API.get('/admin/crops'),
  getSoilReports: () => API.get('/admin/soil-reports'),
};

export default API;
