import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API Base URL:', API_BASE_URL);

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { email: string; password: string; gym_name: string; full_name: string }) =>
    api.post('/api/v1/auth/register', data),
  
  login: (email: string, password: string) =>
    api.post('/api/v1/auth/login/json', { email, password }),
};

export const instagramAPI = {
  getAuthUrl: () => api.get('/api/v1/instagram/auth-url'),
  connect: (data: { username: string; access_token: string; token_expires_at?: string }) =>
    api.post('/api/v1/instagram/connect', data),
  getAccounts: () => api.get('/api/v1/instagram/accounts'),
  syncPosts: (accountId: number) => api.post(`/api/v1/instagram/sync/${accountId}`),
};

export const predictionAPI = {
  predictEngagement: (data: { caption?: string; media_type?: string; offer_type?: string; hashtags?: string[] }) =>
    api.post('/api/v1/predict/engagement', data),

  predictConversion: (data: { caption?: string; media_type?: string; offer_type?: string; hashtags?: string[] }) =>
    api.post('/api/v1/predict/conversion', data),

  predictTiming: () => api.post('/api/v1/predict/timing'),

  recommendOffer: (data: { caption?: string; media_type?: string; offer_type?: string; hashtags?: string[] }) =>
    api.post('/api/v1/predict/offer', data),

  recommendHashtags: (data: { caption?: string; media_type?: string; offer_type?: string; hashtags?: string[] }) =>
    api.post('/api/v1/predict/hashtags', data),

  getHistory: () => api.get('/api/v1/predict/history'),
};

export default api;
