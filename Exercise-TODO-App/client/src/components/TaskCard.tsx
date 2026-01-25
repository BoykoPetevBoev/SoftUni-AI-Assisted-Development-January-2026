import React, { useState } from 'react';
import { Task, TaskStatus } from '../types/task.types';
import { StatusBadge } from './StatusBadge';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus !== task.status) {
      onStatusChange(task._id, newStatus);
    }
    setIsStatusMenuOpen(false);
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="status-dropdown">
          <button
            className="status-button"
            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
            aria-label="Change status"
          >
            <StatusBadge status={task.status} />
            <span className="dropdown-arrow">▼</span>
          </button>
          {isStatusMenuOpen && (
            <>
              <div
                className="status-dropdown-backdrop"
                onClick={() => setIsStatusMenuOpen(false)}
              />
              <div className="status-dropdown-menu">
                <button
                  className="status-option"
                  onClick={() => handleStatusChange(TaskStatus.TODO)}
                >
                  <StatusBadge status={TaskStatus.TODO} />
                </button>
                <button
                  className="status-option"
                  onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
                >
                  <StatusBadge status={TaskStatus.IN_PROGRESS} />
                </button>
                <button
                  className="status-option"
                  onClick={() => handleStatusChange(TaskStatus.COMPLETED)}
                >
                  <StatusBadge status={TaskStatus.COMPLETED} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <div className="task-dates">
          <span className="task-date" title="Created">
            📅 {formatDate(task.createdAt)}
          </span>
          {task.updatedAt !== task.createdAt && (
            <span className="task-date" title="Last updated">
              ✏️ {formatDate(task.updatedAt)}
            </span>
          )}
        </div>
        <div className="task-actions">
          <button
            className="action-btn edit-btn"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(task)}
            aria-label="Delete task"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};
