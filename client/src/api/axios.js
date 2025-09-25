import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

let navigate = null;
export const setNavigate = (navigateFunction) => {
    navigate = navigateFunction;
};

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

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url || '';
            const isAuthEndpoint = url.includes('/auth/login') || 
                                 url.includes('/auth/register') || 
                                 url.includes('/auth/seller-login') || 
                                 url.includes('/auth/seller-register');
            
            if (!isAuthEndpoint) {
                localStorage.removeItem('token');
                if (navigate) {
                    navigate('/');
                } else {
                    window.location.href = '/';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;