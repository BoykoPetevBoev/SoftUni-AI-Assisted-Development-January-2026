import React from 'react';
import './LoadingSkeleton.css';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="skeleton-grid">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-header">
            <div className="skeleton-title"></div>
            <div className="skeleton-badge"></div>
          </div>
          <div className="skeleton-description"></div>
          <div className="skeleton-description short"></div>
          <div className="skeleton-footer">
            <div className="skeleton-date"></div>
            <div className="skeleton-actions">
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
