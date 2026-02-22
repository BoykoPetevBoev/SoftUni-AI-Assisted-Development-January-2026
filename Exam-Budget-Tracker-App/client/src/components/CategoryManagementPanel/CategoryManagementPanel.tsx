import React, { useState } from 'react';
import { CategoryForm } from '../CategoryForm';
import { CategoryList } from '../CategoryList';
import { useCategoryList } from '../../hooks/useCategoryList';
import './CategoryManagementPanel.scss';

interface CategoryManagementPanelViewProps {
  isFormOpen: boolean;
  editingCategoryId: number | undefined;
  onFormClose: () => void;
  categories: Array<{ id: number; name: string; created_at: string; updated_at: string; user: number }>;
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

/**
 * Pure presentational subcomponent
 */
const CategoryManagementPanelView: React.FC<CategoryManagementPanelViewProps> = ({
  isFormOpen,
  editingCategoryId,
  onFormClose,
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
}) => (
  <div className="category-management-panel">
    <CategoryForm
      isOpen={isFormOpen}
      onClose={onFormClose}
      categoryId={editingCategoryId}
    />
    <CategoryList
      categories={categories}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      onCreateClick={onCreateClick}
      onEditClick={onEditClick}
      onDeleteClick={onDeleteClick}
      deleteConfirmId={deleteConfirmId}
      isDeleting={isDeleting}
      onConfirmDelete={onConfirmDelete}
      onCancelDelete={onCancelDelete}
    />
  </div>
);

/**
 * CategoryManagementPanel: Self-contained component that manages category CRUD operations
 * Combines the form modal and list in one place
 */
export const CategoryManagementPanel: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | undefined>();

  const {
    categories,
    isLoading,
    error,
    refetch,
    deleteConfirmId,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useCategoryList();

  const handleCreateClick = () => {
    setEditingCategoryId(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (categoryId: number) => {
    setEditingCategoryId(categoryId);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategoryId(undefined);
  };

  return (
    <CategoryManagementPanelView
      isFormOpen={isFormOpen}
      editingCategoryId={editingCategoryId}
      onFormClose={handleFormClose}
      categories={categories}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      onCreateClick={handleCreateClick}
      onEditClick={handleEditClick}
      onDeleteClick={handleDeleteClick}
      deleteConfirmId={deleteConfirmId}
      isDeleting={isDeleting}
      onConfirmDelete={handleConfirmDelete}
      onCancelDelete={handleCancelDelete}
    />
  );
};
