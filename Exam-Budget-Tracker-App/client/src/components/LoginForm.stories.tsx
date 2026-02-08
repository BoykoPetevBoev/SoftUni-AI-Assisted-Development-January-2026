import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { fn } from '@storybook/test';

const meta = {
  title: 'Components/LoginForm',
  component: LoginForm,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ToastProvider>
          <AuthContext.Provider
            value={{
              user: null,
              isLoading: false,
              error: null,
              isAuthenticated: false,
              login: fn().mockResolvedValue(undefined),
              register: fn(),
              logout: fn(),
              clearError: fn(),
            }}
          >
            <div style={{ maxWidth: '450px', padding: '2rem' }}>
              <Story />
            </div>
          </AuthContext.Provider>
        </ToastProvider>
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ToastProvider>
          <AuthContext.Provider
            value={{
              user: null,
              isLoading: true,
              error: null,
              isAuthenticated: false,
              login: fn().mockImplementation(() => new Promise(() => {})),
              register: fn(),
              logout: fn(),
              clearError: fn(),
            }}
          >
            <div style={{ maxWidth: '450px', padding: '2rem' }}>
              <Story />
            </div>
          </AuthContext.Provider>
        </ToastProvider>
      </BrowserRouter>
    ),
  ],
};

export const WithError: Story = {
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ToastProvider>
          <AuthContext.Provider
            value={{
              user: null,
              isLoading: false,
              error: 'Invalid credentials',
              isAuthenticated: false,
              login: fn().mockRejectedValue({
                data: { detail: 'Invalid credentials' },
              }),
              register: fn(),
              logout: fn(),
              clearError: fn(),
            }}
          >
            <div style={{ maxWidth: '450px', padding: '2rem' }}>
              <Story />
            </div>
          </AuthContext.Provider>
        </ToastProvider>
      </BrowserRouter>
    ),
  ],
};
