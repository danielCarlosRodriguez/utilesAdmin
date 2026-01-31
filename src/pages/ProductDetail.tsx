
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { getCategoryColorClass } from '../utils/categoryColors.ts';
import { getProduct, getAllProducts } from '../services/products.ts';

const ProductDetail = () => {
  const { refid } = useParams();
  const navigate = useNavigate();
  const { items, addItem, updateItem, removeItem } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsOutOfStock(false);

    const loadProduct = async () => {
      try {
        // Primero intentar con productos activos y con stock
        let match = await getProduct(refid || '');

        // Si no se encuentra, buscar incluyendo los sin stock
        if (!match && refid) {
          const allProducts = await getAllProducts(true);
          match = allProducts.find(p => p.id === refid) || null;
          if (match && match.stock <= 0) {
            setIsOutOfStock(true);
          }
        }

        if (!isMounted) return;

        if (!match) {
          setProduct(null);
          return;
        }

        setProduct({
          id: match.id,
          title: match.title,
          category: match.category,
          price: match.price,
          detail: match.detail,
          images: match.images,
          brand: match.brand,
          stock: match.stock
        });
      } catch (error) {
        if (isMounted) {
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [refid]);

  useEffect(() => {
    setSelectedImage(0);
  }, [refid]);

  const images = product?.images?.length
    ? product.images.map((img) => `/imagenes/productos/${img}`)
    : [];

  const productTitle = product?.title ?? 'Producto';
  const productCategory = product?.category ?? 'Categoria';
  const productPrice = typeof product?.price === 'number' ? product.price : 0;
  const priceValue = Math.round(productPrice);
  const productDetail = product?.detail ?? 'Sin descripcion disponible.';
  const categoryColorClass = getCategoryColorClass(productCategory);

  const buildOrderMessage = () => {
    const url = window.location.href;
    const total = Math.round(productPrice * quantity);
    const totalLine = Number.isFinite(total) ? `Precio: $${total}` : '';

    return [
      'Hola! Quiero este producto:',
      productTitle,
      `Cantidad: ${quantity}`,
      totalLine,
      `Link: ${url}`
    ]
      .filter(Boolean)
      .join('\n');
  };

  const buildShareMessage = () => {
    const origin = window.location.origin;
    const linkUrl = `${origin}/product/${product?.id ?? ''}`;
    const priceLine = Number.isFinite(priceValue) ? `$${priceValue}` : '';

    return [
      `Refid: ${product?.id ?? 'N/A'}`,
      productTitle,
      priceLine,
      linkUrl
    ]
      .filter(Boolean)
      .join('\n');
  };

  const productId = product?.id ?? refid;
  const cartItem = useMemo(
    () => items.find((item) => item.id === productId),
    [items, productId]
  );

  useEffect(() => {
    if (cartItem?.quantity) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem?.quantity]);

  const handleAddOrRemove = () => {
    if (cartItem) {
      removeItem(productId);
      showToast('Producto quitado del carrito', 'info');
      return;
    }

    // Animación de feedback al agregar
    setIsAddingToCart(true);
    setTimeout(() => setIsAddingToCart(false), 600);

    addItem({
      id: productId,
      title: productTitle,
      brand: product?.brand ?? '',
      price: productPrice,
      quantity
    });
    showToast('Agregado al carrito', 'success');
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (cartItem) {
      updateItem(productId, newQuantity);
    }
  };

  const handleShare = async () => {
    const message = buildShareMessage();
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleImageChange = (idx: number) => {
    setSelectedImage(idx);
  };

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8">
        <div className="animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-48 bg-gray-200 rounded mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Gallery skeleton */}
            <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
              <div className="order-2 md:order-1 flex md:flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="size-20 bg-gray-200 rounded-lg" />
                ))}
              </div>
              <div className="order-1 md:order-2 flex-1 aspect-square md:h-[600px] bg-gray-200 rounded-xl" />
            </div>

            {/* Info skeleton */}
            <div className="lg:col-span-5 space-y-4">
              <div className="h-6 w-24 bg-gray-200 rounded-full" />
              <div className="h-10 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
              <div className="h-14 bg-gray-200 rounded-xl mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8">
        <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-500">
          Producto no encontrado.
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-6 text-sm font-semibold text-primary hover:underline"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8">
      {/* Breadcrumb navegable */}
      <nav className="flex items-center gap-2 mb-8 text-sm text-gray-500 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Home</button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <button
          onClick={() => navigate(`/category/${encodeURIComponent(productCategory)}`)}
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${categoryColorClass} hover:opacity-80 transition-opacity`}
        >
          {productCategory}
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Galería de imágenes */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
          {/* Thumbnails con touch targets mejorados */}
          <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleImageChange(idx)}
                className={`size-20 min-w-[80px] min-h-[80px] rounded-lg border-2 cursor-pointer bg-center bg-cover transition-all duration-300 ${
                  selectedImage === idx
                    ? 'border-primary ring-2 ring-primary/20 scale-105'
                    : 'border-gray-200 hover:border-primary/50 hover:scale-105'
                }`}
                style={{ backgroundImage: `url("${img}")` }}
                aria-label={`Ver imagen ${idx + 1}`}
              />
            ))}
          </div>

          {/* Imagen principal con zoom */}
          <div className="order-1 md:order-2 flex-1 relative bg-white rounded-xl overflow-hidden shadow-sm aspect-square md:aspect-auto md:h-[600px] border border-gray-100">
            <div
              onClick={() => setIsZoomed(true)}
              className={`absolute inset-0 bg-center bg-no-repeat bg-cover cursor-zoom-in transition-transform duration-500 ${
                selectedImage !== null ? 'animate-fade-in' : ''
              }`}
              style={{ backgroundImage: images[selectedImage] ? `url("${images[selectedImage]}")` : 'none' }}
            />
            {/* Indicador de zoom */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur rounded-full px-3 py-1.5 text-xs text-gray-600 flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-sm">zoom_in</span>
              Click para ampliar
            </div>
          </div>
        </div>

        {/* Información del producto */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            {/* Badge de categoría con color */}
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${categoryColorClass}`}>
                {productCategory}
              </span>
            </div>

            <h1 className="text-4xl font-black text-[#111418] leading-tight mb-2">
              {productTitle}
            </h1>
            <p className="text-sm text-gray-500">RefId: {product?.id ?? 'N/A'}</p>
            <p className="text-sm text-gray-500 mb-4">{product?.brand ?? 'N/A'}</p>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-primary">${priceValue}</span>
              <button
                onClick={handleShare}
                className="p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:text-primary text-gray-600 transition-all"
                aria-label="Compartir producto"
              >
                <span className="material-symbols-outlined text-[24px]">share</span>
              </button>
            </div>
            <p className="text-base text-gray-600 leading-relaxed">
              {productDetail}
            </p>
          </div>

          <div className="py-6 border-y border-[#f0f2f4]">
            {isOutOfStock ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="flex items-center gap-2 text-red-500">
                  <span className="material-symbols-outlined">inventory_2</span>
                  <span className="font-bold">Sin stock disponible</span>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Este producto no está disponible actualmente. Vuelve a revisar más tarde.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {/* Selector de cantidad con touch targets mejorados */}
                  <div className="flex items-center w-32 border border-gray-200 rounded-lg overflow-hidden shrink-0">
                    <button
                      onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                      className="flex-1 py-3 min-h-[44px] hover:bg-gray-50 text-gray-500 transition-colors text-lg font-medium"
                    >
                      -
                    </button>
                    <span className="flex-1 py-3 text-center font-semibold text-sm">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="flex-1 py-3 min-h-[44px] hover:bg-gray-50 text-gray-500 transition-colors text-lg font-medium"
                    >
                      +
                    </button>
                  </div>
                  {/* Botón con animación de feedback */}
                  <button
                    onClick={handleAddOrRemove}
                    className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition-all duration-300 ${
                      isAddingToCart ? 'scale-95' : 'scale-100'
                    } ${
                      cartItem
                        ? 'bg-white text-primary border-2 border-primary hover:bg-primary/10'
                        : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
                    }`}
                  >
                    <span className={`material-symbols-outlined transition-transform duration-300 ${isAddingToCart ? 'scale-125' : ''}`}>
                      {cartItem ? 'remove_shopping_cart' : 'add_shopping_cart'}
                    </span>
                    {cartItem ? 'Quitar del carrito' : 'Agregar al carrito'}
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-3 w-32 text-center">
                  Total: ${Math.round(productPrice * quantity)}
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Espacio para futuras características */}
          </div>
        </div>
      </div>

      {/* Modal de Zoom */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 size-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setIsZoomed(false)}
            aria-label="Cerrar zoom"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          {/* Navegación de imágenes en zoom */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 size-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
                }}
                aria-label="Imagen anterior"
              >
                <span className="material-symbols-outlined text-2xl">chevron_left</span>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 size-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev + 1) % images.length);
                }}
                aria-label="Imagen siguiente"
              >
                <span className="material-symbols-outlined text-2xl">chevron_right</span>
              </button>
            </>
          )}

          <img
            src={images[selectedImage]}
            alt={productTitle}
            className="max-h-[90vh] max-w-[90vw] object-contain animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Indicador de imagen actual */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(idx);
                  }}
                  className={`size-2 rounded-full transition-all ${
                    selectedImage === idx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Ir a imagen ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
