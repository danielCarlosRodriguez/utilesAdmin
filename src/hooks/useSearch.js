import { useState, useEffect, useMemo } from 'react';
import useProducts from './useProducts';
import useDebounce from './useDebounce';

/**
 * Custom Hook - useSearch
 *
 * Hook especializado para búsqueda de productos con debouncing automático
 * y sugerencias en tiempo real
 *
 * @param {Object} config - Configuración de búsqueda
 * @param {number} [config.debounceTime=300] - Tiempo de debounce en ms
 * @param {number} [config.minChars=2] - Mínimo de caracteres para buscar
 * @param {number} [config.suggestionsLimit=5] - Cantidad de sugerencias
 * @param {Object} [config.filters={}] - Filtros adicionales (precio, categoría, etc.)
 *
 * @returns {Object} Estado y funciones de búsqueda
 * @returns {string} searchTerm - Término de búsqueda actual
 * @returns {Function} setSearchTerm - Actualizar término de búsqueda
 * @returns {Array} results - Resultados de búsqueda
 * @returns {Array} suggestions - Sugerencias para autocomplete
 * @returns {boolean} isSearching - Si está buscando
 * @returns {Object|null} error - Error si ocurrió
 * @returns {Function} clearSearch - Limpiar búsqueda
 *
 * @example
 * const {
 *   searchTerm,
 *   setSearchTerm,
 *   results,
 *   suggestions,
 *   isSearching
 * } = useSearch({ minChars: 3 });
 */
const useSearch = (config = {}) => {
  const {
    debounceTime = 300,
    minChars = 2,
    suggestionsLimit = 5,
    filters = {},
  } = config;

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Aplicar debounce al término de búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, debounceTime);

  // Determinar si debe realizar la búsqueda
  const shouldSearch = debouncedSearchTerm.length >= minChars;

  // Búsqueda completa de productos
  const {
    data: results,
    loading: isSearching,
    error,
    pagination,
  } = useProducts(
    {
      search: debouncedSearchTerm,
      ...filters,
    },
    {
      enabled: shouldSearch,
    }
  );

  // Búsqueda para sugerencias (limitada)
  const {
    data: suggestionsData,
    loading: isSuggestionsLoading,
  } = useProducts(
    {
      search: debouncedSearchTerm,
      limit: suggestionsLimit,
    },
    {
      enabled: shouldSearch && showSuggestions,
    }
  );

  // Generar sugerencias únicas basadas en nombres de productos
  const suggestions = useMemo(() => {
    if (!suggestionsData || suggestionsData.length === 0) return [];

    return suggestionsData.map((product) => ({
      id: product._id,
      name: product.name,
      image: product.images?.[0],
      price: product.price,
      slug: product.slug,
    }));
  }, [suggestionsData]);

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  // Ocultar sugerencias cuando se limpia la búsqueda
  useEffect(() => {
    if (searchTerm.length === 0) {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    results: shouldSearch ? results : [],
    suggestions,
    isSearching: isSearching || isSuggestionsLoading,
    error,
    pagination,
    clearSearch,
    showSuggestions,
    setShowSuggestions,
    hasResults: results.length > 0,
    hasMinChars: searchTerm.length >= minChars,
  };
};

export default useSearch;
