import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../context/AuthContext';
import { ToastProvider } from '../../context/ToastContext';
import { TransactionForm } from './TransactionForm';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const meta = {
  title: 'Components/TransactionForm',
  component: TransactionForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <Story />
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is visible',
    },
    onClose: {
      action: 'close',
      description: 'Callback when the modal is closed',
    },
    budgetId: {
      control: 'number',
      description: 'Budget ID for the new transaction',
    },
    transactionId: {
      control: 'number',
      description: 'Transaction ID for edit mode',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateMode: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
    budgetId: 1,
  },
  render: (args) => (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TransactionForm {...args} />
    </div>
  ),
};
