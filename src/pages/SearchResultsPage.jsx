import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header, Footer, ProductList, FilterSidebar } from '../components/organisms';
import { SortDropdown } from '../components/molecules';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import useProducts from '../hooks/useProducts';

/**
 * SearchResultsPage - Página de resultados de búsqueda
 *
 * Muestra productos filtrados por término de búsqueda
 *
 * @example
 * // URL: /search?q=mouse gaming
 * <SearchResultsPage />
 */
const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // Estado de filtros y ordenamiento
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState(''); // Por defecto, más relevante
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Obtener productos filtrados por búsqueda
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
    pagination,
  } = useProducts({
    search: searchQuery || undefined, // Si no hay query, muestra todos
    limit: 12,
    sort: sortBy || undefined, // Sin sort usa relevancia
    ...filters, // Aplicar filtros adicionales
  });

  // Reset filtros cuando cambia el término de búsqueda
  useEffect(() => {
    setFilters({});
    setSortBy('');
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      <Header />

      <main className="grow">
        {/* Hero Section con término de búsqueda */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-3">
              <MagnifyingGlassIcon className="w-8 h-8" />
              <h1 className="text-4xl font-bold">
                {searchQuery ? 'Resultados de búsqueda' : 'Todos los Productos'}
              </h1>
            </div>

            {searchQuery ? (
              <>
                <p className="text-lg text-primary-100">
                  Mostrando resultados para: <strong>"{searchQuery}"</strong>
                </p>
                {!productsLoading && (
                  <p className="text-sm text-primary-200 mt-2">
                    {pagination?.total || products.length} producto
                    {(pagination?.total || products.length) !== 1 ? 's' : ''} encontrado
                    {(pagination?.total || products.length) !== 1 ? 's' : ''}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-lg text-primary-100">
                  Explorando todos nuestros productos
                </p>
                {!productsLoading && (
                  <p className="text-sm text-primary-200 mt-2">
                    {pagination?.total || products.length} producto
                    {(pagination?.total || products.length) !== 1 ? 's' : ''} disponible
                    {(pagination?.total || products.length) !== 1 ? 's' : ''}
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        {/* Productos Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar de Filtros */}
                <div className="lg:col-span-1">
                  {/* Botón de filtros mobile */}
                  <button
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <FunnelIcon className="w-5 h-5" />
                    Filtros
                    {Object.keys(filters).length > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">
                        {Object.keys(filters).length}
                      </span>
                    )}
                  </button>

                  {/* Filtros Desktop y Mobile */}
                  <div className={`${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
                    <FilterSidebar
                      filters={filters}
                      onFiltersChange={setFilters}
                      showCategories={true} // Mostrar categorías en búsqueda global
                      isOpen={isMobileFilterOpen}
                      onClose={() => setIsMobileFilterOpen(false)}
                    />
                  </div>
                </div>

                {/* Productos */}
                <div className="lg:col-span-3">
                  {/* Barra de herramientas */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    {/* Contador de resultados */}
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {productsLoading ? (
                        <span>Buscando productos...</span>
                      ) : (
                        <span>
                          <strong>{pagination?.total || products.length}</strong> resultado
                          {(pagination?.total || products.length) !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Ordenamiento */}
                    <SortDropdown
                      value={sortBy}
                      onChange={setSortBy}
                    />
                  </div>

                  {/* Lista de productos */}
                  <ProductList
                    products={products}
                    loading={productsLoading}
                    error={productsError}
                    columns={3}
                    title=""
                    emptyMessage={`No se encontraron productos para "${searchQuery}"`}
                  />

                  {/* Mensaje de no resultados mejorado */}
                  {!productsLoading && products.length === 0 && searchQuery && (
                    <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 mt-8">
                      <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-neutral-400 dark:text-neutral-500 mb-4" />
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        No encontramos resultados
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        Intenta con otros términos de búsqueda o explora nuestras categorías.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => setFilters({})}
                          className="px-6 py-3 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
                        >
                          Limpiar filtros
                        </button>
                        <a
                          href="/"
                          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                        >
                          Explorar productos
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResultsPage;
