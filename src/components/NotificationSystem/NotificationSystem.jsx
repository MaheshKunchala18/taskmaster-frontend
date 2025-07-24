import React, { useState, useEffect, useCallback, createContext, useContext, useMemo, memo } from 'react';
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

const NotificationMethodsContext = createContext();
const NotificationListContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationMethodsContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const useNotificationList = () => {
  const context = useContext(NotificationListContext);
  if (!context) {
    throw new Error('useNotificationList must be used within a NotificationProvider');
  }
  return context;
};

const NotificationItem = memo(({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  }, [onRemove, notification.id]);

  useEffect(() => {
    if (notification.duration !== 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, notification.duration || 4000);

      return () => clearTimeout(timer);
    }
  }, [notification, handleRemove]);

  const icon = useMemo(() => {
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
  }, [notification.type]);

  const typeClass = useMemo(() => {
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
  }, [notification.type]);

  const notificationClasses = useMemo(() => [
    'notification',
    typeClass,
    isVisible ? 'notification--visible' : '',
    isRemoving ? 'notification--removing' : ''
  ].filter(Boolean).join(' '), [typeClass, isVisible, isRemoving]);

  return (
    <div className={notificationClasses}>
      <div className="notification__icon">
        <FontAwesomeIcon icon={icon} />
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
}, (prevProps, nextProps) => {
  return (
    prevProps.notification.id === nextProps.notification.id &&
    prevProps.notification.type === nextProps.notification.type &&
    prevProps.notification.title === nextProps.notification.title &&
    prevProps.notification.message === nextProps.notification.message &&
    prevProps.onRemove === nextProps.onRemove
  );
});

NotificationItem.displayName = 'NotificationItem';

const NotificationContainer = memo(() => {
  const { notifications, removeNotification } = useNotificationList();

  const notificationItems = useMemo(() =>
    notifications.map(notification => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onRemove={removeNotification}
      />
    )), [notifications, removeNotification]
  );

  return (
    <div className="notification-container">
      {notificationItems}
    </div>
  );
});

NotificationContainer.displayName = 'NotificationContainer';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 4000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((title, message, duration) =>
    addNotification({ type: 'success', title, message, duration }), [addNotification]);

  const showError = useCallback((title, message, duration) =>
    addNotification({ type: 'error', title, message, duration }), [addNotification]);

  const showWarning = useCallback((title, message, duration) =>
    addNotification({ type: 'warning', title, message, duration }), [addNotification]);

  const showInfo = useCallback((title, message, duration) =>
    addNotification({ type: 'info', title, message, duration }), [addNotification]);

  const showTaskAdded = useCallback((taskName) =>
    addNotification({
      type: 'taskAdded',
      title: 'Task Added',
      message: `"${taskName}" has been added to your list`,
      duration: 3000
    }), [addNotification]);

  const showTaskCompleted = useCallback((taskName) =>
    addNotification({
      type: 'taskCompleted',
      title: 'Task Completed',
      message: `"${taskName}" marked as completed`,
      duration: 3000
    }), [addNotification]);

  const showTaskDeleted = useCallback((taskName) =>
    addNotification({
      type: 'taskDeleted',
      title: 'Task Deleted',
      message: `"${taskName}" has been removed`,
      duration: 3000
    }), [addNotification]);

  const showTaskEdited = useCallback((taskName) =>
    addNotification({
      type: 'taskEdited',
      title: 'Task Updated',
      message: `"${taskName}" has been modified`,
      duration: 3000
    }), [addNotification]);

  const methodsContextValue = useMemo(() => ({
    addNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showTaskAdded,
    showTaskCompleted,
    showTaskDeleted,
    showTaskEdited,
  }), [
    addNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showTaskAdded,
    showTaskCompleted,
    showTaskDeleted,
    showTaskEdited,
  ]);

  const listContextValue = useMemo(() => ({
    notifications,
    removeNotification,
  }), [notifications, removeNotification]);

  return (
    <NotificationMethodsContext.Provider value={methodsContextValue}>
      <NotificationListContext.Provider value={listContextValue}>
        {children}
        <NotificationContainer />
      </NotificationListContext.Provider>
    </NotificationMethodsContext.Provider>
  );
};

export default NotificationProvider; 