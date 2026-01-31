import Skeleton, { SkeletonText, SkeletonButton } from '../atoms/Skeleton';

/**
 * OrderItemSkeleton - Skeleton para items de orden
 *
 * Muestra un placeholder animado para los items de la lista de órdenes
 * mientras se carga el contenido real.
 *
 * @param {Object} props
 * @param {string} [props.className] - Clases CSS adicionales
 *
 * @example
 * <OrderItemSkeleton />
 *
 * // Lista de skeletons
 * {Array(3).fill(0).map((_, i) => <OrderItemSkeleton key={i} />)}
 */
const OrderItemSkeleton = ({ className = '' }) => {
  return (
    <div
      className={`bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 ${className}`}
      aria-hidden="true"
    >
      {/* Header: Orden ID y fecha */}
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="150px" height="20px" />
          <Skeleton variant="text" width="120px" height="16px" />
        </div>
        <Skeleton variant="rounded" width="90px" height="28px" />
      </div>

      {/* Productos en la orden */}
      <div className="space-y-3 mb-4">
        {Array(2).fill(0).map((_, index) => (
          <div key={index} className="flex gap-3">
            {/* Imagen del producto */}
            <Skeleton variant="rounded" width="60px" height="60px" />

            {/* Info del producto */}
            <div className="flex-1 space-y-2">
              <SkeletonText lines={1} />
              <Skeleton variant="text" width="80px" height="14px" />
            </div>

            {/* Precio */}
            <Skeleton variant="text" width="60px" height="20px" />
          </div>
        ))}
      </div>

      {/* Footer: Total y botón */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="space-y-1">
          <Skeleton variant="text" width="60px" height="14px" />
          <Skeleton variant="text" width="100px" height="24px" />
        </div>
        <SkeletonButton size="md" />
      </div>
    </div>
  );
};

export default OrderItemSkeleton;
