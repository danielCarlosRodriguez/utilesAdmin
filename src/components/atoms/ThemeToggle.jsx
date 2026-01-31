import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle - Botón para cambiar entre tema claro y oscuro
 *
 * Características:
 * - Animación suave de transición
 * - Icono que cambia según el tema activo
 * - Accesible (keyboard navigation, ARIA labels)
 * - Tooltip visual
 *
 * @param {Object} props
 * @param {string} [props.className] - Clases CSS adicionales
 * @param {'icon'|'button'} [props.variant='icon'] - Variante del toggle
 *
 * @example
 * <ThemeToggle />
 * <ThemeToggle variant="button" className="ml-4" />
 */
const ThemeToggle = ({ className = '', variant = 'icon' }) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          relative inline-flex items-center gap-2
          px-4 py-2 rounded-lg
          bg-neutral-100 dark:bg-neutral-800
          hover:bg-neutral-200 dark:hover:bg-neutral-700
          transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
          ${className}
        `}
        aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
        title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
      >
        {theme === 'light' ? (
          <>
            <MoonIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Modo Oscuro
            </span>
          </>
        ) : (
          <>
            <SunIcon className="w-5 h-5 text-neutral-300 dark:text-neutral-700" />
            <span className="text-sm font-medium text-neutral-300 dark:text-neutral-700">
              Modo Claro
            </span>
          </>
        )}
      </button>
    );
  }

  // Variant: icon (default)
  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-10 h-10 rounded-lg
        flex items-center justify-center
        bg-neutral-100 dark:bg-neutral-800
        hover:bg-neutral-200 dark:hover:bg-neutral-700
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
        group
        ${className}
      `}
      aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
      title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
    >
      {/* Icon with rotation animation */}
      <div className="relative w-5 h-5">
        {/* Sun Icon (visible in light mode) */}
        <SunIcon
          className={`
            absolute inset-0 w-5 h-5 text-neutral-700
            transition-all duration-300 transform
            ${theme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-0'
            }
          `}
        />

        {/* Moon Icon (visible in dark mode) */}
        <MoonIcon
          className={`
            absolute inset-0 w-5 h-5 text-neutral-300
            transition-all duration-300 transform
            ${theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
            }
          `}
        />
      </div>

      {/* Tooltip (opcional - se muestra en hover) */}
      <span
        className="
          absolute -bottom-10 left-1/2 -translate-x-1/2
          px-2 py-1 rounded bg-neutral-900 dark:bg-neutral-100
          text-white dark:text-neutral-900 text-xs whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200 pointer-events-none
          z-60
        "
      >
        {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
      </span>
    </button>
  );
};

export default ThemeToggle;
