import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryList } from './CategoryList';
import type { Category } from '../../types/category';

describe('CategoryList', () => {
  const mockCategories: Category[] = [
    {
      id: 1,
      user: 1,
      name: 'Groceries',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      user: 1,
      name: 'Transport',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];

  const mockCallbacks = {
    onCreateClick: vi.fn(),
    onEditClick: vi.fn(),
    onDeleteClick: vi.fn(),
    onConfirmDelete: vi.fn(),
    onCancelDelete: vi.fn(),
    onRetry: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    render(
      <CategoryList
        categories={[]}
        isLoading={true}
        error={null}
        {...mockCallbacks}
        deleteConfirmId={null}
        isDeleting={false}
      />
    );

    expect(screen.getByText('Loading categories...')).toBeInTheDocument();
  });

  it('should render error state with retry button', async () => {
    const user = userEvent.setup();
    render(
      <CategoryList
        categories={[]}
        isLoading={false}
        error={new Error('Failed to load')}
        {...mockCallbacks}
        deleteConfirmId={null}
        isDeleting={false}
      />
    );

    expect(
      screen.getByText('Failed to load categories. Please try again.')
    ).toBeInTheDocument();

    const retryBtn = screen.getByText('Retry');
    await user.click(retryBtn);

    expect(mockCallbacks.onRetry).toHaveBeenCalled();
  });

  it('should render empty state', () => {
    render(
      <CategoryList
        categories={[]}
        isLoading={false}
        error={null}
        {...mockCallbacks}
        deleteConfirmId={null}
        isDeleting={false}
      />
    );

    expect(
      screen.getByText(
        'No categories yet. Create one to organize your transactions.'
      )
    ).toBeInTheDocument();
  });

  it('should render list of categories', () => {
    render(
      <CategoryList
        categories={mockCategories}
        isLoading={false}
        error={null}
        {...mockCallbacks}
        deleteConfirmId={null}
        isDeleting={false}
      />
    );

    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });

  it('should render category header and create button', () => {
    render(
      <CategoryList
        categories={mockCategories}
        isLoading={false}
        error={null}
        {...mockCallbacks}
        deleteConfirmId={null}
        isDeleting={false}
      />
    );

    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('+ New Category')).toBeInTheDocument();
  });

  it('should call onCreateClick when create button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CategoryList
        categories={mockCategories}
        isLoading={false}
        error={null}
        {...mockCallbacks}
        deleteConfirmId={null}
        isDeleting={false}
      />
    );

    const createBtn = screen.getByText('+ New Category');
    await user.click(createBtn);

    expect(mockCallbacks.onCreateClick).toHaveBeenCalled();
  });

  it('should render edit and delete buttons for each category', () => {
    render(
      <CategoryList
        categories={mockCategories}
        isLoading={false}
        error={null}
        {...mockCallbacks}
        deleteConfirmId={null}
        isDeleting={false}
      />
    );

    const editButtons = screen.getAllByText('Edit');
    const deleteButtons = screen.getAllByText('Delete');

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('should call onEditClick when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CategoryList
        categories={mockCategories}
        isLoading={false}
        error={null}
        {...mockCallbacks}
        deleteConfirmId={null}
        isDeleting={false}
      />
    );

    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);

    expect(mockCallbacks.onEditClick).toHaveBeenCalledWith(1);
  });

  it('should call onDeleteClick when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CategoryList
        categories={mockCategories}
        isLoading={false}
        error={null}
        {...mockCallbacks}
        deleteConfirmId={null}
        isDeleting={false}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    expect(mockCallbacks.onDeleteClick).toHaveBeenCalledWith(1);
  });

  it('should not call delete when delete confirmation is active', async () => {
    render(
      <CategoryList
        categories={mockCategories}
        isLoading={false}
        error={null}
        {...mockCallbacks}
        deleteConfirmId={1}
        isDeleting={false}
      />
    );

    const deleteButtons = screen.queryAllByText('Delete');
    // When deleteConfirmId is set, the Delete button should be hidden and replaced with Confirm
    expect(deleteButtons.length).toBeLessThan(2);
  });;

  it('should call onConfirmDelete when confirmation is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CategoryList
        categories={mockCategories}
        isLoading={false}
        error={null}
        {...mockCallbacks}
        deleteConfirmId={1}
        isDeleting={false}
      />
    );

    const confirmBtn = screen.getByText('Confirm');
    await user.click(confirmBtn);

    expect(mockCallbacks.onConfirmDelete).toHaveBeenCalledWith(1);
  });

  it('should call onCancelDelete when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CategoryList
        categories={mockCategories}
        isLoading={false}
        error={null}
        {...mockCallbacks}
        deleteConfirmId={1}
        isDeleting={false}
      />
    );

    const cancelBtn = screen.getByText('Cancel');
    await user.click(cancelBtn);

    expect(mockCallbacks.onCancelDelete).toHaveBeenCalled();
  });
});
