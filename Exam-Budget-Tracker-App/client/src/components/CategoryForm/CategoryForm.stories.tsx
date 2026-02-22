import type { StoryObj, Meta } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../../context/ToastContext';
import { CategoryForm } from './CategoryForm';

const queryClient = new QueryClient();

const meta = {
  title: 'Components/CategoryForm',
  component: CategoryForm,
  decorators: [
    (Story: React.FC) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Story />
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CategoryForm>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Create Category Form
 * Shows the form for creating a new category
 */
export const CreateForm: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Form closed'),
    categoryId: undefined,
  },
};

/**
 * Edit Category Form
 * Shows the form in edit mode (would load existing category data)
 */
export const EditForm: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Form closed'),
    categoryId: 1,
  },
};

/**
 * Closed Form
 * Form is hidden (returns null)
 */
export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Form closed'),
  },
};
