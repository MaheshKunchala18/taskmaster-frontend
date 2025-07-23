import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faCheck, 
  faClock, 
  faCalendarAlt,
  faGripVertical,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import './TaskCard.css';

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onComplete, 
  variant = 'due',
  isDragging = false,
  dragHandleProps = {},
  ...dragProps 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDateTime = (dateString) => {
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

  const getVariantClass = () => {
    switch (variant) {
      case 'overdue':
        return 'task-card--overdue';
      case 'completed':
        return 'task-card--completed';
      default:
        return 'task-card--due';
    }
  };

  const getTaskIcon = () => {
    switch (variant) {
      case 'overdue':
        return faExclamationTriangle;
      case 'completed':
        return faCheckCircle;
      default:
        return faCalendarAlt;
    }
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
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
  };

  return (
    <div 
      className={`task-card ${getVariantClass()} ${isDragging ? 'task-card--dragging' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...dragProps}
    >
      {/* Drag Handle */}
      <div className="task-card__drag-handle" {...dragHandleProps}>
        <FontAwesomeIcon icon={faGripVertical} />
      </div>

      {/* Background Elements */}
      <div className="task-card__glow"></div>
      <div className="task-card__shimmer"></div>

      {/* Header */}
      <div className="task-card__header">
        <div className="task-card__icon">
          <FontAwesomeIcon icon={getTaskIcon()} />
        </div>
        <div className="task-card__relative-time">
          {formatRelativeTime(task.due_time)}
        </div>
      </div>

      {/* Content */}
      <div className="task-card__content">
        <h3 className="task-card__title">{task.task_detail}</h3>
        
        <div className="task-card__details">
          <div className="task-detail-row">
            <FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
            <span className="detail-label">Created at:</span>
            <span className="detail-value">{formatDateTime(task.creation_time)}</span>
          </div>
          
          {task.lastedited_time !== task.creation_time && (
            <div className="task-detail-row">
              <FontAwesomeIcon icon={faEdit} className="detail-icon" />
              <span className="detail-label">Last Edited at:</span>
              <span className="detail-value">{formatDateTime(task.lastedited_time)}</span>
            </div>
          )}
          
          <div className="task-detail-row">
            <FontAwesomeIcon icon={faClock} className="detail-icon" />
            <span className="detail-label">Due at:</span>
            <span className="detail-value">{formatDateTime(task.due_time)}</span>
          </div>

          {variant === 'completed' && task.completion_time && (
            <div className="task-detail-row">
              <FontAwesomeIcon icon={faCheck} className="detail-icon" />
              <span className="detail-label">Completed at:</span>
              <span className="detail-value">{formatDateTime(task.completion_time)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar for Due Tasks */}
      {variant === 'due' && (
        <div className="task-card__progress">
          <div className="task-card__progress-bar"></div>
        </div>
      )}

      {/* Actions */}
      <div className={`task-card__actions ${isHovered || variant === 'completed' ? 'task-card__actions--visible' : ''}`}>
        {variant !== 'completed' && (
          <>
            <button 
              className="task-card__action task-card__action--edit"
              onClick={() => onEdit(task)}
              title="Edit Task"
            >
              <FontAwesomeIcon icon={faEdit} />
              <span>Edit</span>
            </button>
            
            <button 
              className="task-card__action task-card__action--complete"
              onClick={() => onComplete(task)}
              title="Complete Task"
            >
              <FontAwesomeIcon icon={faCheck} />
              <span>Complete</span>
            </button>
          </>
        )}
        
        <button 
          className="task-card__action task-card__action--delete"
          onClick={() => onDelete(task)}
          title="Delete Task"
        >
          <FontAwesomeIcon icon={faTrash} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default TaskCard; 