import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OfflineWrapper from '../fixes/fix2-offline-screen/OfflineWrapper';

// Mock component
const MockChild = () => <div>Online Content</div>;

describe('Fix 2: Offline Error Handling', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('should show online content when connected', () => {
    // Mock navigator.onLine as true
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: true,
    });

    render(
      <OfflineWrapper>
        <MockChild />
      </OfflineWrapper>
    );

    expect(screen.getByText(/online content/i)).toBeInTheDocument();
  });

  it('should show offline screen when disconnected', async () => {
    // Mock navigator.onLine as false
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(
      <OfflineWrapper>
        <MockChild />
      </OfflineWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/no internet connection/i)).toBeInTheDocument();
    });
  });

  it('should display offline icon and message', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(
      <OfflineWrapper>
        <MockChild />
      </OfflineWrapper>
    );

    expect(screen.getByText(/📡/)).toBeInTheDocument();
    expect(
      screen.getByText(/check your wifi or mobile data/i)
    ).toBeInTheDocument();
  });

  it('should show retry button when offline', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(
      <OfflineWrapper>
        <MockChild />
      </OfflineWrapper>
    );

    const retryBtn = screen.getByRole('button', { name: /try again/i });
    expect(retryBtn).toBeInTheDocument();
  });

  it('should handle online -> offline transition', async () => {
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: true,
    });

    const { rerender } = render(
      <OfflineWrapper>
        <MockChild />
      </OfflineWrapper>
    );

    expect(screen.getByText(/online content/i)).toBeInTheDocument();

    // Simulate going offline
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: false,
    });

    window.dispatchEvent(new Event('offline'));

    await waitFor(() => {
      expect(screen.getByText(/no internet connection/i)).toBeInTheDocument();
    });
  });

  it('should handle offline -> online transition', async () => {
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(
      <OfflineWrapper>
        <MockChild />
      </OfflineWrapper>
    );

    expect(screen.getByText(/no internet connection/i)).toBeInTheDocument();

    // Simulate coming online
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: true,
    });

    window.dispatchEvent(new Event('online'));

    await waitFor(() => {
      expect(screen.getByText(/online content/i)).toBeInTheDocument();
    });
  });

  it('should show helpful tip on offline screen', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(
      <OfflineWrapper>
        <MockChild />
      </OfflineWrapper>
    );

    expect(screen.getByText(/saved hostels still viewable/i)).toBeInTheDocument();
  });

  it('should trigger retry when retry button clicked', async () => {
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(
      <OfflineWrapper>
        <MockChild />
      </OfflineWrapper>
    );

    const retryBtn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryBtn);

    // Should still show offline screen if still offline
    expect(screen.getByText(/no internet connection/i)).toBeInTheDocument();

    // Now come online and click retry
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: true,
    });

    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText(/online content/i)).toBeInTheDocument();
    });
  });

  it('should properly attach/detach event listeners', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: true,
    });

    const { unmount } = render(
      <OfflineWrapper>
        <MockChild />
      </OfflineWrapper>
    );

    // Should have added listeners
    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));

    unmount();

    // Should have removed listeners
    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });
});
