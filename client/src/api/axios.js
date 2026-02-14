import axios from 'axios';

// Automatically use local backend in development, production URL in production
const BASE_URL = import.meta.env.DEV ? 'http://localhost:5001/api' : import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 1000 * 3600,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Public API instance without authentication
const publicApi = axios.create({
    baseURL: BASE_URL,
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
        // Check if it's an admin route
        if (config.url?.startsWith('/admin')) {
            const adminSessionRaw = localStorage.getItem('admin_session');
            if (adminSessionRaw) {
                try {
                    const adminSession = JSON.parse(adminSessionRaw);
                    if (adminSession.accessToken) {
                        config.headers.Authorization = `Bearer ${adminSession.accessToken}`;
                        return config;
                    }
                } catch (e) {
                    console.error("Error parsing admin session:", e);
                }
            }
        }

        // Default to standard user token for non-admin routes
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