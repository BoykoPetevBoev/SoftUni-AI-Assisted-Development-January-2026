import type { Meta, StoryObj } from '@storybook/react';
import { RegisterForm } from './RegisterForm';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { fn } from '@storybook/test';

const meta = {
  title: 'Components/RegisterForm',
  component: RegisterForm,
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
              login: fn(),
              register: fn().mockResolvedValue(undefined),
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
} satisfies Meta<typeof RegisterForm>;

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
              login: fn(),
              register: fn().mockImplementation(() => new Promise(() => {})),
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

export const PasswordMismatch: Story = {
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ToastProvider>
          <AuthContext.Provider
            value={{
              user: null,
              isLoading: false,
              error: 'Passwords do not match',
              isAuthenticated: false,
              login: fn(),
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

export const BackendError: Story = {
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ToastProvider>
          <AuthContext.Provider
            value={{
              user: null,
              isLoading: false,
              error: 'Username already exists',
              isAuthenticated: false,
              login: fn(),
              register: fn().mockRejectedValue({
                data: { username: ['Username already exists'] },
              }),
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
