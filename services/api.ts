import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Inspection endpoints
export const inspectionApi = {
  getAll: async () => {
    const response = await api.get('/inspections');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/inspections/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/inspections', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/inspections/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/inspections/${id}`);
    return response.data;
  },
};

// POI Instance endpoints
export const poiInstanceApi = {
  create: async (data: any) => {
    const response = await api.post('/poi-instances', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/poi-instances/${id}`, data);
    return response.data;
  },
};

// Photo endpoints
export const photoApi = {
  upload: async (file: File, inspectionId: string, poiInstanceId?: string, phaseNumber?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('inspectionId', inspectionId);
    if (poiInstanceId) formData.append('poiInstanceId', poiInstanceId);
    if (phaseNumber !== undefined) formData.append('phaseNumber', phaseNumber.toString());

    const response = await api.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getUrl: (photoUrl: string) => {
    if (photoUrl.startsWith('http')) return photoUrl;
    return `${API_BASE_URL}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
  },
};

// Delegated access endpoints
export const delegatedApi = {
  getInspection: async (token: string) => {
    const response = await api.get(`/delegated/${token}`);
    return response.data;
  },
  capturePhoto: async (token: string, data: any) => {
    const response = await api.post(`/delegated/${token}/capture`, data);
    return response.data;
  },
  generateToken: async (inspectionId: string) => {
    const response = await api.post(`/delegated/generate/${inspectionId}`);
    return response.data;
  },
};

export default api;

