import { useToast } from '../../context/ToastContext';
import Toast from '../atoms/Toast';

/**
 * ToastContainer - Redesigned container for Toast notifications
 *
 * Features:
 * - Positioned below header for better visibility
 * - Supports multiple position options
 * - Maximum toast limit to prevent overflow
 * - Smooth stacked animations
 * - Responsive positioning for mobile and desktop
 *
 * Renders all active toast notifications in a fixed position.
 * Should be included once in the application (typically in App.jsx).
 *
 * @param {Object} props
 * @param {'top-right'|'top-center'|'top-left'|'bottom-right'|'bottom-center'|'bottom-left'} [props.position='top-right'] - Posición en pantalla
 * @param {number} [props.maxToasts=5] - Máximo de toasts simultáneos
 * @param {string} [props.className] - Clases CSS adicionales
 *
 * @example
 * <ToastContainer position="top-right" maxToasts={3} />
 */
const ToastContainer = ({
  position = 'top-right',
  maxToasts = 5,
  className = '',
}) => {
  const { toasts, removeToast } = useToast();

  // Posiciones disponibles - Positioned below header
  // Header height is approximately 64px (h-16) + HeaderSecondary ~48px = ~112px total
  // Adding some padding (1rem = 16px) gives us top-28 (7rem = 112px) + 4 (1rem) = 128px
  const positions = {
    'top-right': 'top-20 right-4 md:top-24 md:right-6',
    'top-center': 'top-20 left-1/2 -translate-x-1/2 md:top-24',
    'top-left': 'top-20 left-4 md:top-24 md:left-6',
    'bottom-right': 'bottom-4 right-4 md:bottom-6 md:right-6',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 md:bottom-6',
    'bottom-left': 'bottom-4 left-4 md:bottom-6 md:left-6',
  };

  const positionClass = positions[position] || positions['top-right'];

  // Limitar número de toasts visibles
  const visibleToasts = toasts.slice(-maxToasts);

  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <div
      className={`
        fixed ${positionClass}
        z-[100]
        flex flex-col gap-3
        max-w-[95vw] md:max-w-none
        ${className}
      `}
      aria-live="polite"
      aria-atomic="false"
    >
      {visibleToasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            // Slight stagger effect for multiple toasts
            animationDelay: `${index * 50}ms`,
          }}
        >
          <Toast
            id={toast.id}
            variant={toast.variant}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            dismissible={toast.dismissible}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
