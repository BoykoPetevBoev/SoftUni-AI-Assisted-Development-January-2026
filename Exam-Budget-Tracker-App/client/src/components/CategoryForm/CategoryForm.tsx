import React from 'react';
import { useCategoryForm } from '../../hooks/useCategoryForm';
import './CategoryForm.scss';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: number;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  isOpen,
  onClose,
  categoryId,
}) => {
  const { isEditMode, isLoading, register, handleSubmit, errors, onSubmit } =
    useCategoryForm({ categoryId, onClose });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="category-form-modal">
      <div className="category-form-modal__overlay" onClick={onClose} />
      <div className="category-form-modal__content">
        <div className="category-form-modal__header">
          <h2 className="category-form-modal__title">
            {isEditMode ? 'Edit Category' : 'Create Category'}
          </h2>
          <button
            className="category-form-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="category-form-modal__form"
        >
          {/* Category Name Field */}
          <div className="form-group">
            <label htmlFor="name" className="form-group__label">
              Category Name<span className="form-group__required">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Groceries"
              className={`form-group__input ${
                errors.name ? 'form-group__input--error' : ''
              }`}
              {...register('name')}
            />
            {errors.name && (
              <p className="form-group__error">{errors.name.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="category-form-modal__actions">
            <button
              type="button"
              className="category-form-modal__btn category-form-modal__btn--cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="category-form-modal__btn category-form-modal__btn--submit"
              disabled={isLoading}
            >
              {isLoading
                ? 'Saving...'
                : isEditMode
                  ? 'Update Category'
                  : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
