import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Questions API
export const questionsAPI = {
  getAll: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  vote: (id, voteType) => api.post(`/questions/${id}/vote`, { voteType }),
  flag: (id, reason) => api.post(`/questions/${id}/flag`, { reason }),
};

// Quiz API
export const quizAPI = {
  start: (data) => api.post('/quiz/start', data),
  answer: (data) => api.post('/quiz/answer', data),
  complete: (id) => api.post(`/quiz/${id}/complete`),
  getById: (id) => api.get(`/quiz/${id}`),
  getUserQuizzes: (params) => api.get('/quiz/user/history', { params }),
};

// Progress API
export const progressAPI = {
  get: () => api.get('/progress'),
  getCategories: () => api.get('/progress/categories'),
  getWeakAreas: () => api.get('/progress/weak-areas'),
  getStreak: () => api.get('/progress/streak'),
  getActivity: () => api.get('/progress/activity'),
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobal: (params) => api.get('/leaderboard/global', { params }),
  getCategory: (category, params) => api.get(`/leaderboard/category/${category}`, { params }),
  getUserRank: () => api.get('/leaderboard/rank'),
};

// Achievements API
export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
  getUserAchievements: () => api.get('/achievements/user'),
  check: () => api.post('/achievements/check'),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deactivateUser: (id) => api.put(`/admin/users/${id}/deactivate`),
  getFlaggedQuestions: () => api.get('/admin/questions/flagged'),
  reviewQuestion: (id, status) => api.put(`/admin/questions/${id}/review`, { status }),
  createAchievement: (data) => api.post('/admin/achievements', data),
  updateAchievement: (id, data) => api.put(`/admin/achievements/${id}`, data),
  deleteAchievement: (id) => api.delete(`/admin/achievements/${id}`),
};

export default api;