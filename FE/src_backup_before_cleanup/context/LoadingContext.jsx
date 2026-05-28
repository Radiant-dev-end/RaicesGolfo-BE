import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const LoadingContext = createContext(null);

// Global set of active loader listeners.
// This resolves the React lifecycle caveat where child component useEffects run before parent provider effects.
const fetchListeners = new Set();
const originalFetch = window.fetch;
let fetchCounter = 0;

if (window.fetch && window.fetch === originalFetch) {
  window.fetch = async (...args) => {
    const fetchKey = `fetch-${fetchCounter++}`;
    
    // Notify all active providers to start loading
    fetchListeners.forEach(listener => listener.start(fetchKey));

    try {
      const response = await originalFetch(...args);
      return response;
    } catch (error) {
      throw error;
    } finally {
      // Add a slight delay (400ms) to ensure smooth transitions
      // and prevent flickering for extremely fast API calls
      setTimeout(() => {
        fetchListeners.forEach(listener => listener.stop(fetchKey));
      }, 400);
    }
  };
}

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const activeLoadersRef = useRef(new Set());
  const [, forceUpdate] = useState({});

  const startLoading = (key = 'default') => {
    activeLoadersRef.current.add(key);
    setLoading(true);
  };

  const stopLoading = (key = 'default') => {
    activeLoadersRef.current.delete(key);
    if (activeLoadersRef.current.size === 0) {
      setLoading(false);
    } else {
      forceUpdate({});
    }
  };

  // Register listener for window.fetch interceptions
  useEffect(() => {
    const listener = { start: startLoading, stop: stopLoading };
    fetchListeners.add(listener);
    return () => {
      fetchListeners.delete(listener);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
