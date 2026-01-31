import ProductCard, { ProductCardSkeleton } from '../molecules/ProductCard';

/**
 * ProductList - Componente de lista/grilla de productos
 *
 * Muestra una grilla responsiva de productos con estados de carga y vacío
 *
 * @param {Object} props
 * @param {Array} props.products - Array de productos a mostrar
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {Object} [props.error=null] - Error si ocurrió
 * @param {number} [props.columns=3] - Número de columnas en desktop (1-6)
 * @param {string} [props.title] - Título de la sección
 * @param {string} [props.emptyMessage='No se encontraron productos'] - Mensaje cuando no hay productos
 * @param {Function} [props.onAddToCart] - Callback al agregar al carrito
 * @param {Function} [props.onProductClick] - Callback al hacer click en un producto
 * @param {boolean} [props.showBadges=true] - Mostrar badges en las tarjetas
 * @param {string} [props.className] - Clases CSS adicionales
 *
 * @example
 * <ProductList
 *   products={products}
 *   loading={loading}
 *   title="Productos Destacados"
 *   columns={3}
 *   onAddToCart={handleAddToCart}
 *   onProductClick={handleProductClick}
 * />
 */
const ProductList = ({
  products = [],
  loading = false,
  error = null,
  columns = 3,
  title,
  emptyMessage = 'No se encontraron productos',
  onAddToCart,
  onProductClick,
  showBadges = true,
  className = '',
}) => {
  // Mapeo de columnas a clases de Tailwind
  const gridColsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  const gridCols = gridColsMap[columns] || gridColsMap[3];

  // Estado de error
  if (error) {
    return (
      <div className={className}>
        {title && (
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
            {title}
          </h2>
        )}
        <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-6 text-center">
          <svg
            className="w-12 h-12 text-error-500 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-error-700 dark:text-error-400 font-medium mb-2">
            Error al cargar productos
          </p>
          <p className="text-error-600 dark:text-error-500 text-sm">
            {error.message || 'Ocurrió un error inesperado'}
          </p>
        </div>
      </div>
    );
  }

  // Estado de carga
  if (loading) {
    return (
      <div className={className}>
        {title && (
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
            {title}
          </h2>
        )}
        <div className={`grid ${gridCols} gap-6`}>
          {Array.from({ length: columns * 2 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Estado vacío
  if (!products || products.length === 0) {
    return (
      <div className={className}>
        {title && (
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
            {title}
          </h2>
        )}
        <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-12 text-center">
          <svg
            className="w-16 h-16 text-neutral-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg font-medium mb-2">
            {emptyMessage}
          </p>
          <p className="text-neutral-500 dark:text-neutral-500 text-sm">
            Intenta ajustar los filtros o buscar algo diferente
          </p>
        </div>
      </div>
    );
  }

  // Estado normal - Mostrar productos
  return (
    <div className={className}>
      {/* Título */}
      {title && (
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {title}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      )}

      {/* Grid de productos */}
      <div className={`grid ${gridCols} gap-6`}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
            onClick={onProductClick}
            showBadges={showBadges}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
