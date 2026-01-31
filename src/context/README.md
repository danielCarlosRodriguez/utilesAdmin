# Context Providers

This directory contains React Context providers for global state management.

## Planned Contexts

- `AuthContext` - User authentication state
- `CartContext` - Shopping cart state
- `ThemeContext` - Theme and dark mode
- `NotificationContext` - Toast notifications

## Example Context Structure

```jsx
/**
 * AuthContext
 * Provides authentication state and methods
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAuthToken } from '@/services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await authAPI.me();
          setUser(data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (token) => {
    setAuthToken(token);
    const { data } = await authAPI.me();
    setUser(data);
  };

  const logout = async () => {
    await authAPI.logout();
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## Usage

```jsx
// In main.jsx or App.jsx
import { AuthProvider } from '@/context/AuthContext';

<AuthProvider>
  <App />
</AuthProvider>

// In any component
import { useAuth } from '@/context/AuthContext';

const MyComponent = () => {
  const { user, login, logout } = useAuth();
  // Use auth state and methods
};
```
