import type { Meta, StoryObj } from '@storybook/react';
import { BudgetList } from './BudgetList';
import type { Budget } from '../types/budget';

const meta = {
  title: 'Components/BudgetList',
  component: BudgetList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BudgetList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockBudgets: Budget[] = [
  {
    id: 1,
    user: 1,
    title: 'Monthly Budget',
    description: 'My monthly household budget for February 2026',
    date: '2026-02-01',
    initial_amount: '5000.00',
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 2,
    user: 1,
    title: 'Yearly Budget',
    description: 'Annual budget planning for the entire year',
    date: '2026-01-01',
    initial_amount: '50000.00',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 3,
    user: 1,
    title: 'Emergency Fund',
    description: '',
    date: '2026-02-15',
    initial_amount: '10000.00',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
];

export const Loaded: Story = {
  args: {
    budgets: mockBudgets,
    isLoading: false,
    error: null,
    onRetry: () => Promise.resolve(),
    deleteConfirmId: null,
    isDeleting: false,
    onDeleteClick: (id) => console.log('Delete budget:', id),
    onConfirmDelete: (id) => console.log('Confirm delete:', id),
    onCancelDelete: () => console.log('Cancel delete'),
    onEditClick: (id) => console.log('Edit budget:', id),
    onCreateClick: () => console.log('Create budget'),
  },
};

export const Loading: Story = {
  args: {
    budgets: [],
    isLoading: true,
    error: null,
    onRetry: () => Promise.resolve(),
    deleteConfirmId: null,
    isDeleting: false,
    onDeleteClick: (id) => console.log('Delete budget:', id),
    onConfirmDelete: (id) => console.log('Confirm delete:', id),
    onCancelDelete: () => console.log('Cancel delete'),
    onEditClick: (id) => console.log('Edit budget:', id),
    onCreateClick: () => console.log('Create budget'),
  },
};

export const ErrorState: Story = {
  args: {
    budgets: [],
    isLoading: false,
    error: new globalThis.Error('Failed to load budgets'),
    onRetry: () => Promise.resolve(),
    deleteConfirmId: null,
    isDeleting: false,
    onDeleteClick: (id) => console.log('Delete budget:', id),
    onConfirmDelete: (id) => console.log('Confirm delete:', id),
    onCancelDelete: () => console.log('Cancel delete'),
    onEditClick: (id) => console.log('Edit budget:', id),
    onCreateClick: () => console.log('Create budget'),
  },
};

export const Empty: Story = {
  args: {
    budgets: [],
    isLoading: false,
    error: null,
    onRetry: () => Promise.resolve(),
    deleteConfirmId: null,
    isDeleting: false,
    onDeleteClick: (id) => console.log('Delete budget:', id),
    onConfirmDelete: (id) => console.log('Confirm delete:', id),
    onCancelDelete: () => console.log('Cancel delete'),
    onEditClick: (id) => console.log('Edit budget:', id),
    onCreateClick: () => console.log('Create budget'),
  },
};
