import React from 'react';
import { TaskStatus } from '../types/task.types';
import './StatusBadge.css';

interface StatusBadgeProps {
  status: TaskStatus;
}

const statusConfig = {
  [TaskStatus.TODO]: { label: 'To Do', className: 'status-todo' },
  [TaskStatus.IN_PROGRESS]: { label: 'In Progress', className: 'status-in-progress' },
  [TaskStatus.COMPLETED]: { label: 'Completed', className: 'status-completed' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];

  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
};
