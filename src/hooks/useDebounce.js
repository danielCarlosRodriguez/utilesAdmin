import { useState, useEffect } from 'react';

/**
 * Custom Hook - useDebounce
 *
 * Retrasa la actualización de un valor hasta que haya pasado un tiempo sin cambios
 * Útil para optimizar búsquedas en tiempo real y reducir llamadas a la API
 *
 * @param {*} value - Valor a debounce
 * @param {number} delay - Tiempo de espera en milisegundos (default: 500ms)
 *
 * @returns {*} Valor debounced
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // Esta búsqueda solo se ejecuta 500ms después de que el usuario deja de escribir
 *   if (debouncedSearch) {
 *     searchAPI(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Crear un timer que actualice el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout si el valor cambia antes del delay
    // Esto cancela la actualización anterior y crea una nueva
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
