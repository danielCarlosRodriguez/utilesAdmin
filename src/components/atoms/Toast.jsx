import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Toast - Compact notification component
 *
 * @param {Object} props
 * @param {string} props.id - ID único del toast
 * @param {'success'|'error'|'warning'|'info'} [props.variant='info'] - Tipo de notificación
 * @param {string} props.title - Título del mensaje
 * @param {string} [props.message] - Mensaje descriptivo
 * @param {boolean} [props.dismissible=true] - Permite cerrar manualmente
 * @param {Function} props.onClose - Callback al cerrar
 */
const Toast = ({
  id,
  variant = 'info',
  title,
  message,
  dismissible = true,
  onClose,
  className = '',
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  // Combinar title y message si ambos existen
  const displayText = message ? `${title}` : title;

  // Determinar color de fondo según variante
  let bgColor = '';
  if (variant === 'success') {
    bgColor = 'bg-[#22C55E]'; // Verde
  } else if (variant === 'error') {
    bgColor = 'bg-[#EF4444]'; // Rojo
  } else if (variant === 'warning') {
    bgColor = 'bg-[#EAB308]'; // Amarillo
  } else if (variant === 'info') {
    bgColor = 'bg-[#3B82F6]'; // Azul
  }

  return (
    <div
      id={id}
      className={`
        flex items-center justify-between gap-3
        px-4 py-3
        rounded-lg
        ${bgColor}
        text-white
        shadow-lg
        min-w-[280px] max-w-[400px]
        transition-all duration-300 ease-out
        ${isExiting ? 'animate-slide-out-up opacity-0 scale-95' : 'animate-slide-in-down'}
        ${className}
      `}
      role="alert"
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      {/* Text content */}
      <span className="text-sm font-medium flex-1 min-w-0 text-white">
        {displayText}
      </span>

      {/* Close button */}
      {dismissible && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-0.5 rounded hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 text-white"
          aria-label="Cerrar notificación"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Toast;
