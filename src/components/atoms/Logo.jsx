import { ScaleIcon } from '@heroicons/react/24/solid';

/**
 * Logo Component - Atomic Design Pattern
 *
 * Componente de logo con icono de remates y texto "Remates"
 * Representa el sistema de gestión de remates y subastas
 *
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} props.size - Tamaño del logo
 * @param {boolean} props.showText - Mostrar texto junto al icono
 * @param {string} props.className - Clases adicionales
 *
 * @example
 * <Logo size="md" showText />
 *
 * @example
 * <Logo size="sm" showText={false} />
 */
const Logo = ({
  size = 'md',
  showText = true,
  className = ''
}) => {

  // Tamaños del icono
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  // Tamaños del texto
  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icono de balanza (remates) */}
      <div className="relative">
        <ScaleIcon
          className={`${iconSizes[size]} text-primary-500`}
          aria-hidden="true"
        />
      </div>

      {/* Texto de la marca */}
      {showText && (
        <span
          className={`${textSizes[size]} font-bold text-neutral-900 dark:text-neutral-100`}
        >
          Remates
        </span>
      )}
    </div>
  );
};

export default Logo;
