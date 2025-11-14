import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axios';

const AdminAxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const shouldRefresh = 
          (error.response?.status === 401 || error.response?.status === 403) &&
          (error.response.data?.message?.includes('expired') || 
           error.response.data?.message?.includes('Invalid token')) &&
          !originalRequest._retry;

        if (shouldRefresh && originalRequest.url.startsWith('/admin')) {
          originalRequest._retry = true;
          const sessionDataString = localStorage.getItem('admin_session');
          if (sessionDataString) {
            try {
              const sessionData = JSON.parse(sessionDataString);
              const { refreshToken } = sessionData;

              const res = await api.post('/auth/admin/refresh-token', { refreshToken });

              if (res.data.success && res.data.accessToken) {
                const newSessionData = {
                  ...sessionData,
                  accessToken: res.data.accessToken,
                };
                localStorage.setItem('admin_session', JSON.stringify(newSessionData));
                api.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
                return api(originalRequest);
              }
            } catch (refreshError) {
              localStorage.removeItem('admin_session');
              navigate('/admin/login');
              return Promise.reject(refreshError);
            }
          }
        }
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            const url = error.config?.url || '';
            if (url.startsWith('/admin')) {
                localStorage.removeItem('admin_session');
                navigate('/admin/login');
            }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return children;
};

export default AdminAxiosInterceptor;
