import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header, Footer, ProductList, FilterSidebar } from '../components/organisms';
import { SortDropdown } from '../components/molecules';
import { FunnelIcon } from '@heroicons/react/24/outline';
import useProducts from '../hooks/useProducts';
import useCategories from '../hooks/useCategories';

/**
 * CategoryPage - Página de categoría
 *
 * Muestra productos filtrados por categoría según el slug en la URL
 *
 * @example
 * // URL: /laptops
 * <CategoryPage />
 */
const CategoryPage = () => {
  const { slug } = useParams(); // Obtener slug de la URL (ej: "laptops")

  // Estado de filtros y ordenamiento
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('-createdAt');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Obtener categorías para encontrar el ID de la categoría actual
  const { data: categories, loading: categoriesLoading } = useCategories();

  // Encontrar la categoría actual por slug
  const currentCategory = categories.find((cat) => cat.slug === slug);

  // Obtener productos filtrados por categoría
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
    pagination
  } = useProducts(
    {
      category: currentCategory?._id,
      limit: 12,
      sort: sortBy,
      ...filters, // Aplicar filtros adicionales
    },
    {
      enabled: !!currentCategory?._id // Solo cargar si tenemos el ID de categoría
    }
  );

  // Estado de carga combinado
  const isLoading = categoriesLoading || productsLoading;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      <Header />

      <main className="grow">
        {/* Hero Section con nombre de categoría */}
        <section className="bg-linear-to-br from-primary-600 to-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-white/20 rounded w-48 mx-auto mb-3"></div>
                  <div className="h-4 bg-white/20 rounded w-72 mx-auto"></div>
                </div>
              </div>
            ) : currentCategory ? (
              <>
                <h1 className="text-4xl font-bold mb-3">{currentCategory.name}</h1>
                <p className="text-lg text-primary-100">
                  {currentCategory.description || `Explora nuestra selección de ${currentCategory.name.toLowerCase()}`}
                </p>
                <p className="text-sm text-primary-200 mt-2">
                  {currentCategory.productCount || products.length} productos disponibles
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-3">Categoría no encontrada</h1>
                <p className="text-lg text-primary-100">
                  Lo sentimos, no pudimos encontrar la categoría "{slug}"
                </p>
              </>
            )}
          </div>
        </section>

        {/* Productos Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {!currentCategory && !isLoading ? (
              <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  La categoría que buscas no existe o ha sido eliminada.
                </p>
                <a
                  href="/"
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Volver al inicio
                </a>
              </div>
            ) : (
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
                      showCategories={false} // No mostrar categorías ya que estamos en una página de categoría
                      isOpen={isMobileFilterOpen}
                      onClose={() => setIsMobileFilterOpen(false)}
                    />
                  </div>
                </div>

                {/* Productos */}
                <div className="lg:col-span-3">
                  {/* Barra de herramientas */}
                  <div className="flex items-center justify-between mb-6">
                    {/* Contador de resultados */}
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {isLoading ? (
                        <span>Cargando productos...</span>
                      ) : (
                        <span>
                          <strong className="text-neutral-900 dark:text-neutral-100">{pagination?.total || products.length}</strong> producto
                          {(pagination?.total || products.length) !== 1 ? 's' : ''} encontrado
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
                    loading={isLoading}
                    error={productsError}
                    columns={3}
                    title=""
                    emptyMessage={`No hay productos disponibles en ${currentCategory?.name || 'esta categoría'}`}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
