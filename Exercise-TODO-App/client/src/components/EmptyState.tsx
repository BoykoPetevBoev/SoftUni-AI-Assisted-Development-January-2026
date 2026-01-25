import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  message, 
  icon = '📋' 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
    </div>
  );
};
