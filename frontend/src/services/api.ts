import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if user was previously authenticated
      const hadToken = localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect if user had a token (was logged in but token expired/invalid)
      // Don't redirect for public pages where 401 is expected
      if (hadToken && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

// Leagues API
export const leaguesAPI = {
  getAll: () => api.get('/leagues'),
  getOne: (id: string) => api.get(`/leagues/${id}`),
  create: (data: any) => api.post('/leagues', data),
  update: (id: string, data: any) => api.patch(`/leagues/${id}`, data),
  delete: (id: string) => api.delete(`/leagues/${id}`),
};

// Divisions API
export const divisionsAPI = {
  getAll: (leagueId?: string) => api.get('/divisions', { params: { leagueId } }),
  getOne: (id: string) => api.get(`/divisions/${id}`),
  create: (data: any) => api.post('/divisions', data),
  update: (id: string, data: any) => api.patch(`/divisions/${id}`, data),
  delete: (id: string) => api.delete(`/divisions/${id}`),
};

// Teams API
export const teamsAPI = {
  getAll: (divisionId?: string) => api.get('/teams', { params: { divisionId } }),
  getOne: (id: string) => api.get(`/teams/${id}`),
  create: (data: any) => api.post('/teams', data),
  update: (id: string, data: any) => api.patch(`/teams/${id}`, data),
  delete: (id: string) => api.delete(`/teams/${id}`),
};

// Players API
export const playersAPI = {
  getAll: (teamId?: string) => api.get('/players', { params: { teamId } }),
  getOne: (id: string) => api.get(`/players/${id}`),
  create: (data: any) => api.post('/players', data),
  update: (id: string, data: any) => api.patch(`/players/${id}`, data),
  delete: (id: string) => api.delete(`/players/${id}`),
};

// Matches API
export const matchesAPI = {
  getAll: (divisionId?: string) => api.get('/matches', { params: { divisionId } }),
  getOne: (id: string) => api.get(`/matches/${id}`),
  create: (data: any) => api.post('/matches', data),
  update: (id: string, data: any) => api.patch(`/matches/${id}`, data),
  delete: (id: string) => api.delete(`/matches/${id}`),
  start: (id: string) => api.post(`/matches/${id}/start`),
  end: (id: string) => api.post(`/matches/${id}/end`),
  recordEvent: (id: string, data: any) => api.post(`/matches/${id}/events`, data),
};

// Standings API
export const standingsAPI = {
  get: (divisionId: string) => api.get(`/standings/division/${divisionId}`),
  calculate: (divisionId: string) => api.post(`/standings/division/${divisionId}/calculate`),
};
