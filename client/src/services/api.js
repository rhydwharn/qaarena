import axios from 'axios';

// Use relative URL in development (proxied by Vite via vite.config.js)
// In production, always hit the live backend
const API_URL = import.meta.env.DEV ? '/api' : 'https://korrekttech.com/backend/api';

// Single axios instance used everywhere
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Centralised error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    if (import.meta.env.DEV) {
      // Extra logging in dev only
      console.error('API error', {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    return Promise.reject(error);
  },
);

// ---------- Feature-specific API groups ----------

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  // Current user profile
  getMe: () => api.get('/auth/me'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Questions + upload
const uploadFile = (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/questions-upload/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (!onProgress || !evt.total) return;
      const percent = Math.round((evt.loaded * 100) / evt.total);
      onProgress(percent);
    },
  });
};

export const questionsAPI = {
  upload: uploadFile,
  // Generic fetch with optional filters/pagination
  getAll: (params) => api.get('/questions', { params }),
  list: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
};

// Quiz API
export const quizAPI = {
  start: (data) => api.post('/quiz/start', data),
  answer: (data) => api.post('/quiz/answer', data),
  complete: (id) => api.post(`/quiz/${id}/complete`),
  getById: (id) => api.get(`/quiz/${id}`),
  getUserQuizzes: (params) => api.get('/quiz/user/history', { params }),
  getInProgress: () => api.get('/quiz/in-progress'),
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

// Admin API (used by Admin.jsx)
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

// Functional Bugs API (for FunctionalBugScenario page)
export const functionalBugsAPI = {
  getAll: (params) => api.get('/functional-bugs', { params }),
  getById: (bugId) => api.get(`/functional-bugs/${bugId}`),
  start: (bugId) => api.post(`/functional-bugs/${bugId}/start`),
  getHint: (bugId) => api.post(`/functional-bugs/${bugId}/hint`),
  submit: (bugId, data) => api.post(`/functional-bugs/${bugId}/submit`, data),
  getUserProgress: (params) => api.get('/functional-bugs/user/progress', { params }),
  getLeaderboard: (params) => api.get('/functional-bugs/leaderboard', { params }),
  getStats: (bugId) => api.get(`/functional-bugs/${bugId}/stats`),
  create: (data) => api.post('/functional-bugs', data),
  update: (bugId, data) => api.put(`/functional-bugs/${bugId}`, data),
  delete: (bugId) => api.delete(`/functional-bugs/${bugId}`),
};

// Simple health-check helper
export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
  }
};

// Default export: grouped clients + raw axios instance
export default {
  ...api,
  auth: authAPI,
  questions: questionsAPI,
  quiz: quizAPI,
  progress: progressAPI,
  leaderboard: leaderboardAPI,
  achievements: achievementsAPI,
  admin: adminAPI,
  functionalBugs: functionalBugsAPI,
  testConnection,
};