import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TransactionList } from './TransactionList';
import type { Transaction } from '../../types/transaction';

const mockTransactions: Transaction[] = [
  {
    id: 1,
    budget: 1,
    amount: '2400.00',
    category: 2,
    date: '2026-02-03',
    created_at: '2026-02-03T09:00:00Z',
    updated_at: '2026-02-03T09:00:00Z',
  },
  {
    id: 2,
    budget: 1,
    amount: '-85.25',
    category: 4,
    date: '2026-02-04',
    created_at: '2026-02-04T09:00:00Z',
    updated_at: '2026-02-04T09:00:00Z',
  },
];

const meta = {
  title: 'Components/TransactionList',
  component: TransactionList,
  tags: ['autodocs'],
  argTypes: {
    transactions: {
      control: 'object',
      description: 'List of transactions to render',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the list is loading',
    },
    error: {
      control: 'object',
      description: 'Error state when loading fails',
    },
    selectedTransactionId: {
      control: 'number',
      description: 'Currently selected transaction ID',
    },
    onRetry: {
      action: 'retry',
      description: 'Retry loading transactions',
    },
    onSelect: {
      action: 'select',
      description: 'Select a transaction for detail view',
    },
    onEditClick: {
      action: 'edit',
      description: 'Edit a transaction',
    },
    onDeleteClick: {
      action: 'delete',
      description: 'Request deletion confirmation',
    },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TransactionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {
  args: {
    transactions: mockTransactions,
    isLoading: false,
    error: null,
    onRetry: fn(),
    selectedTransactionId: 1,
    onSelect: fn(),
    onEditClick: fn(),
    deleteConfirmId: null,
    isDeleting: false,
    onDeleteClick: fn(),
    onConfirmDelete: fn(),
    onCancelDelete: fn(),
  },
};

export const Loading: Story = {
  args: {
    ...Loaded.args,
    transactions: [],
    isLoading: true,
  },
};

export const ErrorState: Story = {
  args: {
    ...Loaded.args,
    transactions: [],
    error: new globalThis.Error('Failed to load'),
  },
};

export const Empty: Story = {
  args: {
    ...Loaded.args,
    transactions: [],
  },
};
