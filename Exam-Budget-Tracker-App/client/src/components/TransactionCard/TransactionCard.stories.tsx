import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TransactionCard } from './TransactionCard';
import type { Transaction } from '../../types/transaction';

const mockTransaction: Transaction = {
  id: 1,
  budget: 1,
  amount: '-42.50',
  category: 'Groceries',
  date: '2026-02-10',
  created_at: '2026-02-10T09:00:00Z',
  updated_at: '2026-02-10T09:00:00Z',
};

const meta = {
  title: 'Components/TransactionCard',
  component: TransactionCard,
  tags: ['autodocs'],
  argTypes: {
    transaction: {
      control: 'object',
      description: 'Transaction data displayed in the card',
    },
    isSelected: {
      control: 'boolean',
      description: 'Highlight the transaction as selected',
    },
    onSelect: {
      action: 'select',
      description: 'Called when the card is selected',
    },
    onEdit: {
      action: 'edit',
      description: 'Called when edit is clicked',
    },
    onDelete: {
      action: 'delete',
      description: 'Called when delete is clicked',
    },
  },
} satisfies Meta<typeof TransactionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    transaction: mockTransaction,
    isSelected: false,
    onSelect: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
  render: (args) => (
    <div style={{ maxWidth: '420px' }}>
      <TransactionCard {...args} />
    </div>
  ),
};

export const Selected: Story = {
  args: {
    ...Default.args,
    isSelected: true,
  },
};

export const Income: Story = {
  args: {
    ...Default.args,
    transaction: { ...mockTransaction, amount: '2400.00', category: 'Salary' },
  },
};
