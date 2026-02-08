import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, ToastContainer } from './Toast';

describe('Toast', () => {
  const mockOnDismiss = vi.fn();

  beforeEach(() => {
    mockOnDismiss.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders toast with message and correct type', () => {
    render(
      <Toast
        id="test-toast"
        message="Test message"
        type="success"
        onDismiss={mockOnDismiss}
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('toast--success');
  });

  it('displays correct icon for each toast type', () => {
    const { rerender } = render(
      <Toast
        id="test-toast"
        message="Success"
        type="success"
        onDismiss={mockOnDismiss}
      />
    );
    const iconElement = screen.getByText('✓');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass('toast__icon');

    rerender(
      <Toast
        id="test-toast"
        message="Error"
        type="error"
        onDismiss={mockOnDismiss}
      />
    );
    const errorIcons = screen.getAllByText('✕');
    // One is the icon, one is the close button
    expect(errorIcons.length).toBe(2);
    expect(errorIcons[0]).toHaveClass('toast__icon');
  });

  it('calls onDismiss when close button is clicked', async () => {
    vi.useRealTimers(); // Use real timers for user interaction
    const user = userEvent.setup();
    
    render(
      <Toast
        id="test-toast"
        message="Test"
        type="info"
        onDismiss={mockOnDismiss}
      />
    );

    await user.click(screen.getByRole('button', { name: /close notification/i }));
    expect(mockOnDismiss).toHaveBeenCalledWith('test-toast');
    
    vi.useFakeTimers(); // Restore fake timers for other tests
  });

  it('auto-dismisses after specified duration', () => {
    render(
      <Toast
        id="test-toast"
        message="Test"
        type="info"
        duration={1000}
        onDismiss={mockOnDismiss}
      />
    );

    expect(mockOnDismiss).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(mockOnDismiss).toHaveBeenCalledWith('test-toast');
  });

  it('dismisses on Escape key press', () => {
    vi.useRealTimers(); // Use real timers for event handling
    
    render(
      <Toast
        id="test-toast"
        message="Test"
        type="info"
        onDismiss={mockOnDismiss}
      />
    );

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(escapeEvent);

    expect(mockOnDismiss).toHaveBeenCalledWith('test-toast');
    
    vi.useFakeTimers(); // Restore fake timers
  });
});

describe('ToastContainer', () => {
  const mockOnDismiss = vi.fn();

  it('renders multiple toasts', () => {
    const toasts = [
      { id: '1', message: 'Toast 1', type: 'success' as const },
      { id: '2', message: 'Toast 2', type: 'error' as const },
      { id: '3', message: 'Toast 3', type: 'info' as const },
    ];

    render(<ToastContainer toasts={toasts} onDismiss={mockOnDismiss} />);

    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();
  });

  it('renders empty container when no toasts', () => {
    const { container } = render(
      <ToastContainer toasts={[]} onDismiss={mockOnDismiss} />
    );

    expect(container.querySelector('.toast-container')).toBeInTheDocument();
    expect(container.querySelector('.toast')).not.toBeInTheDocument();
  });
});
