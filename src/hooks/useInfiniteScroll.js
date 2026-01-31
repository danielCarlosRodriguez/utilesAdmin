import { useEffect, useRef, useCallback } from 'react';

/**
 * useInfiniteScroll - Hook para implementar scroll infinito
 *
 * Detecta cuando el usuario llega al final de la página o de un elemento
 * y ejecuta un callback para cargar más contenido.
 *
 * @param {Object} options
 * @param {Function} options.onLoadMore - Callback para cargar más contenido
 * @param {boolean} [options.hasMore=true] - Si hay más contenido para cargar
 * @param {boolean} [options.loading=false] - Si está cargando actualmente
 * @param {number} [options.threshold=0.8] - Umbral de scroll (0-1) para activar carga
 * @param {HTMLElement} [options.root=null] - Elemento raíz (null = viewport)
 *
 * @returns {Object} - { observerTarget: ref para el elemento sentinel }
 *
 * @example
 * const { observerTarget } = useInfiniteScroll({
 *   onLoadMore: () => fetchMoreProducts(),
 *   hasMore: hasNextPage,
 *   loading: isLoading,
 *   threshold: 0.5,
 * });
 *
 * return (
 *   <div>
 *     {products.map(product => <ProductCard key={product.id} {...product} />)}
 *     <div ref={observerTarget} />
 *   </div>
 * );
 */
const useInfiniteScroll = ({
  onLoadMore,
  hasMore = true,
  loading = false,
  threshold = 0.8,
  root = null,
}) => {
  const observerTarget = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;

      // Si el elemento es visible y hay más contenido y no está cargando
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    // Configurar Intersection Observer
    const observer = new IntersectionObserver(handleObserver, {
      root,
      rootMargin: '0px',
      threshold,
    });

    observer.observe(element);

    // Cleanup
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver, root, threshold]);

  return { observerTarget };
};

export default useInfiniteScroll;
