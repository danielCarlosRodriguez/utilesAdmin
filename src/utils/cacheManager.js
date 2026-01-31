/**
 * CacheManager - Sistema centralizado de gestión de caché
 *
 * Proporciona invalidación explícita de caché para productos y categorías
 */

class CacheManager {
  constructor() {
    // Referencias a las cachés de los hooks
    this.caches = {
      products: null,
      categories: null,
    };
  }

  /**
   * Registra una caché para gestión
   * @param {string} key - Clave de la caché ('products' o 'categories')
   * @param {Map|Object} cache - Referencia a la caché
   */
  register(key, cache) {
    this.caches[key] = cache;
  }

  /**
   * Invalida una caché específica
   * @param {string} key - Clave de la caché a invalidar
   */
  invalidate(key) {
    const cache = this.caches[key];

    if (!cache) {
      console.warn(`⚠️ Caché "${key}" no registrada`);
      return;
    }

    // Limpiar según el tipo de caché
    if (cache instanceof Map) {
      cache.clear();
      console.log(`🗑️ Caché "${key}" (Map) limpiada`);
    } else if (typeof cache === 'object' && cache.clear) {
      cache.clear();
      console.log(`🗑️ Caché "${key}" limpiada`);
    } else {
      console.warn(`⚠️ No se pudo limpiar caché "${key}" - tipo no soportado`);
    }
  }

  /**
   * Invalida todas las cachés registradas
   */
  invalidateAll() {
    Object.keys(this.caches).forEach(key => {
      this.invalidate(key);
    });
    console.log('🗑️ Todas las cachés limpiadas');
  }

  /**
   * Invalida cachés relacionadas con productos
   */
  invalidateProducts() {
    this.invalidate('products');
  }

  /**
   * Invalida cachés relacionadas con categorías
   */
  invalidateCategories() {
    this.invalidate('categories');
  }

  /**
   * Obtiene el estado de una caché
   * @param {string} key - Clave de la caché
   * @returns {Object} Estado de la caché
   */
  getStatus(key) {
    const cache = this.caches[key];

    if (!cache) {
      return { registered: false, size: 0 };
    }

    let size = 0;

    if (cache instanceof Map) {
      size = cache.size;
    } else if (Array.isArray(cache)) {
      size = cache.length;
    }

    return {
      registered: true,
      size,
      type: cache.constructor.name,
    };
  }

  /**
   * Obtiene el estado de todas las cachés
   * @returns {Object} Estado de todas las cachés
   */
  getAllStatus() {
    const status = {};

    Object.keys(this.caches).forEach(key => {
      status[key] = this.getStatus(key);
    });

    return status;
  }
}

// Singleton instance
const cacheManager = new CacheManager();

export default cacheManager;
