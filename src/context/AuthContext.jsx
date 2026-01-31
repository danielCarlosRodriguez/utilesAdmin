/* eslint-disable react-refresh/only-export-components */
/**
 * AuthContext - Global authentication state management
 *
 * Features:
 * - Google OAuth 2.0 login flow
 * - JWT token management
 * - User session persistence
 * - Automatic token refresh
 * - Protected routes support
 * - Logout functionality
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI, setAuthToken, clearAuth } from '../services/api';

// Create context
const AuthContext = createContext(null);

/**
 * AuthProvider component
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
          // Restore user from localStorage
          setUser(JSON.parse(savedUser));

          // Verify token is still valid by fetching current user
          try {
            const response = await authAPI.me();
            if (response.success && response.data?.user) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          } catch (err) {
            // Token is invalid, clear auth
            console.error('Token validation failed:', err);
            clearAuth();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Listen for logout events (from API interceptors)
   */
  useEffect(() => {
    const handleLogoutEvent = () => {
      setUser(null);
      setError('Session expired. Please login again.');
    };

    window.addEventListener('auth:logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);

  /**
   * Login with Google OAuth
   */
  const loginWithGoogle = useCallback(() => {
    // Redirect to Google OAuth endpoint
    const googleLoginUrl = authAPI.getGoogleLoginUrl();
    window.location.href = googleLoginUrl;
  }, []);

  /**
   * Handle OAuth callback (called after Google redirects back)
   * @param {string} token - JWT token from backend
   * @param {object} userData - User data from backend
   */
  const handleOAuthCallback = useCallback((token, userData) => {
    try {
      // Save token
      setAuthToken(token);

      // Save user data
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      setError(null);
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError('Failed to complete login');
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local auth state (always, even if API call fails)
      clearAuth();
      setUser(null);
      setError(null);
    }
  }, []);

  /**
   * Update user data (after profile changes)
   */
  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  /**
   * Check if user is authenticated (memoized for performance)
   */
  const isAuthenticated = useMemo(() => {
    return !!user && !!localStorage.getItem('token');
  }, [user]);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    loginWithGoogle,
    handleOAuthCallback,
    logout,
    updateUser,
    hasRole,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth hook - Access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default AuthContext;
