import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import Badge from '../atoms/Badge';
import LazyImage from '../atoms/LazyImage';
import { Skeleton } from '../atoms';
import { useState } from 'react';

/**
 * ProductCard - Componente de tarjeta de producto
 *
 * Muestra un producto con imagen, nombre, precio, badges y acciones
 *
 * @param {Object} props
 * @param {Object} props.product - Datos del producto
 * @param {string} props.product._id - ID del producto
 * @param {string} props.product.name - Nombre del producto
 * @param {number} props.product.price - Precio actual
 * @param {number} [props.product.compareAtPrice] - Precio anterior (para mostrar descuento)
 * @param {string} [props.product.sku] - SKU del producto
 * @param {number} [props.product.stock] - Stock disponible
 * @param {boolean} [props.product.isFeatured] - Si es producto destacado
 * @param {Array} [props.product.images] - Array de imágenes
 * @param {Array} [props.product.tags] - Array de tags
 * @param {string} [props.variant='default'] - Variante de estilo ('default', 'compact', 'featured')
 * @param {boolean} [props.showBadges=true] - Mostrar badges
 * @param {Function} [props.onAddToCart] - Callback al agregar al carrito
 * @param {Function} [props.onClick] - Callback al hacer click en la tarjeta
 * @param {string} [props.className] - Clases CSS adicionales
 *
 * @example
 * <ProductCard
 *   product={productData}
 *   onAddToCart={(product) => console.log('Add to cart:', product)}
 *   onClick={(product) => navigate(`/products/${product._id}`)}
 * />
 */
const ProductCard = ({
  product,
  showBadges = true,
  onClick,
  className = '',
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Extraer datos del producto
  const {
    _id,
    name,
    price,
    compareAtPrice,
    stock = 0,
    images = [],
    tags = [],
    isFeatured,
  } = product;

  // Obtener imagen principal
  const primaryImage = images.find((img) => img.isPrimary) || images[0];
  const imageUrl = primaryImage?.url || 'https://via.placeholder.com/400x400?text=No+Image';

  // Calcular descuento si existe compareAtPrice
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // Verificar disponibilidad
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  // Determinar badge principal
  const getBadgeVariant = () => {
    if (isOutOfStock) return { text: 'Agotado', variant: 'neutral' };
    if (hasDiscount) return { text: `-${discountPercentage}%`, variant: 'error' };
    if (isFeatured) return { text: 'Destacado', variant: 'primary' };
    if (tags.includes('nuevo') || tags.includes('new')) return { text: 'Nuevo', variant: 'success' };
    return null;
  };

  const badge = getBadgeVariant();

  // Handler para favoritos
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Handler para click en la tarjeta
  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    } else {
      // Por defecto, navegar a la página de detalle del producto
      navigate(`/product/${_id}`);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Imagen del producto */}
      <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-700 overflow-hidden">
        <LazyImage
          src={imageUrl}
          alt={name}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          objectFit="cover"
        />

        {/* Badge superior derecha */}
        {showBadges && badge && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant={badge.variant} size="md">
              {badge.text}
            </Badge>
          </div>
        )}

        {/* Botón de favoritos - aparece en hover */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 left-3 z-10 w-9 h-9 bg-white dark:bg-neutral-800 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isFavorite ? (
            <HeartIconSolid className="w-5 h-5 text-error-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          )}
        </button>

        {/* Overlay de agotado */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-neutral-900/80 px-4 py-2 rounded-lg">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-4 space-y-3">
        {/* Nombre del producto */}
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 min-h-[3rem]">
          {name}
        </h3>

        {/* Precio */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            ${price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
              ${compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock bajo warning */}
        {isLowStock && !isOutOfStock && (
          <p className="text-xs text-warning-600 dark:text-warning-400 font-medium">
            ¡Solo quedan {stock} unidades!
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * ProductCardSkeleton - Loading state for ProductCard
 *
 * Displays a placeholder skeleton while product data is loading
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * <ProductCardSkeleton />
 */
export const ProductCardSkeleton = ({ className = '' }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Image skeleton */}
      <div className="relative aspect-square bg-neutral-200 dark:bg-neutral-700">
        <Skeleton variant="rectangular" width="100%" height="100%" animation={true} />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton - 2 lines */}
        <div className="space-y-2 min-h-[3rem]">
          <Skeleton variant="text" width="100%" height="1rem" />
          <Skeleton variant="text" width="70%" height="1rem" />
        </div>

        {/* Price skeleton */}
        <div className="flex items-baseline gap-2">
          <Skeleton variant="text" width="80px" height="2rem" />
          <Skeleton variant="text" width="60px" height="1rem" />
        </div>

        {/* Button skeleton */}
        <SkeletonButton fullWidth size="md" />
      </div>
    </div>
  );
};

export default ProductCard;
