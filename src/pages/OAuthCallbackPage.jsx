/**
 * OAuthCallbackPage - Handles OAuth redirect from Google
 *
 * Features:
 * - Extracts token from URL query params
 * - Validates token and user data
 * - Redirects to intended page after login
 * - Error handling
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processOAuthCallback = () => {
      try {
        // Get token and user from URL params
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const errorParam = searchParams.get('error');

        // Check for error from backend
        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
          return;
        }

        // Validate required params
        if (!token || !userParam) {
          setError('Datos de autenticación incompletos');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
          return;
        }

        // Parse user data
        const userData = JSON.parse(decodeURIComponent(userParam));

        // Complete OAuth callback
        handleOAuthCallback(token, userData);

        // Redirect to home page (or previous page if available)
        const redirectTo = sessionStorage.getItem('auth_redirect') || '/';
        sessionStorage.removeItem('auth_redirect');
        navigate(redirectTo, { replace: true });
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Error al procesar la autenticación');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate, handleOAuthCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error de Autenticación
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Redirigiendo a la página de inicio de sesión...
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-celeste-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completando inicio de sesión
            </h2>
            <p className="text-gray-600">Por favor espera...</p>
          </>
        )}
      </div>
    </div>
  );
}
