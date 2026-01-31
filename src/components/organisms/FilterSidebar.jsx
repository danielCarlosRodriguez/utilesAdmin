import { useState, useEffect } from 'react';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useCategories } from '../../hooks';
import PriceRangeFilter from '../molecules/PriceRangeFilter';

/**
 * FilterSidebar Component - Organism
 *
 * Sidebar con filtros múltiples para productos
 *
 * @param {Object} props
 * @param {Object} props.filters - Filtros actuales aplicados
 * @param {Function} props.onFiltersChange - Callback cuando cambian los filtros
 * @param {boolean} [props.isOpen=true] - Si el sidebar está abierto (para mobile)
 * @param {Function} [props.onClose] - Callback para cerrar el sidebar (mobile)
 * @param {boolean} [props.showCategories=true] - Mostrar filtro de categorías
 * @param {string} [props.className] - Clases adicionales
 *
 * @example
 * const [filters, setFilters] = useState({});
 * <FilterSidebar
 *   filters={filters}
 *   onFiltersChange={setFilters}
 * />
 */
const FilterSidebar = ({
  filters = {},
  onFiltersChange,
  isOpen = true,
  onClose,
  showCategories = true,
  className = '',
}) => {
  const { data: categories, loading: categoriesLoading } = useCategories();

  const [localFilters, setLocalFilters] = useState(filters);

  // Sincronizar filtros locales con props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Actualizar filtro específico
  const updateFilter = (key, value) => {
    const newFilters = { ...localFilters };

    if (value === null || value === undefined || value === '') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }

    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  // Actualizar rango de precio
  const updatePriceRange = (min, max) => {
    const newFilters = { ...localFilters };

    if (min !== undefined && min !== null) {
      newFilters.minPrice = min;
    } else {
      delete newFilters.minPrice;
    }

    if (max !== undefined && max !== null) {
      newFilters.maxPrice = max;
    } else {
      delete newFilters.maxPrice;
    }

    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setLocalFilters({});
    onFiltersChange?.({});
  };

  // Contar filtros activos
  const activeFiltersCount = Object.keys(localFilters).filter(
    (key) => !['page', 'limit', 'sort'].includes(key)
  ).length;

  return (
    <aside
      className={`
        bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700
        ${isOpen ? 'block' : 'hidden lg:block'}
        ${className}
      `}
    >
      <div className="sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Filtros</h2>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>

            {/* Botón cerrar (mobile) */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                aria-label="Cerrar filtros"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Botón limpiar filtros */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="w-full px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
            >
              Limpiar filtros
            </button>
          )}

          <div className="space-y-6 divide-y divide-neutral-200 dark:divide-neutral-700">
            {/* Filtro de Categorías */}
            {showCategories && (
              <div className="pt-6 first:pt-0">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Categorías
                </h3>

                {categoriesLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category._id}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={localFilters.category === category.slug}
                          onChange={(e) =>
                            updateFilter(
                              'category',
                              e.target.checked ? category.slug : null
                            )
                          }
                          className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Filtro de Precio */}
            <div className="pt-6">
              <PriceRangeFilter
                min={0}
                max={500000}
                defaultMinValue={localFilters.minPrice}
                defaultMaxValue={localFilters.maxPrice}
                onChange={updatePriceRange}
              />
            </div>

            {/* Filtro de Disponibilidad */}
            <div className="pt-6">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Disponibilidad
              </h3>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={localFilters.inStock === true}
                    onChange={(e) =>
                      updateFilter('inStock', e.target.checked ? true : null)
                    }
                    className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                    Solo productos en stock
                  </span>
                </label>
              </div>
            </div>

            {/* Filtro de Ofertas */}
            <div className="pt-6">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Ofertas
              </h3>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={localFilters.onSale === true}
                    onChange={(e) =>
                      updateFilter('onSale', e.target.checked ? true : null)
                    }
                    className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                    Solo productos en oferta
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={localFilters.featured === true}
                    onChange={(e) =>
                      updateFilter('featured', e.target.checked ? true : null)
                    }
                    className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                    Productos destacados
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
