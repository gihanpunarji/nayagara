// 🌐 EXAMPLE: Shared API Hook
// This shows how to create a reusable hook for API calls with loading states
// Usage: const { data, loading, error, execute } = useApi();

import { useState, useCallback } from 'react';
import axios from 'axios';

export const useApi = (initialUrl = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (url = initialUrl, options = {}) => {
    if (!url) {
      setError('No URL provided');
      return { success: false, error: 'No URL provided' };
    }

    setLoading(true);
    setError(null);

    try {
      const {
        method = 'GET',
        data: requestData = null,
        headers = {},
        ...otherOptions
      } = options;

      // Get auth token from localStorage
      const token = localStorage.getItem('token') ||
                   localStorage.getItem('seller_token') ||
                   localStorage.getItem('admin_token');

      const config = {
        method,
        url,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers
        },
        ...(requestData && { data: requestData }),
        ...otherOptions
      };

      const response = await axios(config);

      setData(response.data);
      return {
        success: true,
        data: response.data,
        status: response.status
      };

    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'An error occurred';

      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        status: err.response?.status
      };

    } finally {
      setLoading(false);
    }
  }, [initialUrl]);

  // Convenience methods
  const get = useCallback((url, config = {}) => {
    return execute(url, { method: 'GET', ...config });
  }, [execute]);

  const post = useCallback((url, data, config = {}) => {
    return execute(url, { method: 'POST', data, ...config });
  }, [execute]);

  const put = useCallback((url, data, config = {}) => {
    return execute(url, { method: 'PUT', data, ...config });
  }, [execute]);

  const del = useCallback((url, config = {}) => {
    return execute(url, { method: 'DELETE', ...config });
  }, [execute]);

  // Reset state
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    // State
    data,
    loading,
    error,

    // Methods
    execute,
    get,
    post,
    put,
    delete: del,
    reset,

    // Status checks
    isSuccess: !loading && !error && data !== null,
    isError: !loading && error !== null,
    isLoading: loading
  };
};

// 🎯 HOW TO USE IN COMPONENTS:
/*
import { useApi } from '../hooks/shared/useApi';

function UserProfile() {
  const { data: user, loading, error, get } = useApi();

  useEffect(() => {
    // Load user profile on mount
    get('/api/user/profile');
  }, [get]);

  const handleUpdateProfile = async (profileData) => {
    const result = await post('/api/user/profile', profileData);

    if (result.success) {
      toast.success('Profile updated!');
    } else {
      toast.error(result.error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={() => handleUpdateProfile({ name: 'New Name' })}>
        Update Profile
      </button>
    </div>
  );
}

// Alternative: Quick API call without state management
function QuickExample() {
  const api = useApi();

  const handleQuickAction = async () => {
    const result = await api.post('/api/quick-action', { action: 'test' });

    if (result.success) {
      alert('Success!');
    } else {
      alert('Error: ' + result.error);
    }
  };

  return <button onClick={handleQuickAction}>Quick Action</button>;
}
*/