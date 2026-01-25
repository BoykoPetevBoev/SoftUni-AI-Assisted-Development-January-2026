import React from 'react';
import './DeleteConfirmationModal.css';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Task</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="delete-modal-body">
          <div className="warning-icon">⚠️</div>
          <p className="delete-message">
            Are you sure you want to delete <strong>"{taskTitle}"</strong>?
          </p>
          <p className="delete-warning">This action cannot be undone.</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
};
