import { useState, useRef, useEffect } from 'react';

/**
 * LazyImage - Componente de imagen con lazy loading
 *
 * Carga la imagen solo cuando está visible en el viewport.
 * Muestra un placeholder mientras se carga la imagen.
 *
 * @param {Object} props
 * @param {string} props.src - URL de la imagen
 * @param {string} props.alt - Texto alternativo
 * @param {string} [props.placeholder] - URL del placeholder o color
 * @param {string} [props.className] - Clases CSS adicionales
 * @param {Function} [props.onLoad] - Callback cuando la imagen se carga
 * @param {Function} [props.onError] - Callback si hay error
 * @param {number} [props.threshold=0.1] - Umbral de visibilidad (0-1)
 * @param {string} [props.objectFit='cover'] - Object fit CSS
 *
 * @example
 * <LazyImage
 *   src="https://example.com/image.jpg"
 *   alt="Product image"
 *   placeholder="https://via.placeholder.com/400"
 *   className="w-full h-full"
 * />
 */
const LazyImage = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f5f5f5"/%3E%3C/svg%3E',
  className = '',
  onLoad,
  onError,
  threshold = 0.1,
  objectFit = 'cover',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer para detectar visibilidad
  useEffect(() => {
    const element = imgRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Cargar 50px antes de que sea visible
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  // Handlers
  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${className}`}
      {...props}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          className={`absolute inset-0 w-full h-full object-${objectFit} blur-sm scale-105`}
          aria-hidden="true"
        />
      )}

      {/* Imagen real (solo se carga cuando es visible) */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`
            w-full h-full object-${objectFit}
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
          <div className="text-center text-neutral-400 dark:text-neutral-600">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">Imagen no disponible</p>
          </div>
        </div>
      )}

      {/* Loading skeleton mientras se carga */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;
