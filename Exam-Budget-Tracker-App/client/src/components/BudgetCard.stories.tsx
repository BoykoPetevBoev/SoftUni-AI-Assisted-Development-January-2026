import type { Meta, StoryObj } from '@storybook/react';
import { BudgetCard } from './BudgetCard';
import type { Budget } from '../types/budget';

const meta = {
  title: 'Components/BudgetCard',
  component: BudgetCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BudgetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockBudget: Budget = {
  id: 1,
  user: 1,
  title: 'Monthly Budget',
  description: 'My monthly household budget for February 2026',
  date: '2026-02-01',
  initial_amount: '5000.00',
  created_at: '2026-02-01T10:00:00Z',
  updated_at: '2026-02-01T10:00:00Z',
};

export const Default: Story = {
  args: {
    budget: mockBudget,
    onEdit: (id) => console.log('Edit budget:', id),
    onDelete: (id) => console.log('Delete budget:', id),
  },
  render: (args) => (
    <div style={{ maxWidth: '400px' }}>
      <BudgetCard {...args} />
    </div>
  ),
};

export const WithoutDescription: Story = {
  args: {
    budget: { ...mockBudget, description: '' },
    onEdit: (id) => console.log('Edit budget:', id),
    onDelete: (id) => console.log('Delete budget:', id),
  },
  render: (args) => (
    <div style={{ maxWidth: '400px' }}>
      <BudgetCard {...args} />
    </div>
  ),
};

export const LargeAmount: Story = {
  args: {
    budget: { ...mockBudget, initial_amount: '999999999.99' },
    onEdit: (id) => console.log('Edit budget:', id),
    onDelete: (id) => console.log('Delete budget:', id),
  },
  render: (args) => (
    <div style={{ maxWidth: '400px' }}>
      <BudgetCard {...args} />
    </div>
  ),
};

export const Grid: Story = {
  args: {
    budget: mockBudget,
    onEdit: (id) => console.log('Edit budget:', id),
    onDelete: (id) => console.log('Delete budget:', id),
  },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <BudgetCard
          key={i}
          {...args}
          budget={{ ...mockBudget, id: i, title: `Budget ${i}` }}
        />
      ))}
    </div>
  ),
};
