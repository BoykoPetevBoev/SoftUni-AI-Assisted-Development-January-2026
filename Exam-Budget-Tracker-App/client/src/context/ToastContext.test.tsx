import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from './ToastContext';
import { useToast } from '../hooks/useToast';

const TestComponent = () => {
  const { showSuccess, showError } = useToast();

  return (
    <div>
      <button onClick={() => showSuccess('Saved successfully')}>Show Success</button>
      <button onClick={() => showError('Something went wrong')}>Show Error</button>
    </div>
  );
};

describe('ToastContext', () => {
  it('renders toast when showSuccess is called', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: /show success/i }));

    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
  });

  it('dismisses toast when close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: /show error/i }));

    const closeButton = screen.getByRole('button', { name: /close notification/i });
    await user.click(closeButton);

    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
});
