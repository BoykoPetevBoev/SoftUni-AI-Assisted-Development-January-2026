import type { Meta, StoryObj } from '@storybook/react';
import { TransactionDetail } from './TransactionDetail';
import type { Transaction } from '../../types/transaction';

const mockTransaction: Transaction = {
  id: 8,
  budget: 1,
  amount: '-120.00',
  category: 1,
  date: '2026-02-05',
  created_at: '2026-02-05T09:00:00Z',
  updated_at: '2026-02-05T09:00:00Z',
};

const meta = {
  title: 'Components/TransactionDetail',
  component: TransactionDetail,
  tags: ['autodocs'],
  argTypes: {
    transaction: {
      control: 'object',
      description: 'Selected transaction for the details panel',
    },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TransactionDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    transaction: null,
  },
};

export const Filled: Story = {
  args: {
    transaction: mockTransaction,
  },
};
