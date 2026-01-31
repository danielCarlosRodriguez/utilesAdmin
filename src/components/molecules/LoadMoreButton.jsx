import Button from '../atoms/Button';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * LoadMoreButton - Botón para cargar más contenido
 *
 * Componente usado como fallback o complemento para infinite scroll.
 * Muestra un botón con indicador de carga y mensaje personalizable.
 *
 * @param {Object} props
 * @param {Function} props.onClick - Callback al hacer click
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.hasMore=true] - Si hay más contenido
 * @param {string} [props.loadingText='Cargando...'] - Texto durante carga
 * @param {string} [props.buttonText='Cargar más'] - Texto del botón
 * @param {string} [props.endText='No hay más productos'] - Texto cuando no hay más
 * @param {string} [props.className] - Clases CSS adicionales
 *
 * @example
 * <LoadMoreButton
 *   onClick={loadMoreProducts}
 *   loading={isLoading}
 *   hasMore={hasNextPage}
 * />
 */
const LoadMoreButton = ({
  onClick,
  loading = false,
  hasMore = true,
  loadingText = 'Cargando...',
  buttonText = 'Cargar más',
  endText = 'No hay más productos',
  className = '',
}) => {
  // Si no hay más contenido, mostrar mensaje final
  if (!hasMore) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          {endText}
        </p>
      </div>
    );
  }

  return (
    <div className={`text-center py-8 ${className}`}>
      <Button
        variant="outline"
        size="lg"
        onClick={onClick}
        loading={loading}
        disabled={loading}
        leftIcon={!loading && <ArrowPathIcon className="w-5 h-5" />}
        className="px-8"
      >
        {loading ? loadingText : buttonText}
      </Button>
    </div>
  );
};

export default LoadMoreButton;
