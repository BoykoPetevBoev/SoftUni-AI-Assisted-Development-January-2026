import type { Meta, StoryObj } from '@storybook/react';
import { Toast, ToastContainer } from './Toast';
import { fn } from '@storybook/test';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning'],
    },
    duration: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    id: 'toast-1',
    message: 'Operation completed successfully!',
    type: 'success',
    duration: 3000,
    onDismiss: fn(),
  },
};

export const Error: Story = {
  args: {
    id: 'toast-2',
    message: 'An error occurred. Please try again.',
    type: 'error',
    duration: 3000,
    onDismiss: fn(),
  },
};

export const Info: Story = {
  args: {
    id: 'toast-3',
    message: 'Here is some helpful information.',
    type: 'info',
    duration: 3000,
    onDismiss: fn(),
  },
};

export const Warning: Story = {
  args: {
    id: 'toast-4',
    message: 'Warning: This action cannot be undone.',
    type: 'warning',
    duration: 3000,
    onDismiss: fn(),
  },
};

export const LongMessage: Story = {
  args: {
    id: 'toast-5',
    message: 'This is a much longer toast message that demonstrates how the component handles text that spans multiple lines and takes up more space.',
    type: 'info',
    duration: 5000,
    onDismiss: fn(),
  },
};

// ToastContainer story
type ContainerMeta = Meta<typeof ToastContainer>;

export const MultipleToasts: StoryObj<ContainerMeta> = {
  args: {
    toasts: [
      { id: '1', message: 'Account created successfully!', type: 'success' },
      { id: '2', message: 'Warning: Session expires in 5 minutes', type: 'warning' },
      { id: '3', message: 'Processing your request...', type: 'info' },
    ],
    onDismiss: fn(),
  },
};
