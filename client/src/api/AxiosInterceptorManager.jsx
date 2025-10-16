import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from './axios';

const AxiosInterceptorManager = ({ children }) => {
  const { logout } = useAuth();

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const shouldLogout = 
          error.response?.status === 401 || 
          (error.response?.status === 403 && 
            (error.response.data?.message?.includes('expired') || 
             error.response.data?.message?.includes('Invalid token')));

        if (shouldLogout) {
          const url = error.config?.url || '';
          const isAuthEndpoint = url.includes('/login') || url.includes('/register');
          
          if (!isAuthEndpoint) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  return children;
};

export default AxiosInterceptorManager;
