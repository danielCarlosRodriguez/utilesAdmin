import { useState, useEffect, useCallback, useRef } from 'react';
import { categoriesAPI } from '../services/api';
import cacheManager from '../utils/cacheManager';
import logger from '../utils/logger';

// Cache simple para evitar múltiples peticiones
let categoriesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Objeto cache compatible con CacheManager
const cacheObject = {
  clear: () => {
    categoriesCache = null;
    cacheTimestamp = null;
  }
};

// Registrar caché con el CacheManager
cacheManager.register('categories', cacheObject);

/**
 * Custom Hook - useCategories
 *
 * Obtiene categorías de la API con caché para evitar peticiones duplicadas
 *
 * @param {Object} config - Configuración del hook
 * @param {boolean} [config.enabled=true] - Si false, no hace la petición automáticamente
 *
 * @returns {Object} Estado y funciones
 * @returns {Array} data - Array de categorías
 * @returns {boolean} loading - Si está cargando
 * @returns {Object|null} error - Error si ocurrió
 * @returns {Function} refetch - Función para volver a cargar los datos
 *
 * @example
 * // Obtener todas las categorías
 * const { data: categories, loading, error } = useCategories();
 *
 * @example
 * // Control manual del fetch
 * const { data, loading, refetch } = useCategories({ enabled: false });
 * // Llamar manualmente cuando sea necesario
 * useEffect(() => {
 *   refetch();
 * }, [someCondition]);
 */
const useCategories = (config = {}) => {
  const { enabled = true } = config;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const fetchCategories = useCallback(async (force = false) => {
    // Si ya hay datos en cache y no ha expirado, usarlos
    const now = Date.now();
    const isCacheValid = categoriesCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION);

    if (!force && isCacheValid) {
      setData(categoriesCache);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Llamada a la API
      const response = await categoriesAPI.getAll();

      // Actualizar estados con la respuesta
      if (response.success) {
        // La API devuelve { success: true, data: { categories: [...], total: N } }
        const categoriesData = response.data?.categories || response.data || [];

        // Debug: Log de categorías recibidas (solo en desarrollo)
        logger.log('📥 Categorías recibidas del backend:', categoriesData.length, 'categorías');
        if (categoriesData.length > 0) {
          // Verificar si la última categoría tiene specificationTemplate
          const lastCategory = categoriesData[categoriesData.length - 1];
          logger.log('📋 Última categoría:', lastCategory.name);
          logger.log('📋 SpecificationTemplate de última categoría:', lastCategory.specificationTemplate);
        }

        setData(categoriesData);

        // Actualizar cache
        categoriesCache = categoriesData;
        cacheTimestamp = Date.now();
      } else {
        throw new Error(response.message || 'Error al obtener categorías');
      }
    } catch (err) {
      logger.error('Error fetching categories:', err);
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para cargar categorías automáticamente (solo una vez)
  useEffect(() => {
    if (enabled && !hasFetched.current) {
      hasFetched.current = true;
      fetchCategories();
    }
  }, [enabled, fetchCategories]);

  return {
    data,
    loading,
    error,
    refetch: fetchCategories,
  };
};

export default useCategories;
