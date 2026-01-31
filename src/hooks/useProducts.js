import { useState, useEffect, useCallback, useRef } from 'react';
import { productsAPI } from '../services/api';
import cacheManager from '../utils/cacheManager';

// Cache para productos con diferentes configuraciones
const productsCache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

// Registrar caché con el CacheManager
cacheManager.register('products', productsCache);

// Generar clave única para la cache basada en las opciones
const getCacheKey = (options) => {
  return JSON.stringify(options);
};

/**
 * Custom Hook - useProducts
 *
 * Obtiene productos de la API con filtros flexibles, manejo de estados y caché
 *
 * @param {Object} options - Opciones de consulta
 * @param {number} [options.page=1] - Número de página
 * @param {number} [options.limit] - Cantidad de productos a traer
 * @param {string} [options.search] - Búsqueda por nombre, descripción, tags, SKU
 * @param {string} [options.category] - ID o slug de categoría
 * @param {number} [options.minPrice] - Precio mínimo
 * @param {number} [options.maxPrice] - Precio máximo
 * @param {boolean} [options.inStock] - Solo productos en stock
 * @param {boolean} [options.onSale] - Solo productos en oferta (con compareAtPrice)
 * @param {boolean} [options.featured] - Solo productos destacados (isFeatured=true)
 * @param {string} [options.tags] - Tags separados por comas
 * @param {string} [options.sort] - Ordenamiento (ej: 'price', '-price', 'name', '-createdAt')
 * @param {boolean} [options.enabled=true] - Si false, no hace la petición automáticamente
 *
 * @returns {Object} Estado y funciones
 * @returns {Array} data - Array de productos
 * @returns {boolean} loading - Si está cargando
 * @returns {Object|null} error - Error si ocurrió
 * @returns {Object|null} pagination - Info de paginación (total, pages, hasNextPage, etc.)
 * @returns {Function} refetch - Función para volver a cargar los datos
 *
 * @example
 * // Obtener 6 productos destacados para la Home
 * const { data, loading, error } = useProducts({ featured: true, limit: 6 });
 *
 * @example
 * // Obtener productos de una categoría específica
 * const { data, loading, pagination } = useProducts({
 *   category: 'laptops',
 *   limit: 12,
 *   page: currentPage
 * });
 *
 * @example
 * // Buscar productos con filtros
 * const { data, loading } = useProducts({
 *   search: 'mouse gaming',
 *   inStock: true,
 *   minPrice: 20,
 *   maxPrice: 100,
 *   sort: 'price'
 * });
 *
 * @example
 * // Control manual del fetch
 * const { data, loading, refetch } = useProducts({ featured: true }, { enabled: false });
 * // Llamar manualmente cuando sea necesario
 * useEffect(() => {
 *   refetch();
 * }, [someCondition]);
 */
const useProducts = (options = {}, config = {}) => {
  const { enabled = true } = config;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const hasFetched = useRef(false);

  const fetchProducts = useCallback(async (force = false) => {
    try {
      // Construir parámetros de consulta
      const params = {};

      // Paginación
      if (options.page) params.page = options.page;
      if (options.limit) params.limit = options.limit;

      // Filtros de búsqueda
      if (options.search) params.search = options.search;
      if (options.category) params.category = options.category;

      // Filtros de precio
      if (options.minPrice !== undefined) params.minPrice = options.minPrice;
      if (options.maxPrice !== undefined) params.maxPrice = options.maxPrice;

      // Filtros booleanos
      if (options.inStock !== undefined) params.inStock = options.inStock;
      if (options.onSale !== undefined) params.onSale = options.onSale;
      if (options.featured !== undefined) params.featured = options.featured;

      // Filtros adicionales
      if (options.tags) params.tags = options.tags;
      if (options.sort) params.sort = options.sort;

      // Generar clave de cache
      const cacheKey = getCacheKey(params);

      // Verificar cache
      const now = Date.now();
      const cached = productsCache.get(cacheKey);
      const isCacheValid = cached && (now - cached.timestamp < CACHE_DURATION);

      if (!force && isCacheValid) {
        setData(cached.data);
        setPagination(cached.pagination);
        return;
      }

      setLoading(true);
      setError(null);

      // Llamada a la API
      const response = await productsAPI.getAll(params);

      // Actualizar estados con la respuesta
      if (response.success) {
        // La API devuelve { success: true, data: { products: [...], pagination: {...} } }
        const productsData = response.data?.products || response.data || [];
        const paginationData = response.data?.pagination || response.pagination || null;

        setData(productsData);
        setPagination(paginationData);

        // Actualizar cache
        productsCache.set(cacheKey, {
          data: productsData,
          pagination: paginationData,
          timestamp: Date.now(),
        });
      } else {
        throw new Error(response.message || 'Error al obtener productos');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err);
      setData([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [
    options.page,
    options.limit,
    options.search,
    options.category,
    options.minPrice,
    options.maxPrice,
    options.inStock,
    options.onSale,
    options.featured,
    options.tags,
    options.sort,
  ]);

  // Efecto para cargar productos automáticamente (solo una vez por configuración)
  useEffect(() => {
    if (enabled && !hasFetched.current) {
      hasFetched.current = true;
      fetchProducts();
    }
  }, [enabled, fetchProducts]);

  return {
    data,
    loading,
    error,
    pagination,
    refetch: fetchProducts,
  };
};

export default useProducts;
