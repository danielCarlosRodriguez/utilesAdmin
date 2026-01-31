/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';

/**
 * ToastContext - Context para manejar notificaciones Toast
 *
 * Proporciona:
 * - toasts: array de notificaciones activas
 * - addToast: función para agregar notificación
 * - removeToast: función para remover notificación
 * - success, error, warning, info: helpers para agregar toasts específicos
 *
 * @example
 * const { success, error } = useToast();
 * success('Producto agregado', 'El producto fue agregado al carrito');
 * error('Error', 'No se pudo agregar el producto');
 */

const ToastContext = createContext(undefined);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Remover toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Agregar toast
  const addToast = useCallback(
    ({
      variant = 'info',
      title,
      message,
      duration = 5000,
      dismissible = true,
    }) => {
      const id = `toast-${++toastId}`;
      const toast = {
        id,
        variant,
        title,
        message,
        duration,
        dismissible,
        createdAt: Date.now(),
      };

      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss si tiene duración
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  // Remover todos los toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Helpers para tipos específicos
  const success = useCallback(
    (title, message, options = {}) => {
      return addToast({ variant: 'success', title, message, ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (title, message, options = {}) => {
      return addToast({ variant: 'error', title, message, ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (title, message, options = {}) => {
      return addToast({ variant: 'warning', title, message, ...options });
    },
    [addToast]
  );

  const info = useCallback(
    (title, message, options = {}) => {
      return addToast({ variant: 'info', title, message, ...options });
    },
    [addToast]
  );

  // Helper genérico showToast que acepta { type, message, title }
  const showToast = useCallback(
    ({ type = 'info', message, title, ...options }) => {
      return addToast({
        variant: type,
        title: title || '',
        message: message || '',
        ...options
      });
    },
    [addToast]
  );

  const value = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
    showToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// Hook personalizado para usar el ToastContext
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  return context;
};

export default ToastContext;
