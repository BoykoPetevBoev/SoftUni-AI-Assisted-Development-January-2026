import type { StoryObj } from '@storybook/react';
import { CategoryList } from './CategoryList';
import type { Category } from '../../types/category';

const meta = {
  title: 'Components/CategoryList',
  component: CategoryList,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const mockCategories: Category[] = [
  {
    id: 1,
    user: 1,
    name: 'Groceries',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-05T10:30:00Z',
  },
  {
    id: 2,
    user: 1,
    name: 'Transport',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-04T15:45:00Z',
  },
  {
    id: 3,
    user: 1,
    name: 'Entertainment',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-06T08:20:00Z',
  },
];

const mockCallbacks = {
  onCreateClick: () => console.log('Create clicked'),
  onEditClick: (id: number) => console.log('Edit clicked:', id),
  onDeleteClick: (id: number) => console.log('Delete clicked:', id),
  onConfirmDelete: (id: number) => console.log('Confirm delete:', id),
  onCancelDelete: () => console.log('Cancel delete'),
  onRetry: () => console.log('Retry'),
};

/**
 * Category List with Multiple Items
 * Shows a list of categories with edit and delete options
 */
export const WithCategories: Story = {
  args: {
    categories: mockCategories,
    isLoading: false,
    error: null,
    deleteConfirmId: null,
    isDeleting: false,
    ...mockCallbacks,
  },
};

/**
 * Empty State
 * Shows the empty state when no categories exist
 */
export const Empty: Story = {
  args: {
    categories: [],
    isLoading: false,
    error: null,
    deleteConfirmId: null,
    isDeleting: false,
    ...mockCallbacks,
  },
};

/**
 * Loading State
 * Shows the loading indicator while categories are being fetched
 */
export const Loading: Story = {
  args: {
    categories: [],
    isLoading: true,
    error: null,
    deleteConfirmId: null,
    isDeleting: false,
    ...mockCallbacks,
  },
};

/**
 * Error State
 * Shows the error message with retry button
 */
export const ErrorState: Story = {
  args: {
    categories: [],
    isLoading: false,
    error: new Error('Failed to load categories'),
    deleteConfirmId: null,
    isDeleting: false,
    ...mockCallbacks,
  },
};

/**
 * Delete Confirmation
 * Shows the delete confirmation for a specific category
 */
export const DeleteConfirmation: Story = {
  args: {
    categories: mockCategories,
    isLoading: false,
    error: null,
    deleteConfirmId: 1,
    isDeleting: false,
    ...mockCallbacks,
  },
};

/**
 * Deleting State
 * Shows the loading state during deletion
 */
export const Deleting: Story = {
  args: {
    categories: mockCategories,
    isLoading: false,
    error: null,
    deleteConfirmId: 1,
    isDeleting: true,
    ...mockCallbacks,
  },
};
