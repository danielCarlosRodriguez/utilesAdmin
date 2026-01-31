/**
 * LoadingScreen - Pantalla de carga para Suspense (Code Splitting)
 *
 * Se muestra mientras se cargan componentes lazy-loaded
 */

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block relative w-20 h-20 mb-6">
          <div className="absolute border-4 border-primary-200 dark:border-primary-900 rounded-full w-20 h-20"></div>
          <div className="absolute border-4 border-primary-600 dark:border-primary-400 rounded-full w-20 h-20 border-t-transparent animate-spin"></div>
        </div>

        {/* Texto */}
        <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          Cargando...
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Por favor espera un momento
        </p>
      </div>
    </div>
  );
}
