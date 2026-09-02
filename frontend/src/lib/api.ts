import axios from 'axios';

const readStoredAuth = () => {
  if (typeof window === 'undefined') return {};
  const raw = window.localStorage.getItem('kcube-app-state');
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.state?.token as string | undefined,
      refreshToken: parsed?.state?.refreshToken as string | undefined,
    };
  } catch {
    return {};
  }
};

const writeStoredToken = (token: string) => {
  if (typeof window === 'undefined') return;
  const raw = window.localStorage.getItem('kcube-app-state');
  if (!raw) return;
  const parsed = JSON.parse(raw);
  parsed.state = { ...parsed.state, token };
  window.localStorage.setItem('kcube-app-state', JSON.stringify(parsed));
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const { token } = readStoredAuth();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const { refreshToken } = readStoredAuth();
    if (error.response?.status === 401 && refreshToken && !original?._retry && !String(original?.url || '').includes('/auth/refresh')) {
      original._retry = true;
      const response = await api.post('/auth/refresh', { refreshToken });
      const token = response.data?.data?.token || response.data?.token;
      if (token) {
        writeStoredToken(token);
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
