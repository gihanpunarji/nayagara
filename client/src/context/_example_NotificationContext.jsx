// 🔔 EXAMPLE: Notification Context (Toast Messages)
// This shows how to create global notification/toast system
// Usage: const { showSuccess, showError, showInfo } = useNotification();

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

// Individual notification component
const NotificationItem = ({ notification, onRemove }) => {
  const { id, type, title, message, duration } = notification;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Auto remove after duration
  React.useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  return (
    <div className={`flex items-start p-4 mb-3 border rounded-lg shadow-sm ${getStyles()}`}>
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold mb-1">{title}</h4>
        )}
        <p className="text-sm">{message}</p>
      </div>

      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      duration: 5000, // Default 5 seconds
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    return id;
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, title, options = {}) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, title, options = {}) => {
    return addNotification({
      type: 'error',
      title: title || 'Error',
      message,
      duration: 8000, // Longer duration for errors
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, title, options = {}) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, title, options = {}) => {
    return addNotification({
      type: 'warning',
      title: title || 'Warning',
      message,
      ...options
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Notification Container */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 w-96 max-w-sm">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRemove={removeNotification}
            />
          ))}

          {notifications.length > 1 && (
            <button
              onClick={clearAll}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Clear all notifications
            </button>
          )}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// 🎯 HOW TO USE:
/*
// 1. Wrap your app:
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <YourAppComponents />
    </NotificationProvider>
  );
}

// 2. Use in components:
import { useNotification } from '../context/NotificationContext';

function ProductForm() {
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async (productData) => {
    try {
      await api.post('/products', productData);

      showSuccess(
        'Product has been created successfully!',
        'Product Created'
      );

    } catch (error) {
      showError(
        error.response?.data?.message || 'Failed to create product',
        'Creation Failed'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      // ... form fields
    </form>
  );
}

// 3. Advanced usage with custom options:
function AdvancedExample() {
  const { addNotification } = useNotification();

  const showCustomNotification = () => {
    addNotification({
      type: 'info',
      title: 'Custom Notification',
      message: 'This will stay for 10 seconds',
      duration: 10000
    });
  };

  const showPermanentNotification = () => {
    addNotification({
      type: 'warning',
      title: 'Important',
      message: 'This notification will stay until manually closed',
      duration: 0 // 0 means no auto-remove
    });
  };

  return (
    <div>
      <button onClick={showCustomNotification}>
        Show Custom Notification
      </button>
      <button onClick={showPermanentNotification}>
        Show Permanent Notification
      </button>
    </div>
  );
}
*/