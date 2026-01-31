# Custom Hooks

This directory contains custom React hooks for reusable logic.

## Planned Hooks

- `useAuth` - Authentication state and operations
- `useCart` - Shopping cart state and operations
- `useProducts` - Product fetching and filtering
- `useDebounce` - Debounce values for search
- `useLocalStorage` - Persist state in localStorage
- `useMediaQuery` - Responsive breakpoint detection
- `useIntersectionObserver` - Lazy loading and scroll effects
- `useClickOutside` - Detect clicks outside element

## Example Hook Structure

```jsx
/**
 * useAuth Hook
 * Manages authentication state and operations
 */
import { useState, useEffect } from 'react';
import { authAPI } from '@/services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    // Login logic
  };

  const logout = async () => {
    // Logout logic
  };

  useEffect(() => {
    // Initialize auth state
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
};
```
