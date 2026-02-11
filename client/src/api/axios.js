import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 1000 * 3600,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Public API instance without authentication
const publicApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
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

export default api;
export { publicApi };