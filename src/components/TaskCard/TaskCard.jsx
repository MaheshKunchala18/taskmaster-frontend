import React, { useState, useMemo, useCallback, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faCheck, 
  faClock, 
  faCalendarAlt,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import './TaskCard.css';

const TaskCard = memo(({ 
  task, 
  onEdit, 
  onDelete, 
  onComplete, 
  variant = 'due'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDateTime = useMemo(() => {
    const memoizedFormatter = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString("en-GB", {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(',', '');
    };
    return memoizedFormatter;
  }, []);

  const variantClass = useMemo(() => {
    switch (variant) {
      case 'overdue':
        return 'task-card--overdue';
      case 'completed':
        return 'task-card--completed';
      default:
        return 'task-card--due';
    }
  }, [variant]);

  const taskIcon = useMemo(() => {
    switch (variant) {
      case 'overdue':
        return faExclamationTriangle;
      case 'completed':
        return faCheckCircle;
      default:
        return faCalendarAlt;
    }
  }, [variant]);

  const relativeTime = useMemo(() => {
    if (variant === 'completed' && task.completion_time) {
      const completionDate = new Date(task.completion_time);
      const now = new Date();
      const diffMs = now - completionDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          if (diffMinutes < 1) return 'just now';
          return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
        }
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
      } else if (diffDays === 1) {
        return '1 day ago';
      } else {
        return `${diffDays} days ago`;
      }
    }
    
    const date = new Date(task.due_time);
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      const absDays = Math.abs(diffDays);
      if (absDays === 1) return '1 day ago';
      return `${absDays} days ago`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `in ${diffDays} days`;
    }
  }, [task.due_time, task.completion_time, variant]);

  const formattedCreationTime = useMemo(() => 
    formatDateTime(task.creation_time), [task.creation_time, formatDateTime]
  );

  const formattedDueTime = useMemo(() => 
    formatDateTime(task.due_time), [task.due_time, formatDateTime]
  );

  const formattedEditTime = useMemo(() => 
    task.lastedited_time !== task.creation_time 
      ? formatDateTime(task.lastedited_time) 
      : '-', [task.lastedited_time, task.creation_time, formatDateTime]
  );

  const formattedCompletionTime = useMemo(() => 
    variant === 'completed' && task.completion_time 
      ? formatDateTime(task.completion_time) 
      : null, [variant, task.completion_time, formatDateTime]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleEditClick = useCallback(() => onEdit(task), [onEdit, task]);
  const handleDeleteClick = useCallback(() => onDelete(task), [onDelete, task]);
  const handleCompleteClick = useCallback(() => onComplete(task), [onComplete, task]);

  return (
    <div 
      className={`task-card ${variantClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="task-card__glow"></div>
      <div className="task-card__shimmer"></div>

      <div className="task-card__header">
        <div className="task-card__icon">
          <FontAwesomeIcon icon={taskIcon} />
        </div>
        <div className="task-card__relative-time">
          {relativeTime}
        </div>
      </div>

      <div className="task-card__content">
        <h3 className="task-card__title">{task.task_detail}</h3>
        
        <div className="task-card__details">
          <div className="task-detail-row">
            <FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
            <span className="detail-label">Created at:</span>
            <span className="detail-value">{formattedCreationTime}</span>
          </div>
          
          <div className="task-detail-row">
            <FontAwesomeIcon icon={faEdit} className="detail-icon" />
            <span className="detail-label">Last Edited at:</span>
            <span className="detail-value">{formattedEditTime}</span>
          </div>
          
          <div className="task-detail-row">
            <FontAwesomeIcon icon={faClock} className="detail-icon" />
            <span className="detail-label">Due at:</span>
            <span className="detail-value">{formattedDueTime}</span>
          </div>

          {formattedCompletionTime && (
            <div className="task-detail-row">
              <FontAwesomeIcon icon={faCheck} className="detail-icon" />
              <span className="detail-label">Completed at:</span>
              <span className="detail-value">{formattedCompletionTime}</span>
            </div>
          )}
        </div>
      </div>

      <div className={`task-card__actions ${isHovered || variant === 'completed' ? 'task-card__actions--visible' : ''}`}>
        {variant !== 'completed' && (
          <>
            <button 
              className="task-card__action task-card__action--edit"
              onClick={handleEditClick}
              title="Edit Task"
            >
              <FontAwesomeIcon icon={faEdit} />
              <span>Edit</span>
            </button>
            
            <button 
              className="task-card__action task-card__action--complete"
              onClick={handleCompleteClick}
              title="Complete Task"
            >
              <FontAwesomeIcon icon={faCheck} />
              <span>Complete</span>
            </button>
          </>
        )}
        
        <button 
          className="task-card__action task-card__action--delete"
          onClick={handleDeleteClick}
          title="Delete Task"
        >
          <FontAwesomeIcon icon={faTrash} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.task._id === nextProps.task._id &&
    prevProps.task.task_detail === nextProps.task.task_detail &&
    prevProps.task.due_time === nextProps.task.due_time &&
    prevProps.task.creation_time === nextProps.task.creation_time &&
    prevProps.task.lastedited_time === nextProps.task.lastedited_time &&
    prevProps.task.completion_time === nextProps.task.completion_time &&
    prevProps.variant === nextProps.variant &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onComplete === nextProps.onComplete
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard; 