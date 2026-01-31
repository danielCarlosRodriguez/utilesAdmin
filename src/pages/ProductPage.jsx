import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HeartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Header, Footer } from '../components/organisms';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import { productsAPI } from '../services/api';

/**
 * ProductPage - Página de detalle de producto
 *
 * Muestra toda la información del producto: imágenes, descripción,
 * especificaciones técnicas, precio, stock, etc.
 *
 * @example
 * // URL: /product/iphone-15-pro-max
 * <ProductPage />
 */
const ProductPage = () => {
  const { id } = useParams(); // ID o slug del producto

  // Estados
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getById(id);

        if (response.success) {
          // La API devuelve { success: true, data: { product: {...} } }
          const productData = response.data.product || response.data;
          setProduct(productData);
        } else {
          throw new Error(response.message || 'Error al cargar el producto');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handlers
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, product?.stock || 1));
    setQuantity(newQuantity);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
        <Header />
        <main className="grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Cargando producto...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
        <Header />
        <main className="grow flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Producto no encontrado</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Lo sentimos, el producto que buscas no existe o ha sido eliminado.
            </p>
            <Link to="/">
              <Button variant="primary" leftIcon={<ArrowLeftIcon className="w-5 h-5" />}>
                Volver al inicio
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Extract product data
  const {
    name = 'Producto sin nombre',
    description = 'Sin descripción disponible',
    price = 0,
    compareAtPrice = null,
    stock = 0,
    images = [],
    specifications = {},
    category = null,
    tags = [],
    isFeatured = false,
  } = product || {};

  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      <Header />

      <main className="grow">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
              Inicio
            </Link>
            <span>/</span>
            {category && (
              <>
                <Link to={`/${category.slug}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                  {category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">{name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Columna izquierda - Imágenes */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="relative aspect-square bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md">
                <img
                  src={images[selectedImage]?.url || 'https://via.placeholder.com/600?text=No+Image'}
                  alt={name}
                  className="w-full h-full object-cover"
                />

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {hasDiscount && (
                    <Badge variant="error" size="lg">
                      -{discountPercentage}%
                    </Badge>
                  )}
                  {isFeatured && (
                    <Badge variant="primary" size="md">
                      Destacado
                    </Badge>
                  )}
                  {tags.includes('nuevo') && (
                    <Badge variant="success" size="md">
                      Nuevo
                    </Badge>
                  )}
                </div>
              </div>

              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary-500 shadow-md'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Columna derecha - Información */}
            <div className="space-y-6">
              {/* Título */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  {name}
                </h1>
                {category && (
                  <Link
                    to={`/${category.slug}`}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    {category.name}
                  </Link>
                )}
              </div>

              {/* Precio */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary-600">
                  ${price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-neutral-500 dark:text-neutral-400 line-through">
                    ${compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div>
                {isOutOfStock ? (
                  <p className="text-error-600 font-semibold">Producto agotado</p>
                ) : isLowStock ? (
                  <p className="text-warning-600 font-semibold">
                    ¡Solo quedan {stock} unidades!
                  </p>
                ) : (
                  <p className="text-success-600 font-semibold">En stock ({stock} disponibles)</p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Descripción</h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{description}</p>
              </div>

              {/* Cantidad y acciones */}
              <div className="space-y-4">
                {!isOutOfStock && (
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Cantidad:</label>
                    <div className="flex items-center border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="w-16 text-center py-2 border-x border-neutral-300 dark:border-neutral-600 focus:outline-none bg-transparent text-neutral-900 dark:text-neutral-100"
                        min="1"
                        max={stock}
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        disabled={quantity >= stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleToggleFavorite}
                    className="w-14 h-14 flex items-center justify-center border-2 border-neutral-300 dark:border-neutral-600 rounded-lg hover:border-error-500 hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors bg-white dark:bg-neutral-800"
                    aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    {isFavorite ? (
                      <HeartIconSolid className="w-6 h-6 text-error-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Beneficios */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <TruckIcon className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Envío gratis</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">En compras mayores a $50</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Garantía oficial</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">12 meses de garantía del fabricante</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Especificaciones técnicas */}
          {Object.keys(specifications).length > 0 && (
            <div className="mt-12 bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Especificaciones técnicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex border-b border-neutral-200 dark:border-neutral-700 pb-3"
                  >
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 capitalize min-w-[150px]">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
