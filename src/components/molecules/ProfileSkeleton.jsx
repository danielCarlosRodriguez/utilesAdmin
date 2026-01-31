import Skeleton, { SkeletonText, SkeletonAvatar, SkeletonButton } from '../atoms/Skeleton';

/**
 * ProfileSkeleton - Skeleton para página de perfil
 *
 * Muestra un placeholder animado para la información del perfil de usuario
 * mientras se carga el contenido real.
 *
 * @param {Object} props
 * @param {string} [props.className] - Clases CSS adicionales
 *
 * @example
 * <ProfileSkeleton />
 */
const ProfileSkeleton = ({ className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`} aria-hidden="true">
      {/* Header con avatar */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-4">
          <SkeletonAvatar size="xl" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="200px" height="24px" />
            <Skeleton variant="text" width="150px" height="16px" />
          </div>
          <SkeletonButton size="md" />
        </div>
      </div>

      {/* Formulario de información personal */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <div className="mb-4">
          <Skeleton variant="text" width="180px" height="24px" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton variant="text" width="80px" height="14px" />
              <Skeleton variant="rounded" width="100%" height="40px" />
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <SkeletonButton size="md" />
          <SkeletonButton size="md" />
        </div>
      </div>

      {/* Dirección de envío */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <div className="mb-4">
          <Skeleton variant="text" width="160px" height="24px" />
        </div>

        <div className="space-y-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton variant="text" width="100px" height="14px" />
              <Skeleton variant="rounded" width="100%" height="40px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
