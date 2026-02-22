import React from 'react';
import type { Category } from '../../types/category';
import './CategoryList.scss';

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  error: unknown;
  onRetry: () => void | Promise<unknown>;
  onCreateClick: () => void;
  onEditClick: (categoryId: number) => void;
  onDeleteClick: (categoryId: number) => void;
  deleteConfirmId: number | null;
  isDeleting: boolean;
  onConfirmDelete: (categoryId: number) => void;
  onCancelDelete: () => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  isLoading,
  error,
  onRetry,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  deleteConfirmId,
  isDeleting,
  onConfirmDelete,
  onCancelDelete,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="category-list">
        <div className="category-list__header">
          <h3 className="category-list__title">Categories</h3>
          <button
            className="category-list__create-btn"
            onClick={onCreateClick}
            disabled={isLoading}
          >
            + New Category
          </button>
        </div>
        <div className="category-list__loading">
          <div className="spinner" />
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="category-list">
        <div className="category-list__header">
          <h3 className="category-list__title">Categories</h3>
          <button
            className="category-list__create-btn"
            onClick={onCreateClick}
            disabled={isLoading}
          >
            + New Category
          </button>
        </div>
        <div className="category-list__error">
          <p className="category-list__error-message">
            Failed to load categories. Please try again.
          </p>
          <button
            className="category-list__retry-btn"
            onClick={onRetry}
            disabled={isLoading}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isEmpty = categories.length === 0;

  return (
    <div className="category-list">
      <div className="category-list__header">
        <h3 className="category-list__title">Categories</h3>
        <button
          className="category-list__create-btn"
          onClick={onCreateClick}
        >
          + New Category
        </button>
      </div>

      {isEmpty ? (
        <div className="category-list__empty">
          <p className="category-list__empty-message">
            No categories yet. Create one to organize your transactions.
          </p>
        </div>
      ) : (
        <div className="category-list__items">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-list__item ${
                deleteConfirmId === category.id ? 'category-list__item--deleting' : ''
              }`}
            >
              <div className="category-list__item-content">
                <p className="category-list__item-name">{category.name}</p>
                <p className="category-list__item-date">
                  Created: {new Date(category.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="category-list__item-actions">
                {deleteConfirmId === category.id ? (
                  <>
                    <p className="category-list__confirm-text">
                      Delete this category?
                    </p>
                    <button
                      className="category-list__action-btn category-list__action-btn--danger"
                      onClick={() => onConfirmDelete(category.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Confirm'}
                    </button>
                    <button
                      className="category-list__action-btn category-list__action-btn--secondary"
                      onClick={onCancelDelete}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="category-list__action-btn category-list__action-btn--primary"
                      onClick={() => onEditClick(category.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="category-list__action-btn category-list__action-btn--danger"
                      onClick={() => onDeleteClick(category.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
