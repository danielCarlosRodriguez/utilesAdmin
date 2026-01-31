/**
 * Skeleton - Componente base para loading skeletons
 *
 * Componente atómico que muestra un placeholder animado mientras se carga contenido.
 * Sigue el patrón de Material Design para skeleton screens.
 *
 * @param {Object} props
 * @param {'text'|'circular'|'rectangular'|'rounded'} [props.variant='rectangular'] - Forma del skeleton
 * @param {string} [props.width] - Ancho (CSS value: '100%', '200px', etc.)
 * @param {string} [props.height] - Alto (CSS value: '20px', '2rem', etc.)
 * @param {string} [props.className] - Clases CSS adicionales
 * @param {boolean} [props.animation=true] - Habilitar animación de pulso
 *
 * @example
 * <Skeleton variant="text" width="100%" height="20px" />
 * <Skeleton variant="circular" width="40px" height="40px" />
 * <Skeleton variant="rectangular" width="100%" height="200px" />
 */
const Skeleton = ({
  variant = 'rectangular',
  width = '100%',
  height = '20px',
  className = '',
  animation = true,
}) => {
  // Estilos base para todos los skeletons
  const baseStyles = `
    bg-neutral-200 dark:bg-neutral-700
    ${animation ? 'animate-pulse' : ''}
  `;

  // Estilos según variante
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const variantClass = variantStyles[variant] || variantStyles.rectangular;

  return (
    <div
      className={`${baseStyles} ${variantClass} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
      role="status"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

/**
 * SkeletonText - Skeleton específico para líneas de texto
 *
 * @param {Object} props
 * @param {number} [props.lines=1] - Número de líneas
 * @param {string} [props.spacing='0.5rem'] - Espacio entre líneas
 * @param {string} [props.lastLineWidth='60%'] - Ancho de la última línea
 * @param {string} [props.className] - Clases CSS adicionales
 *
 * @example
 * <SkeletonText lines={3} spacing="0.75rem" />
 */
export const SkeletonText = ({
  lines = 1,
  spacing = '0.5rem',
  lastLineWidth = '60%',
  className = '',
}) => {
  return (
    <div className={`space-y-[${spacing}] ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height="1rem"
          width={index === lines - 1 && lines > 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
};

/**
 * SkeletonAvatar - Skeleton circular para avatares
 *
 * @param {Object} props
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del avatar
 * @param {string} [props.className] - Clases CSS adicionales
 *
 * @example
 * <SkeletonAvatar size="lg" />
 */
export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: { width: '32px', height: '32px' },
    md: { width: '40px', height: '40px' },
    lg: { width: '64px', height: '64px' },
    xl: { width: '96px', height: '96px' },
  };

  const { width, height } = sizes[size] || sizes.md;

  return <Skeleton variant="circular" width={width} height={height} className={className} />;
};

/**
 * SkeletonButton - Skeleton para botones
 *
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Tamaño del botón
 * @param {boolean} [props.fullWidth=false] - Ancho completo
 * @param {string} [props.className] - Clases CSS adicionales
 *
 * @example
 * <SkeletonButton size="lg" fullWidth />
 */
export const SkeletonButton = ({ size = 'md', fullWidth = false, className = '' }) => {
  const sizes = {
    sm: { height: '32px', width: '80px' },
    md: { height: '40px', width: '120px' },
    lg: { height: '48px', width: '160px' },
  };

  const { width, height } = sizes[size] || sizes.md;

  return (
    <Skeleton
      variant="rounded"
      width={fullWidth ? '100%' : width}
      height={height}
      className={className}
    />
  );
};

export default Skeleton;
