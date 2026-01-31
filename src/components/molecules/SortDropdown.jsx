import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

/**
 * SortDropdown Component - Molecule
 *
 * Dropdown para ordenar productos por diferentes criterios
 *
 * @param {Object} props
 * @param {string} [props.value] - Valor seleccionado actual
 * @param {Function} props.onChange - Callback cuando cambia la selección
 * @param {Array} [props.options] - Opciones personalizadas de ordenamiento
 * @param {string} [props.className] - Clases adicionales
 *
 * @example
 * <SortDropdown
 *   value={sortBy}
 *   onChange={(value) => setSortBy(value)}
 * />
 */
const SortDropdown = ({
  value = '',
  onChange,
  options,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Opciones de ordenamiento por defecto
  const defaultOptions = [
    { value: '', label: 'Más relevante' },
    { value: 'price', label: 'Precio: Menor a mayor' },
    { value: '-price', label: 'Precio: Mayor a menor' },
    { value: 'name', label: 'Nombre: A-Z' },
    { value: '-name', label: 'Nombre: Z-A' },
    { value: '-createdAt', label: 'Más recientes' },
    { value: 'createdAt', label: 'Más antiguos' },
  ];

  const sortOptions = options || defaultOptions;

  // Obtener label de la opción seleccionada
  const selectedOption = sortOptions.find((opt) => opt.value === value);
  const selectedLabel = selectedOption?.label || 'Ordenar por';

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Manejar selección de opción
  const handleSelect = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Botón del dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between gap-2
          px-4 py-2 min-w-[200px]
          bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg
          text-sm font-medium text-neutral-700 dark:text-neutral-300
          hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-700
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          transition-all
          ${isOpen ? 'ring-2 ring-primary-500/20 border-primary-500' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-neutral-500 dark:text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          {selectedLabel}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute z-50 mt-2 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden"
          role="listbox"
        >
          <ul className="py-1">
            {sortOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full px-4 py-2.5 flex items-center justify-between
                    text-sm text-left transition-colors
                    ${
                      option.value === value
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }
                  `}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <CheckIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
