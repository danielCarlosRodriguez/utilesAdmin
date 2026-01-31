import Skeleton, { SkeletonText, SkeletonButton } from '../atoms/Skeleton';

/**
 * ProductCardSkeleton - Skeleton para ProductCard
 *
 * Muestra un placeholder animado con la misma estructura visual
 * que ProductCard mientras se carga el contenido real.
 *
 * Mejora la percepción de rendimiento (Perceived Performance).
 *
 * @param {Object} props
 * @param {string} [props.className] - Clases CSS adicionales
 *
 * @example
 * <ProductCardSkeleton />
 *
 * // Múltiples skeletons
 * {Array(6).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
 */
const ProductCardSkeleton = ({ className = '' }) => {
  return (
    <div
      className={`bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Skeleton de imagen del producto */}
      <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-700">
        <Skeleton variant="rectangular" width="100%" height="100%" animation={true} />
      </div>

      {/* Skeleton de información del producto */}
      <div className="p-4 space-y-3">
        {/* Skeleton del nombre del producto (2 líneas) */}
        <div className="min-h-[3rem]">
          <SkeletonText lines={2} spacing="0.5rem" lastLineWidth="70%" />
        </div>

        {/* Skeleton del precio */}
        <div className="flex items-baseline gap-2">
          <Skeleton variant="text" width="80px" height="28px" />
          <Skeleton variant="text" width="60px" height="16px" />
        </div>

        {/* Skeleton del botón */}
        <SkeletonButton size="md" fullWidth />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
