import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDownIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  SpeakerWaveIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
  HeartIcon,
  ShoppingBagIcon,
  CubeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import useCategories from '../../hooks/useCategories';

/**
 * HeaderSecondary - Secondary header with categories menu
 * 
 * Behavior:
 * - Hover: Opens/closes menu when mouse enters/leaves wrapper (button + dropdown)
 * - Click: Toggles menu open/closed state (fixes/unfixes menu)
 * - Click outside: Closes menu if fixed by click
 * - Smooth animations with opacity and scale
 *
 * @example
 * <HeaderSecondary />
 */
const HeaderSecondary = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFixedByClick, setIsFixedByClick] = useState(false);
  const menuRef = useRef(null);

  // Obtener categorías desde MongoDB
  const { data: categories, loading: categoriesLoading } = useCategories();

  // Filtrar solo categorías principales (sin parent)
  const mainCategories = categories.filter(cat => !cat.parent || cat.parent === null);

  // Mapeo de iconos por nombre de categoría (case insensitive)
  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    
    if (name.includes('laptop') || name.includes('notebook') || name.includes('pc') || name.includes('computadora') || name.includes('informática')) {
      return ComputerDesktopIcon;
    }
    if (name.includes('celular') || name.includes('smartphone') || name.includes('teléfono') || name.includes('telefono') || name.includes('mobile')) {
      return DevicePhoneMobileIcon;
    }
    if (name.includes('audio') || name.includes('auricular') || name.includes('parlante') || name.includes('sonido')) {
      return SpeakerWaveIcon;
    }
    if (name.includes('procesador') || name.includes('componente') || name.includes('chip') || name.includes('cpu')) {
      return CpuChipIcon;
    }
    if (name.includes('gamer') || name.includes('gaming') || name.includes('consola') || name.includes('juego')) {
      return RocketLaunchIcon;
    }
    if (name.includes('hogar') || name.includes('casa') || name.includes('home')) {
      return HomeIcon;
    }
    if (name.includes('herramienta') || name.includes('tool')) {
      return WrenchScrewdriverIcon;
    }
    if (name.includes('salud') || name.includes('health') || name.includes('fitness')) {
      return HeartIcon;
    }
    if (name.includes('oferta') || name.includes('promo') || name.includes('descuento') || name.includes('sale')) {
      return SparklesIcon;
    }
    if (name.includes('producto') || name.includes('product')) {
      return ShoppingBagIcon;
    }
    
    // Icono por defecto
    return CubeIcon;
  };

  // Mostrar menú
  const showMenu = () => {
    setIsMenuOpen(true);
  };

  // Ocultar menú
  const hideMenu = () => {
    setIsMenuOpen(false);
  };

  // Manejar hover: mostrar solo si no está fijado por click
  const handleMouseEnter = () => {
    if (!isFixedByClick) {
      showMenu();
    }
  };

  // Manejar hover: ocultar solo si no está fijado por click
  const handleMouseLeave = () => {
    if (!isFixedByClick) {
      hideMenu();
    }
  };

  // Manejar click en el botón: fijar/desfijar
  const handleButtonClick = (e) => {
    e.stopPropagation();
    const newFixedState = !isFixedByClick;
    setIsFixedByClick(newFixedState);

    if (newFixedState) {
      showMenu();
    } else {
      hideMenu();
    }
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFixedByClick && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsFixedByClick(false);
        hideMenu();
      }
    };

    if (isFixedByClick) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isFixedByClick]);

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-700 py-1 relative bg-white dark:bg-neutral-900">
      <div
        className="relative h-full flex items-center"
        ref={menuRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Botón Menú */}
        <button
          onClick={handleButtonClick}
          className="flex items-center gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors h-full px-2"
          aria-label="Menú de categorías"
          aria-expanded={isMenuOpen}
        >
          Menú
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown perfectamente pegado debajo */}
        <div
          className={`absolute left-0 top-full w-40 rounded-b-md bg-white dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 shadow-lg origin-top-left transition-all duration-150 ${
            isMenuOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {categoriesLoading ? (
            <div className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-2 text-sm">Cargando categorías...</p>
            </div>
          ) : mainCategories.length === 0 ? (
            <div className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
              <p className="text-sm">No hay categorías disponibles</p>
            </div>
          ) : (
            <ul className="py-2">
              {mainCategories.map((category) => {
                const IconComponent = getCategoryIcon(category.name);
                return (
                  <li key={category._id}>
                    <Link
                      to={`/${category.slug}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-neutral-700 transition-colors"
                      onClick={() => {
                        setIsFixedByClick(false);
                        hideMenu();
                      }}
                    >
                      <IconComponent className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
                      <span>{category.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderSecondary;
