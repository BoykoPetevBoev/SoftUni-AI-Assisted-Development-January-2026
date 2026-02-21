import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ToastProvider } from '../../context/ToastContext';
import { Header } from '../Header';

const meta = {
  title: 'Components/Header',
  component: Header,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Story />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The header includes navigation links to Home and Budgets pages, along with a logout button.',
      },
    },
  },
};
