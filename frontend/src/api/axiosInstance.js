import axios from 'axios';
import { useAuthStore } from '../store/authStore.js';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Attach access token from zustand store to each request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: attempt a single refresh on 401 then retry original request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint directly using axios to avoid circular imports
        const refreshResp = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
        const newToken = refreshResp?.data?.accessToken || refreshResp?.data?.token || refreshResp?.data?.access_token;
        if (newToken) {
          useAuthStore.getState().setAuth({ token: newToken, refreshToken: null, owner: useAuthStore.getState().owner });
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // fallthrough to logout below
      }
    }

    if (status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export { api };