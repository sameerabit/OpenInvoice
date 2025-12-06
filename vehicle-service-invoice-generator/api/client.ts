import axios from 'axios';

const baseURL = ((import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '');

const api = axios.create({
  baseURL,
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const loginRequest = (username: string, password: string) =>
  api.post('/login', { email: username, password }).then((res) => res.data as { token: string });

export default api;

