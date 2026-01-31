import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSearch } from '../../hooks';

/**
 * SearchBar Component - Molecule
 *
 * Barra de búsqueda con autocomplete y sugerencias de productos
 *
 * @param {Object} props
 * @param {string} [props.placeholder='Buscar productos...'] - Placeholder del input
 * @param {Function} [props.onSearch] - Callback cuando se realiza una búsqueda
 * @param {Function} [props.onProductSelect] - Callback cuando se selecciona un producto
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Tamaño del input
 * @param {boolean} [props.showSuggestionsOnFocus=true] - Mostrar sugerencias al hacer focus
 * @param {number} [props.minChars=2] - Mínimo de caracteres para buscar
 * @param {string} [props.className] - Clases adicionales
 *
 * @example
 * <SearchBar
 *   placeholder="Buscar productos..."
 *   onSearch={(term) => console.log('Searching:', term)}
 *   size="lg"
 * />
 */
const SearchBar = ({
  placeholder = 'Buscar productos...',
  onSearch,
  onProductSelect,
  size = 'md',
  showSuggestionsOnFocus = true,
  minChars = 2,
  className = '',
}) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    suggestions,
    isSearching,
    clearSearch,
    showSuggestions,
    setShowSuggestions,
    hasMinChars,
  } = useSearch({ minChars, suggestionsLimit: 6 });

  // Size styles
  const sizes = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSuggestions]);

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setShowSuggestions(false);
    setIsFocused(false);

    // Callback opcional
    if (onSearch) {
      onSearch(searchTerm);
    }

    // Navegar a página de resultados
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  // Manejar selección de sugerencia
  const handleSuggestionClick = (product) => {
    setSearchTerm('');
    setShowSuggestions(false);
    setIsFocused(false);

    if (onProductSelect) {
      onProductSelect(product);
    }

    navigate(`/product/${product.id}`);
  };

  // Manejar cambio en el input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= minChars) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Manejar focus
  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestionsOnFocus && hasMinChars) {
      setShowSuggestions(true);
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Mostrar dropdown de sugerencias
  const shouldShowDropdown = isFocused && showSuggestions && hasMinChars;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          {/* Search Icon */}
          <MagnifyingGlassIcon
            className="absolute left-3 w-5 h-5 text-neutral-400 pointer-events-none"
            aria-hidden="true"
          />

          {/* Input */}
          <input
            ref={inputRef}
            type="search"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={`
              w-full rounded-lg border border-neutral-300
              bg-white pl-10 pr-10
              transition-all duration-200
              placeholder:text-neutral-400
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              ${sizes[size] || sizes.md}
              ${isFocused ? 'ring-2 ring-primary-500/20 border-primary-500' : ''}
            `}
            aria-label="Buscar productos"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={shouldShowDropdown}
          />

          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                clearSearch();
                inputRef.current?.focus();
              }}
              className="absolute right-3 p-1 text-neutral-400 hover:text-neutral-600 transition-colors rounded-full hover:bg-neutral-100"
              aria-label="Limpiar búsqueda"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}

          {/* Loading Spinner */}
          {isSearching && (
            <div className="absolute right-3 pointer-events-none">
              <svg
                className="animate-spin h-4 w-4 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {shouldShowDropdown && (
        <div
          id="search-suggestions"
          className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden"
          role="listbox"
        >
          {isSearching ? (
            <div className="p-4 text-center text-neutral-500 text-sm">
              Buscando productos...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="divide-y divide-neutral-100">
              {suggestions.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left"
                    role="option"
                  >
                    {/* Product Image */}
                    {product.image && (
                      <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-neutral-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-primary-600 font-semibold">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <svg
                      className="w-5 h-5 text-neutral-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-neutral-500 text-sm">
              No se encontraron productos para "{searchTerm}"
            </div>
          )}

          {/* Ver todos los resultados */}
          {suggestions.length > 0 && (
            <div className="border-t border-neutral-200 bg-neutral-50">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full px-4 py-3 text-sm text-primary-600 font-medium hover:bg-neutral-100 transition-colors text-center"
              >
                Ver todos los resultados para "{searchTerm}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
