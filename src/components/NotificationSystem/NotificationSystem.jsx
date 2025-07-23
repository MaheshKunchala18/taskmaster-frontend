import React, { useState, useEffect, createContext, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faExclamationTriangle, 
  faInfoCircle, 
  faTimes,
  faTrash,
  faEdit,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import './NotificationSystem.css';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const NotificationItem = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notification.duration !== 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, notification.duration || 4000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return faCheck;
      case 'error':
        return faExclamationTriangle;
      case 'warning':
        return faExclamationTriangle;
      case 'taskAdded':
        return faPlus;
      case 'taskDeleted':
        return faTrash;
      case 'taskEdited':
        return faEdit;
      case 'taskCompleted':
        return faCheck;
      default:
        return faInfoCircle;
    }
  };

  const getTypeClass = () => {
    switch (notification.type) {
      case 'success':
      case 'taskAdded':
      case 'taskCompleted':
        return 'notification--success';
      case 'error':
        return 'notification--error';
      case 'warning':
        return 'notification--warning';
      case 'taskDeleted':
        return 'notification--deleted';
      case 'taskEdited':
        return 'notification--edited';
      default:
        return 'notification--info';
    }
  };

  return (
    <div 
      className={`notification ${getTypeClass()} ${isVisible ? 'notification--visible' : ''} ${isRemoving ? 'notification--removing' : ''}`}
    >
      <div className="notification__icon">
        <FontAwesomeIcon icon={getIcon()} />
      </div>
      
      <div className="notification__content">
        <div className="notification__title">{notification.title}</div>
        {notification.message && (
          <div className="notification__message">{notification.message}</div>
        )}
      </div>

      <button 
        className="notification__close"
        onClick={handleRemove}
        aria-label="Close notification"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <div className="notification__progress">
        <div className="notification__progress-bar"></div>
      </div>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 4000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Convenience methods for different notification types
  const showSuccess = (title, message, duration) => 
    addNotification({ type: 'success', title, message, duration });

  const showError = (title, message, duration) => 
    addNotification({ type: 'error', title, message, duration });

  const showWarning = (title, message, duration) => 
    addNotification({ type: 'warning', title, message, duration });

  const showInfo = (title, message, duration) => 
    addNotification({ type: 'info', title, message, duration });

  // Task-specific notifications
  const showTaskAdded = (taskName) => 
    addNotification({ 
      type: 'taskAdded', 
      title: 'Task Added', 
      message: `"${taskName}" has been added to your list`,
      duration: 3000
    });

  const showTaskCompleted = (taskName) => 
    addNotification({ 
      type: 'taskCompleted', 
      title: 'Task Completed', 
      message: `"${taskName}" marked as completed`,
      duration: 3000
    });

  const showTaskDeleted = (taskName) => 
    addNotification({ 
      type: 'taskDeleted', 
      title: 'Task Deleted', 
      message: `"${taskName}" has been removed`,
      duration: 3000
    });

  const showTaskEdited = (taskName) => 
    addNotification({ 
      type: 'taskEdited', 
      title: 'Task Updated', 
      message: `"${taskName}" has been modified`,
      duration: 3000
    });

  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showTaskAdded,
    showTaskCompleted,
    showTaskDeleted,
    showTaskEdited,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div className="notification-container">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider; 