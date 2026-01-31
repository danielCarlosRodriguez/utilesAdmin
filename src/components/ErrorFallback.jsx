/**
 * ErrorFallback - UI de fallback cuando hay errores
 *
 * Muestra mensaje amigable al usuario con opción de recargar
 */

import PropTypes from 'prop-types';
import Button from './atoms/Button';

export default function ErrorFallback({ error, errorInfo, onReset }) {
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-3">
            ¡Ups! Algo salió mal
          </h1>

          {/* Message */}
          <p className="text-center text-neutral-600 dark:text-neutral-400 mb-6">
            Lo sentimos, ha ocurrido un error inesperado. Puedes intentar recargar la página o contactar con soporte si el problema persiste.
          </p>

          {/* Error details (only in development) */}
          {isDevelopment && error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
              <h2 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
                Error Details (Development Only):
              </h2>
              <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto max-h-40">
                {error.toString()}
              </pre>
              {errorInfo && (
                <details className="mt-3">
                  <summary className="text-xs font-medium text-red-800 dark:text-red-400 cursor-pointer">
                    Stack Trace
                  </summary>
                  <pre className="mt-2 text-xs text-red-700 dark:text-red-300 overflow-auto max-h-60">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
              size="lg"
            >
              Recargar Página
            </Button>
            {onReset && (
              <Button
                onClick={onReset}
                variant="outline"
                size="lg"
              >
                Intentar de Nuevo
              </Button>
            )}
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              size="lg"
            >
              Ir al Inicio
            </Button>
          </div>

          {/* Help text */}
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
            Si el problema persiste, por favor contacta con el soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
}

ErrorFallback.propTypes = {
  error: PropTypes.object,
  errorInfo: PropTypes.object,
  onReset: PropTypes.func,
};
