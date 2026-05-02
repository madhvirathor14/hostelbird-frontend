// Fix 2: Offline / No Network Screen
// Problem: App shows infinite spinner when internet is off.
// Budget travelers (Hostelbird's core users) often have patchy connectivity.
// This fix wraps any screen with a proper offline state + retry button.

import React, { useState, useEffect } from 'react';

// Hook to detect network status
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Offline Screen Component
const OfflineScreen = ({ onRetry }) => (
  <div style={styles.container}>
    <div style={styles.icon}>📡</div>
    <h2 style={styles.heading}>No Internet Connection</h2>
    <p style={styles.message}>
      Looks like you're offline. Check your WiFi or mobile data and try again.
    </p>
    <button style={styles.retryBtn} onClick={onRetry}>
      Try Again
    </button>
    <p style={styles.tip}>
      💡 Tip: You can still view your saved hostels in the Saved tab.
    </p>
  </div>
);

// Wrapper — wraps any screen/component
const OfflineWrapper = ({ children }) => {
  const isOnline = useNetworkStatus();
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    // Triggers re-render; if connection is back, children will show
    setRetryCount((c) => c + 1);
  };

  if (!isOnline) {
    return <OfflineScreen onRetry={handleRetry} />;
  }

  return <>{children}</>;
};

// --- Demo usage ---
const MockHomeScreen = () => (
  <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
    <h2>🏠 Hostelbird Home</h2>
    <p>You're online! Showing hostels...</p>
  </div>
);

export default function App() {
  return (
    <OfflineWrapper>
      <MockHomeScreen />
    </OfflineWrapper>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 32,
    fontFamily: 'sans-serif',
    textAlign: 'center',
    background: '#FAFAFA',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#666',
    maxWidth: 300,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  retryBtn: {
    padding: '12px 32px',
    background: '#FF5722',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: 20,
  },
  tip: {
    fontSize: 13,
    color: '#999',
    maxWidth: 280,
  },
};
