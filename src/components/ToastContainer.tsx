import React from 'react';
import { useToast } from '../context/ToastContext.tsx';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getToastStyles = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'info':
        return 'bg-primary text-white';
      default:
        return 'bg-slate-800 text-white';
    }
  };

  const getToastIcon = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-up ${getToastStyles(toast.type)}`}
        >
          <span className="material-symbols-outlined text-[20px]">{getToastIcon(toast.type)}</span>
          <p className="text-sm font-medium">{toast.message}</p>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
