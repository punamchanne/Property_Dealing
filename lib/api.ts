import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
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
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// API endpoints
export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me')
};

export const propertiesAPI = {
    getAll: (params?: any) => api.get('/properties', { params }),
    getById: (id: string) => api.get(`/properties/${id}`),
    create: (data: any) => api.post('/properties', data),
    update: (id: string, data: any) => api.put(`/properties/${id}`, data),
    delete: (id: string) => api.delete(`/properties/${id}`),
    approve: (id: string, approved: boolean) => api.put(`/properties/${id}/approve`, { approved }),
    getMyProperties: () => api.get('/properties/owner/my-properties')
};

export const meetingsAPI = {
    create: (data: any) => api.post('/meetings', data),
    getAll: (params?: any) => api.get('/meetings', { params }),
    getAllAdmin: () => api.get('/meetings/admin'),
    update: (id: string, data: any) => api.put(`/meetings/${id}`, data),
    delete: (id: string) => api.delete(`/meetings/${id}`)
};

export const usersAPI = {
    getAll: () => api.get('/users'),
    updateRole: (id: string, role: string) => api.put(`/users/${id}/role`, { role }),
    addFavorite: (propertyId: string) => api.post(`/users/favorites/${propertyId}`),
    removeFavorite: (propertyId: string) => api.delete(`/users/favorites/${propertyId}`),
    getFavorites: () => api.get('/users/favorites')
};

export const uploadAPI = {
    uploadImage: (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadImages: (files: File[]) => {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        return api.post('/upload/images', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadModel: (file: File) => {
        const formData = new FormData();
        formData.append('model', file);
        return api.post('/upload/model', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    upload360: (file: File, roomName: string) => {
        const formData = new FormData();
        formData.append('image360', file);
        formData.append('roomName', roomName);
        return api.post('/upload/360', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};
